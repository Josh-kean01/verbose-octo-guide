import React, { useState } from "react";
import { Search, Sparkles, Video } from "lucide-react";
import { extractVideoId } from "../services/youtube";

interface VideoInputProps {
  onSearch: (id: string) => void;
  isLoading: boolean;
}

export default function VideoInput({ onSearch, isLoading }: VideoInputProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!url.trim()) { setError("Please paste a valid YouTube URL first."); return; }
    const videoId = extractVideoId(url);
    if (!videoId) { setError("Couldn't parse a Video ID — please double-check the link."); return; }
    onSearch(videoId);
  };

  const handlePreset = (id: string) => {
    setUrl(`https://www.youtube.com/watch?v=${id}`);
    onSearch(id);
  };

  return (
    <div className="card-dark p-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="text-xs font-bold uppercase tracking-widest text-[#4f566b] block">
          Paste YouTube Video Link
        </label>

        <div className="relative flex items-center">
          <div className="absolute left-4">
            <svg className="h-5 w-5 fill-current text-red-500" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => { setUrl(e.target.value); if (error) setError(""); }}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full rounded-xl border border-[#23283a] bg-[#0d0f14] py-3.5 pl-12 pr-36 text-sm font-medium text-white placeholder-[#4f566b] focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 focus:outline-none transition"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-500 active:scale-95 disabled:opacity-50 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-900/30 transition"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {isLoading ? "Fetching…" : "Extract"}
          </button>
        </div>

        {error && (
          <p className="text-xs font-semibold text-red-400">{error}</p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#4f566b] flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-500" /> Try demo:
          </span>
          <button
            type="button"
            onClick={() => handlePreset("dQw4w9WgXcQ")}
            className="flex items-center gap-1.5 rounded-lg border border-[#23283a] bg-[#181c25] hover:bg-[#1e2230] px-3 py-1.5 text-xs font-semibold text-[#8b92a9] hover:text-white transition"
          >
            <Video className="h-3.5 w-3.5 text-indigo-400" /> Rick Astley (Music)
          </button>
          <button
            type="button"
            onClick={() => handlePreset("EngW7tLk6R8")}
            className="flex items-center gap-1.5 rounded-lg border border-[#23283a] bg-[#181c25] hover:bg-[#1e2230] px-3 py-1.5 text-xs font-semibold text-[#8b92a9] hover:text-white transition"
          >
            <Video className="h-3.5 w-3.5 text-amber-400" /> Apple Vision Pro (Tech)
          </button>
        </div>
      </form>
    </div>
  );
}
