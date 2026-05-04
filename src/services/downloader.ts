/**
 * Download service
 *
 * /api/formats  → yt-dlp extracts available formats (no download, fast)
 * /api/stream   → yt-dlp resolves + proxies bytes to the browser
 *
 * Both endpoints only exist when deployed to Vercel with the Python functions.
 * In static preview / local dev, the API is unavailable and we surface that clearly.
 */

export interface VideoFormat {
  format_id:    string;
  height:       number;
  label:        string;
  resolution:   string;
  ext:          string;
  vcodec:       string;
  acodec:       string;
  filesize?:    number;
  fps?:         number;
  ytdlp_format: string;
}

export interface AudioFormat {
  label:        string;
  sub:          string;
  ext:          string;
  ytdlp_format: string;
  mode:         "audio";
}

export interface VideoInfo {
  id:        string;
  title:     string;
  duration:  number;
  thumbnail: string;
  uploader:  string;
  video:     VideoFormat[];
  audio:     AudioFormat[];
}

/**
 * Returns true when the /api/* serverless functions are reachable.
 * They only exist on Vercel — not in static preview or local dev.
 */
export async function isApiAvailable(): Promise<boolean> {
  try {
    // Ping /api/formats with no ID — it returns a 400 JSON error if the
    // function is running, or a non-JSON "Not found" if it isn't deployed.
    const res = await fetch("/api/formats?id=test", {
      signal: AbortSignal.timeout(5000),
    });
    const text = await res.text();
    // If it's JSON (even an error) the function is live
    try { JSON.parse(text); return true; } catch { return false; }
  } catch {
    return false;
  }
}

export async function fetchFormats(videoId: string): Promise<VideoInfo> {
  const res = await fetch(`/api/formats?id=${encodeURIComponent(videoId)}`, {
    signal: AbortSignal.timeout(30000),
  });

  let data: any;
  try {
    data = await res.json();
  } catch {
    const text = await res.text().catch(() => "");
    throw new Error(
      text.toLowerCase().startsWith("not found") || res.status === 404
        ? "API_UNAVAILABLE"
        : `Server returned unexpected response (${res.status})`
    );
  }

  if (!data.ok) {
    throw new Error(data.error || "Failed to fetch formats.");
  }
  return data as VideoInfo;
}

/**
 * Builds the /api/stream URL — the browser navigates here and receives the
 * file via Content-Disposition attachment streaming from yt-dlp on Vercel.
 */
export function getStreamUrl(
  videoId:      string,
  ytdlpFormat:  string,
  ext:          string,
  title:        string
): string {
  const params = new URLSearchParams({ id: videoId, fmt: ytdlpFormat, ext, title });
  return `/api/stream?${params}`;
}

export function formatFileSize(bytes?: number): string {
  if (!bytes) return "";
  if (bytes > 1_000_000_000) return `~${(bytes / 1_000_000_000).toFixed(1)} GB`;
  if (bytes > 1_000_000)     return `~${(bytes / 1_000_000).toFixed(0)} MB`;
  return `~${(bytes / 1_000).toFixed(0)} KB`;
}

export function formatDuration(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}
