import { useState } from "react";
import { Key, Eye, EyeOff, Check, Info } from "lucide-react";

interface KeyInputProps {
  apiKey: string;
  onSaveKey: (key: string) => void;
}

export default function KeyInput({ apiKey, onSaveKey }: KeyInputProps) {
  const [inputKey, setInputKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSave = () => {
    onSaveKey(inputKey.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleClear = () => {
    setInputKey("");
    onSaveKey("");
  };

  return (
    <div className="card-dark p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <Key className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              YouTube Data API Key
            </h3>
            <p className="text-xs text-[#8b92a9]">
              {apiKey
                ? "✓ API Key connected — full stats enabled"
                : "Optional. Works without one via smart scraping"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-[#8b92a9] hover:text-white border border-[#23283a] rounded-lg px-3 py-1.5 bg-[#181c25] hover:bg-[#1e2230] transition"
        >
          {isExpanded ? "Hide" : "Configure"}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-5 space-y-4 border-t border-[#1a1e2a] pt-5">
          <p className="text-xs text-[#8b92a9] leading-relaxed">
            Without a key the app scrapes YouTube directly (title, description, tags, category). Add a key for guaranteed full statistics including view/like counts.
          </p>

          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Paste your AIzaSy… API key here"
              className="w-full rounded-xl border border-[#23283a] bg-[#0d0f14] py-3 pl-4 pr-24 text-sm font-mono text-white placeholder-[#4f566b] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 focus:outline-none transition"
            />
            <div className="absolute right-2 top-2 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="rounded-lg p-1.5 text-[#8b92a9] hover:text-white hover:bg-[#23283a] transition"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1 rounded-lg bg-violet-600 hover:bg-violet-500 px-3 py-1.5 text-xs font-bold text-white transition active:scale-95"
              >
                {isSaved ? <Check className="h-3.5 w-3.5" /> : "Save"}
              </button>
            </div>
          </div>

          {apiKey && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <Check className="h-3.5 w-3.5" /> Connected
              </span>
              <button onClick={handleClear} className="text-xs text-red-500 hover:text-red-400 transition">
                Disconnect
              </button>
            </div>
          )}

          <div className="rounded-xl bg-[#0d0f14] border border-[#1a1e2a] p-4 text-xs text-[#8b92a9]">
            <span className="flex items-center gap-1.5 font-bold text-white mb-2">
              <Info className="h-3.5 w-3.5 text-indigo-400" /> How to get a free API Key
            </span>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Google Cloud Console</a></li>
              <li>Create a project → Enable <strong className="text-white">YouTube Data API v3</strong></li>
              <li>Credentials → <strong className="text-white">API Key</strong> → paste above</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
