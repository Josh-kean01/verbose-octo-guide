"""
Vercel Python Serverless Function — /api/download
Resolves a YouTube video URL to a direct streamable/downloadable link
using yt-dlp (no file is stored on the server).

Query params:
  - id      : YouTube video ID (required)
  - format  : yt-dlp format string (default: "bv[height<=1080]+ba/best")
  - mode    : "video" | "audio"  (default: "video")
  - quality : "max"|"2160"|"1440"|"1080"|"720"|"480"|"360"|"144"
  - aformat : "mp3"|"opus"|"wav"|"ogg" (used when mode=audio)
  - abitrate: "320"|"256"|"128"
"""

import json
import re
import sys
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# ── Install yt-dlp at runtime if not present ────────────────
try:
    import yt_dlp
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "yt-dlp", "-q"])
    import yt_dlp


# ── Quality → yt-dlp format map ────────────────────────────
QUALITY_MAP = {
    "max":  "bv+ba/best",
    "4320": "bv[height<=4320]+ba/best",
    "2160": "bv[height<=2160]+ba/best",
    "1440": "bv[height<=1440]+ba/best",
    "1080": "bv[height<=1080]+ba/best",
    "720":  "bv[height<=720]+ba/best",
    "480":  "bv[height<=480]+ba/best",
    "360":  "bv[height<=360]+ba/best",
    "240":  "bv[height<=240]+ba/best",
    "144":  "bv[height<=144]+ba/best",
}

AUDIO_FORMAT_MAP = {
    "mp3":  "bestaudio/best",
    "opus": "bestaudio[ext=webm]/bestaudio/best",
    "wav":  "bestaudio/best",
    "ogg":  "bestaudio/best",
    "best": "bestaudio/best",
}

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
}


def resolve_url(video_id: str, fmt: str) -> dict:
    """Use yt-dlp to extract direct stream URLs without downloading."""
    ydl_opts = {
        "format": fmt,
        "quiet": True,
        "no_warnings": True,
        "noplaylist": True,
        "socket_timeout": 20,
    }

    url = f"https://www.youtube.com/watch?v={video_id}"

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)

    title = info.get("title", f"youtube-{video_id}")
    # Sanitize for filename
    safe_title = re.sub(r'[\\/*?:"<>|]', "", title)[:80]

    # If there's a requested_downloads list, use those URLs
    formats = info.get("requested_downloads") or []
    if not formats:
        # Fall back to direct url field
        formats = [info]

    # Collect all stream URLs
    streams = []
    for f in formats:
        if f.get("url"):
            streams.append({
                "url": f["url"],
                "ext": f.get("ext", "mp4"),
                "resolution": f.get("resolution") or f.get("format_note", ""),
                "filesize": f.get("filesize") or f.get("filesize_approx"),
            })

    return {
        "title": safe_title,
        "streams": streams,
        "thumbnail": info.get("thumbnail", ""),
        "duration": info.get("duration", 0),
        "ext": info.get("ext", "mp4"),
    }


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        for k, v in CORS_HEADERS.items():
            self.send_header(k, v)
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        params = parse_qs(parsed.query)

        def q(key, default=""):
            vals = params.get(key, [default])
            return vals[0] if vals else default

        video_id = q("id")
        mode = q("mode", "video")
        quality = q("quality", "1080")
        aformat = q("aformat", "mp3")
        abitrate = q("abitrate", "320")

        if not video_id:
            self._json(400, {"error": "Missing 'id' parameter"})
            return

        # Validate video_id
        if not re.match(r'^[a-zA-Z0-9_-]{11}$', video_id):
            self._json(400, {"error": "Invalid video ID format"})
            return

        # Build yt-dlp format string
        if mode == "audio":
            fmt = AUDIO_FORMAT_MAP.get(aformat, "bestaudio/best")
        else:
            fmt = QUALITY_MAP.get(quality, "bv[height<=1080]+ba/best")

        try:
            result = resolve_url(video_id, fmt)
            self._json(200, {"ok": True, **result})
        except yt_dlp.utils.DownloadError as e:
            err = str(e)
            if "Sign in" in err or "login" in err.lower():
                self._json(403, {"error": "This video requires a YouTube login to access.", "code": "login_required"})
            elif "not available" in err.lower():
                self._json(404, {"error": "Video is unavailable or private.", "code": "unavailable"})
            else:
                self._json(500, {"error": f"yt-dlp error: {err}", "code": "ytdlp_error"})
        except Exception as e:
            self._json(500, {"error": str(e), "code": "internal_error"})

    def _json(self, status: int, body: dict):
        payload = json.dumps(body).encode()
        self.send_response(status)
        for k, v in CORS_HEADERS.items():
            self.send_header(k, v)
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def log_message(self, format, *args):
        pass  # Suppress default access logs
