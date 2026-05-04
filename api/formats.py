"""
GET /api/formats?id=VIDEO_ID
Returns the list of available formats for a YouTube video using yt-dlp.
No file is downloaded — only metadata is extracted.
"""

import json
import re
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

import yt_dlp

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
}

VIDEO_QUALITY_LABELS = {
    "4320": "8K Ultra HD",
    "2160": "4K Ultra HD",
    "1440": "2K QHD",
    "1080": "Full HD",
    "720":  "HD",
    "480":  "Standard",
    "360":  "Low",
    "240":  "Very Low",
    "144":  "Minimum",
}


def get_formats(video_id: str) -> dict:
    url = f"https://www.youtube.com/watch?v={video_id}"

    ydl_opts = {
        "quiet": True,
        "no_warnings": True,
        "noplaylist": True,
        "socket_timeout": 20,
        "extractor_args": {"youtube": {"skip": ["dash", "hls"]}},
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)

    title     = info.get("title", f"video-{video_id}")
    duration  = info.get("duration", 0)
    thumbnail = info.get("thumbnail", "")
    uploader  = info.get("uploader", "")

    raw_formats = info.get("formats", [])

    # ── Build video formats ────────────────────────────────
    seen_heights = set()
    video_formats = []

    for f in sorted(raw_formats, key=lambda x: (x.get("height") or 0), reverse=True):
        height = f.get("height")
        vcodec = f.get("vcodec", "none")
        acodec = f.get("acodec", "none")

        if not height or vcodec == "none":
            continue
        if height in seen_heights:
            continue

        seen_heights.add(height)
        h = str(height)

        video_formats.append({
            "format_id": f["format_id"],
            "height":    height,
            "label":     VIDEO_QUALITY_LABELS.get(h, f"{h}p"),
            "resolution": f"{height}p",
            "ext":       f.get("ext", "mp4"),
            "vcodec":    vcodec,
            "acodec":    acodec,
            "filesize":  f.get("filesize") or f.get("filesize_approx"),
            "fps":       f.get("fps"),
            # We pass the format_id to /api/stream so it picks the right format
            "ytdlp_format": f"bv[height={height}]+ba/bv[height<={height}]+ba/best",
        })

    # ── Build audio-only formats ───────────────────────────
    audio_formats = []
    audio_exts_seen = set()

    for ext, label, sub, format_str in [
        ("mp3",  "MP3",  "320 kbps · Best quality", "bestaudio/best"),
        ("opus", "Opus", "Hi-Fi · smaller file",     "bestaudio[ext=webm]/bestaudio/best"),
        ("wav",  "WAV",  "Lossless",                  "bestaudio/best"),
        ("m4a",  "M4A",  "AAC audio",                 "bestaudio[ext=m4a]/bestaudio/best"),
    ]:
        if ext in audio_exts_seen:
            continue
        audio_exts_seen.add(ext)
        audio_formats.append({
            "label":        label,
            "sub":          sub,
            "ext":          ext,
            "ytdlp_format": format_str,
            "mode":         "audio",
        })

    return {
        "id":       video_id,
        "title":    title,
        "duration": duration,
        "thumbnail": thumbnail,
        "uploader": uploader,
        "video":    video_formats[:8],   # cap at 8 video formats
        "audio":    audio_formats,
    }


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        for k, v in CORS.items():
            self.send_header(k, v)
        self.end_headers()

    def do_GET(self):
        params = parse_qs(urlparse(self.path).query)
        video_id = (params.get("id") or [""])[0].strip()

        if not video_id or not re.match(r'^[a-zA-Z0-9_-]{11}$', video_id):
            self._json(400, {"error": "Invalid or missing video ID."})
            return

        try:
            data = get_formats(video_id)
            self._json(200, {"ok": True, **data})
        except yt_dlp.utils.DownloadError as e:
            err = str(e)
            if "sign in" in err.lower() or "login" in err.lower():
                self._json(403, {"error": "This video requires a YouTube login.", "code": "login_required"})
            elif "not available" in err.lower() or "private" in err.lower():
                self._json(404, {"error": "Video is unavailable or private.", "code": "unavailable"})
            else:
                self._json(500, {"error": err, "code": "ytdlp_error"})
        except Exception as e:
            self._json(500, {"error": str(e), "code": "internal_error"})

    def _json(self, status, body):
        payload = json.dumps(body, ensure_ascii=False).encode()
        self.send_response(status)
        for k, v in CORS.items():
            self.send_header(k, v)
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def log_message(self, *a):
        pass
