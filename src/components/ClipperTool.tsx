import { useState, useEffect, useRef, useCallback } from "react";
import {
  Scissors, Copy, Check, Play, Pause, Sparkles,
  SkipBack, SkipForward, Download, Link,
  Crosshair, Volume2, VolumeX, RotateCcw,
} from "lucide-react";
import { extractVideoId } from "../services/youtube";

/* ─── YouTube IFrame API Types ─────────────────────────── */
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

/* ─── Helpers ───────────────────────────────────────────── */
function toSec(min: number, sec: number) { return min * 60 + sec; }
function toMM(secs: number) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* ─── Component ─────────────────────────────────────────── */
export default function ClipperTool() {
  const [url, setUrl]           = useState("");
  const [videoId, setVideoId]   = useState("");
  const [error, setError]       = useState("");

  // Clip bounds (seconds)
  const [startSec, setStartSec] = useState(0);
  const [endSec, setEndSec]     = useState(0);

  // Start / End input fields (MM:SS string or number fields)
  const [startMin, setStartMin] = useState(0);
  const [startSecField, setStartSecField] = useState(0);
  const [endMin, setEndMin]     = useState(0);
  const [endSecField, setEndSecField]   = useState(0);

  // Player state
  const [playerReady, setPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [isMuted, setIsMuted]         = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration]       = useState(0);
  const [volume, setVolume]           = useState(80);

  // Copy states
  const [copiedKey, setCopiedKey] = useState("");

  const playerRef    = useRef<any>(null);
  const intervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /* ── Load YouTube IFrame API once ── */
  useEffect(() => {
    if (window.YT && window.YT.Player) return;
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  }, []);

  /* ── Destroy player on unmount ── */
  useEffect(() => {
    return () => {
      stopTracking();
      if (playerRef.current) { try { playerRef.current.destroy(); } catch {} }
    };
  }, []);

  /* ── Sync fields → seconds ── */
  useEffect(() => { setStartSec(toSec(startMin, startSecField)); }, [startMin, startSecField]);
  useEffect(() => { setEndSec(toSec(endMin, endSecField)); }, [endMin, endSecField]);

  /* ── Build player when videoId changes ── */
  useEffect(() => {
    if (!videoId) return;

    // Destroy old player
    stopTracking();
    if (playerRef.current) { try { playerRef.current.destroy(); } catch {} playerRef.current = null; }
    setPlayerReady(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    const init = () => {
      playerRef.current = new window.YT.Player("yt-player", {
        videoId,
        playerVars: { controls: 0, modestbranding: 1, rel: 0, disablekb: 1 },
        events: {
          onReady: (e: any) => {
            setDuration(e.target.getDuration());
            e.target.setVolume(volume);
            setPlayerReady(true);
          },
          onStateChange: (e: any) => {
            // YT.PlayerState.PLAYING = 1
            const playing = e.data === 1;
            setIsPlaying(playing);
            if (playing) startTracking();
            else stopTracking();
          },
        },
      });
    };

    if (window.YT && window.YT.Player) { init(); }
    else { window.onYouTubeIframeAPIReady = init; }
  }, [videoId]);

  const startTracking = useCallback(() => {
    stopTracking();
    intervalRef.current = setInterval(() => {
      if (playerRef.current?.getCurrentTime) {
        const t = playerRef.current.getCurrentTime();
        setCurrentTime(t);
        // Auto-pause at end clip boundary
        if (endSec > startSec && t >= endSec) {
          playerRef.current.pauseVideo();
        }
      }
    }, 250);
  }, [endSec, startSec]);

  const stopTracking = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  };

  /* Restart tracking when boundaries change */
  useEffect(() => {
    if (isPlaying) startTracking();
  }, [startSec, endSec, isPlaying, startTracking]);

  /* ── Controls ── */
  const togglePlay = () => {
    if (!playerRef.current) return;
    isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) { playerRef.current.unMute(); setIsMuted(false); }
    else         { playerRef.current.mute();   setIsMuted(true);  }
  };

  const seekTo = (secs: number) => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(Math.max(0, Math.min(duration, secs)), true);
    setCurrentTime(secs);
  };

  const changeVolume = (v: number) => {
    setVolume(v);
    if (playerRef.current) playerRef.current.setVolume(v);
  };

  const jumpToStart = () => seekTo(startSec);
  const jumpToEnd   = () => seekTo(Math.max(0, endSec - 3));

  const setStartHere = () => {
    const t = Math.floor(currentTime);
    setStartMin(Math.floor(t / 60));
    setStartSecField(t % 60);
  };

  const setEndHere = () => {
    const t = Math.ceil(currentTime);
    setEndMin(Math.floor(t / 60));
    setEndSecField(t % 60);
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    seekTo(parseFloat(e.target.value));
  };

  /* ── Clip duration ── */
  const clipDuration = endSec > startSec ? endSec - startSec : 0;

  /* ── Share / Embed ── */
  const shareUrl  = `https://youtu.be/${videoId}?t=${startSec}${endSec > startSec ? `&end=${endSec}` : ""}`;
  const embedCode = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}?start=${startSec}${endSec > startSec ? `&end=${endSec}` : ""}&autoplay=1" frameborder="0" allowfullscreen></iframe>`;
  const dlCmd     = `yt-dlp -f "bv+ba" --download-sections "*${toMM(startSec)}-${endSec > startSec ? toMM(endSec) : "end"}" "https://www.youtube.com/watch?v=${videoId}"`;

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 2000);
  };

  /* ── URL input ── */
  const handleLoad = () => {
    setError("");
    const id = extractVideoId(url);
    if (!id) { setError("Please paste a valid YouTube video link."); return; }
    setVideoId(id);
    setStartMin(0); setStartSecField(0);
    setEndMin(0);   setEndSecField(0);
  };

  const inputNumClass = "w-full mt-1 px-3 py-2.5 rounded-lg border border-[#23283a] bg-[#0d0f14] text-sm text-white text-center focus:border-emerald-500/50 focus:outline-none transition";

  /* ── Progress bar widths ── */
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const clipStartPct = duration > 0 ? (startSec / duration) * 100 : 0;
  const clipEndPct   = duration > 0 && endSec > startSec ? (endSec / duration) * 100 : clipStartPct;

  return (
    <div className="space-y-5">

      {/* ── URL Input ── */}
      <div className="card-dark p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <Scissors className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Video Clipper & Snippet Generator</h3>
            <p className="text-xs text-[#8b92a9]">Seek, clip, preview, share, and download any YouTube segment.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLoad()}
            placeholder="https://www.youtube.com/watch?v=..."
            className="flex-1 rounded-xl border border-[#23283a] bg-[#0d0f14] py-3 px-4 text-sm text-white placeholder-[#4f566b] focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none transition"
          />
          <button
            onClick={handleLoad}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition shadow-lg shadow-emerald-900/30 active:scale-95"
          >
            <Play className="h-4 w-4" /> Load Video
          </button>
        </div>

        {error && <p className="text-xs font-semibold text-red-400 mt-2">{error}</p>}

        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { id: "dQw4w9WgXcQ", label: "Rick Astley" },
            { id: "9bZkp7q19f0", label: "Gangnam Style" },
            { id: "jNQXAC9IVRw", label: "Me at the Zoo" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => { setUrl(`https://www.youtube.com/watch?v=${id}`); setVideoId(id); }}
              className="flex items-center gap-1.5 rounded-lg border border-[#23283a] bg-[#181c25] hover:bg-[#1e2230] px-3 py-1.5 text-xs font-semibold text-[#8b92a9] hover:text-white transition"
            >
              <Sparkles className="h-3 w-3 text-emerald-400" /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Player + Controls ── */}
      {videoId && (
        <div className="space-y-5 animate-slideUp">

          {/* Video Player */}
          <div className="card-dark overflow-hidden">
            {/* Hidden YT div */}
            <div ref={containerRef} className="aspect-video w-full bg-black relative">
              <div id="yt-player" className="w-full h-full" />

              {/* Overlay when not ready */}
              {!playerReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#23283a] border-t-emerald-500" />
                </div>
              )}
            </div>

            {/* ── Custom Control Bar ── */}
            <div className="bg-[#0d0f14] border-t border-[#1a1e2a] px-5 pt-4 pb-5 space-y-3">

              {/* Progress / Scrub */}
              <div className="space-y-1.5">
                <div className="relative h-2 rounded-full bg-[#1a1e2a] overflow-hidden cursor-pointer group">
                  {/* Clip range highlight */}
                  {endSec > startSec && duration > 0 && (
                    <div
                      className="absolute top-0 h-full bg-emerald-500/20 border-x border-emerald-500/40 transition-all"
                      style={{ left: `${clipStartPct}%`, width: `${clipEndPct - clipStartPct}%` }}
                    />
                  )}
                  {/* Clip start marker */}
                  {duration > 0 && (
                    <div
                      className="absolute top-0 h-full w-0.5 bg-emerald-400"
                      style={{ left: `${clipStartPct}%` }}
                    />
                  )}
                  {/* Clip end marker */}
                  {endSec > startSec && duration > 0 && (
                    <div
                      className="absolute top-0 h-full w-0.5 bg-rose-400"
                      style={{ left: `${clipEndPct}%` }}
                    />
                  )}
                  {/* Playhead */}
                  <div
                    className="absolute top-0 h-full bg-white/80 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    step={0.5}
                    value={currentTime}
                    onChange={handleScrub}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#4f566b] font-mono">
                  <span>{toMM(currentTime)}</span>
                  {clipDuration > 0 && (
                    <span className="text-emerald-400 font-bold">
                      clip: {toMM(startSec)} → {toMM(endSec)} ({clipDuration}s)
                    </span>
                  )}
                  <span>{toMM(duration)}</span>
                </div>
              </div>

              {/* Playback Buttons */}
              <div className="flex items-center justify-between gap-3">
                {/* Left: transport */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => seekTo(currentTime - 10)}
                    disabled={!playerReady}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#23283a] bg-[#181c25] hover:bg-[#1e2230] text-[#8b92a9] hover:text-white disabled:opacity-40 transition"
                    title="Rewind 10s"
                  >
                    <SkipBack className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={togglePlay}
                    disabled={!playerReady}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white shadow-lg shadow-emerald-900/30 transition active:scale-95"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>

                  <button
                    onClick={() => seekTo(currentTime + 10)}
                    disabled={!playerReady}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#23283a] bg-[#181c25] hover:bg-[#1e2230] text-[#8b92a9] hover:text-white disabled:opacity-40 transition"
                    title="Forward 10s"
                  >
                    <SkipForward className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => seekTo(0)}
                    disabled={!playerReady}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#23283a] bg-[#181c25] hover:bg-[#1e2230] text-[#8b92a9] hover:text-white disabled:opacity-40 transition"
                    title="Restart"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Centre: clip point setters */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={jumpToStart}
                    disabled={!playerReady || !duration}
                    title="Jump to clip start"
                    className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1.5 text-[10px] font-bold text-emerald-400 disabled:opacity-40 transition"
                  >
                    ↗ Start
                  </button>
                  <button
                    onClick={jumpToEnd}
                    disabled={!playerReady || !duration || endSec <= startSec}
                    title="Jump to clip end"
                    className="flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 px-2.5 py-1.5 text-[10px] font-bold text-rose-400 disabled:opacity-40 transition"
                  >
                    ↗ End
                  </button>
                </div>

                {/* Right: volume */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    disabled={!playerReady}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#23283a] bg-[#181c25] hover:bg-[#1e2230] text-[#8b92a9] hover:text-white disabled:opacity-40 transition"
                  >
                    {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={isMuted ? 0 : volume}
                    onChange={(e) => changeVolume(Number(e.target.value))}
                    className="w-20 accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Clip Settings + Outputs ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Left: clip point inputs */}
            <div className="card-dark p-6 space-y-5">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#4f566b]">
                Clip Range
              </h4>

              {/* Start */}
              <div className="rounded-xl bg-[#0d0f14] border border-emerald-500/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">▶ Start Point</span>
                  <button
                    onClick={setStartHere}
                    disabled={!playerReady}
                    className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 text-[10px] font-bold text-emerald-400 disabled:opacity-40 transition active:scale-95"
                    title="Set start to current playhead position"
                  >
                    <Crosshair className="h-3 w-3" /> Set Here ({toMM(currentTime)})
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-[#4f566b] uppercase tracking-wide">Minutes</label>
                    <input type="number" min="0" value={startMin}
                      onChange={(e) => setStartMin(Math.max(0, parseInt(e.target.value) || 0))}
                      className={inputNumClass} />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#4f566b] uppercase tracking-wide">Seconds</label>
                    <input type="number" min="0" max="59" value={startSecField}
                      onChange={(e) => setStartSecField(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                      className={inputNumClass} />
                  </div>
                </div>
              </div>

              {/* End */}
              <div className="rounded-xl bg-[#0d0f14] border border-rose-500/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400">■ End Point</span>
                  <button
                    onClick={setEndHere}
                    disabled={!playerReady}
                    className="flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 text-[10px] font-bold text-rose-400 disabled:opacity-40 transition active:scale-95"
                    title="Set end to current playhead position"
                  >
                    <Crosshair className="h-3 w-3" /> Set Here ({toMM(currentTime)})
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-[#4f566b] uppercase tracking-wide">Minutes</label>
                    <input type="number" min="0" value={endMin}
                      onChange={(e) => setEndMin(Math.max(0, parseInt(e.target.value) || 0))}
                      className={inputNumClass} />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#4f566b] uppercase tracking-wide">Seconds</label>
                    <input type="number" min="0" max="59" value={endSecField}
                      onChange={(e) => setEndSecField(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                      className={inputNumClass} />
                  </div>
                </div>
              </div>

              {/* Clip summary */}
              {clipDuration > 0 && (
                <div className="rounded-xl border border-[#1a1e2a] bg-[#0d0f14] px-4 py-3 flex items-center justify-between text-xs">
                  <span className="text-[#4f566b]">Clip duration</span>
                  <span className="font-bold text-white">
                    {toMM(startSec)} → {toMM(endSec)} &nbsp;·&nbsp; {clipDuration}s
                  </span>
                </div>
              )}
            </div>

            {/* Right: outputs */}
            <div className="card-dark p-6 space-y-5">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#4f566b]">
                Export & Share
              </h4>

              {/* Share Link */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Link className="h-3.5 w-3.5 text-emerald-400" /> Share Link
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-[#1a1e2a] bg-[#0d0f14] p-3">
                  <span className="flex-1 text-[11px] text-[#8b92a9] font-mono break-all leading-relaxed">{shareUrl}</span>
                  <button
                    onClick={() => copy(shareUrl, "link")}
                    className="flex-shrink-0 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-2 text-[10px] font-bold text-white flex items-center gap-1 transition active:scale-95"
                  >
                    {copiedKey === "link" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copiedKey === "link" ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Embed Code */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Scissors className="h-3.5 w-3.5 text-indigo-400" /> Embed Code
                </label>
                <div className="relative">
                  <textarea
                    readOnly
                    value={embedCode}
                    rows={3}
                    className="w-full rounded-xl border border-[#1a1e2a] bg-[#0d0f14] p-3 text-[11px] font-mono text-[#8b92a9] resize-none focus:outline-none leading-relaxed"
                  />
                  <button
                    onClick={() => copy(embedCode, "embed")}
                    className="absolute top-2 right-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-2.5 py-1.5 text-[10px] font-bold text-white flex items-center gap-1 transition active:scale-95"
                  >
                    {copiedKey === "embed" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copiedKey === "embed" ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Download Command */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Download className="h-3.5 w-3.5 text-rose-400" /> Download Clip (yt-dlp)
                </label>
                <div className="rounded-xl border border-[#1a1e2a] bg-[#0d0f14] p-3">
                  <p className="text-[11px] font-mono text-[#8b92a9] break-all leading-relaxed">{dlCmd}</p>
                </div>
                <button
                  onClick={() => copy(dlCmd, "dl")}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 py-2.5 text-xs font-bold text-white transition active:scale-95 shadow-sm shadow-rose-900/30"
                >
                  {copiedKey === "dl" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedKey === "dl" ? "Command Copied!" : "Copy yt-dlp Download Command"}
                </button>
                <p className="text-[10px] text-[#4f566b] leading-relaxed">
                  Run this in your terminal after installing <code className="text-[#8b92a9]">yt-dlp</code> to download exactly the clipped segment as a video file.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
