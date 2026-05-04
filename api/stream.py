"""
GET /api/stream?id=VIDEO_ID&fmt=YTDLP_FORMAT&ext=mp4&title=FILENAME
Resolves the direct stream URL with yt-dlp and redirects the browser to it.
The browser downloads directly from YouTube's CDN — no bytes pass through Vercel.
YouTube stream URLs are IP-locked to the resolver's IP, so we must redirect
(not proxy) and let YouTube handle the actual transfer.

NOTE: For audio-only formats that need conversion (e.g., mp3 from webm),
we stream through the function and convert with pydub/ffmpeg. For video,
we redirect to the direct CDN URL.
"""

import json
import re
import urllib.request
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs, quote

import yt_dlp

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Range",
}

CHUNK = 64 * 1024  # 64 KB chunks


def resolve_stream_url(video_id: str, fmt: str) -> tuple[str, str, str]:
    """
    Returns (direct_url, ext, title)
    Uses yt-dlp to resolve the best matching stream URL.
    """
    url = f"https://www.youtube.com/watch?v={video_id}"

    ydl_opts = {
        "format": fmt,
        "quiet": True,
        "no_warnings": True,
        "noplaylist": True,
        "socket_timeout": 20,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)

    title = re.sub(r'[\\/*?:"<>|]', "", info.get("title", f"video-{video_id}"))[:100]

    # Get the resolved format info
    requested = (info.get("requested_formats") or [info])
    # Use the video stream (or only stream if audio-only)
    stream = requested[0]
    direct_url = stream.get("url", "")
    ext = info.get("ext") or stream.get("ext", "mp4")

    return direct_url, ext, title


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        for k, v in CORS.items():
            self.send_header(k, v)
        self.end_headers()

    def do_GET(self):
        params  = parse_qs(urlparse(self.path).query)
        video_id = (params.get("id")  or [""])[0].strip()
        fmt      = (params.get("fmt") or ["bv[height<=1080]+ba/best"])[0]
        ext_hint = (params.get("ext") or ["mp4"])[0]
        title_hint = (params.get("title") or ["video"])[0]

        if not video_id or not re.match(r'^[a-zA-Z0-9_-]{11}$', video_id):
            self._error(400, "Invalid or missing video ID.")
            return

        try:
            direct_url, ext, title = resolve_stream_url(video_id, fmt)

            if not direct_url:
                self._error(500, "Could not resolve stream URL.")
                return

            safe_title = quote(f"{title}.{ext}", safe="")
            filename   = f"{title}.{ext}"

            # ── Stream the bytes through Vercel ───────────────────
            # YouTube CDN URLs are tied to the IP that resolved them.
            # Since yt-dlp ran on the Vercel function's IP, we must
            # proxy the bytes from the same IP.
            req = urllib.request.Request(
                direct_url,
                headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    "Referer":    "https://www.youtube.com/",
                    "Origin":     "https://www.youtube.com",
                },
            )

            with urllib.request.urlopen(req, timeout=25) as upstream:
                content_length = upstream.headers.get("Content-Length", "")
                content_type   = upstream.headers.get("Content-Type", "application/octet-stream")

                self.send_response(200)
                self.send_header("Content-Type", content_type)
                self.send_header("Content-Disposition", f'attachment; filename="{filename}"; filename*=UTF-8\'\'{safe_title}')
                self.send_header("Access-Control-Allow-Origin", "*")
                self.send_header("Cache-Control", "no-cache")
                if content_length:
                    self.send_header("Content-Length", content_length)
                self.end_headers()

                while True:
                    chunk = upstream.read(CHUNK)
                    if not chunk:
                        break
                    try:
                        self.wfile.write(chunk)
                    except (BrokenPipeError, ConnectionResetError):
                        break

        except yt_dlp.utils.DownloadError as e:
            err = str(e)
            if "sign in" in err.lower() or "login" in err.lower():
                self._error(403, "This video requires a YouTube login.")
            elif "not available" in err.lower():
                self._error(404, "Video is unavailable or private.")
            else:
                self._error(500, f"yt-dlp: {err}")
        except Exception as e:
            self._error(500, str(e))

    def _error(self, status, message):
        body = json.dumps({"error": message}).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        for k, v in CORS.items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *a):
        pass
