import { useState } from "react";
import { Image as ImageIcon, Copy, Check, Download, ExternalLink, Sparkles } from "lucide-react";
import { extractVideoId } from "../services/youtube";

export default function ThumbnailTool() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [error, setError] = useState("");
  const [copiedKey, setCopiedKey] = useState("");

  const handleProcess = () => {
    setError("");
    const parsedId = extractVideoId(url);
    if (!parsedId) { setError("Please paste a valid YouTube video link."); return; }
    setVideoId(parsedId);
  };

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 2000);
  };

  const resolutions = [
    { key: "maxres", label: "Max Resolution", dims: "1280 × 720", url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` },
    { key: "sd", label: "Standard Quality", dims: "640 × 480", url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg` },
    { key: "hq", label: "High Quality", dims: "480 × 360", url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` },
    { key: "mq", label: "Medium Quality", dims: "320 × 180", url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` },
  ];

  return (
    <div className="space-y-5">
      {/* Input Card */}
      <div className="card-dark p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20">
            <ImageIcon className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Thumbnail Hub</h3>
            <p className="text-xs text-[#8b92a9]">Download all thumbnail sizes from any public YouTube video.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="flex-1 rounded-xl border border-[#23283a] bg-[#0d0f14] py-3 px-4 text-sm text-white placeholder-[#4f566b] focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 focus:outline-none transition"
          />
          <button
            onClick={handleProcess}
            className="flex items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 px-6 py-3 text-sm font-bold text-white transition shadow-lg shadow-amber-900/30 active:scale-95"
          >
            <ImageIcon className="h-4 w-4" /> Extract
          </button>
        </div>

        {error && <p className="text-xs font-semibold text-red-400 mt-2">{error}</p>}

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => { setUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ"); setVideoId("dQw4w9WgXcQ"); }}
            className="flex items-center gap-1.5 rounded-lg border border-[#23283a] bg-[#181c25] hover:bg-[#1e2230] px-3 py-1.5 text-xs font-semibold text-[#8b92a9] hover:text-white transition"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Try Rick Astley
          </button>
        </div>
      </div>

      {videoId && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-slideUp">
          {resolutions.map((res) => (
            <div key={res.key} className="card-dark p-5 space-y-4 hover:border-amber-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{res.label}</h4>
                  <span className="text-[10px] text-[#4f566b] font-mono">{res.dims} px</span>
                </div>
                <a href={res.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-[#23283a] bg-[#181c25] hover:bg-[#1e2230] text-[#8b92a9] hover:text-white transition">
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="aspect-video rounded-xl overflow-hidden border border-[#1a1e2a] bg-[#0a0c10]">
                <img src={res.url} alt={res.label} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => copy(res.url, res.key)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-[#23283a] bg-[#181c25] hover:bg-[#1e2230] py-2.5 text-xs font-bold text-[#8b92a9] hover:text-white transition"
                >
                  {copiedKey === res.key ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedKey === res.key ? "Copied!" : "Copy URL"}
                </button>
                <a
                  href={res.url}
                  download={`thumb-${res.key}-${videoId}.jpg`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 py-2.5 text-xs font-bold text-white transition active:scale-95 shadow-sm shadow-amber-900/30"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
