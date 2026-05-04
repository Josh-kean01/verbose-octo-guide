import { useState } from "react";
import { VideoMetadata } from "../services/youtube";
import {
  Info, Tag, BarChart2, Image as ImageIcon, Code,
  Copy, Check, Calendar, ThumbsUp, MessageCircle, Eye,
  AlertTriangle, Award, Sparkles, ExternalLink,
} from "lucide-react";

interface MetadataViewerProps {
  data: VideoMetadata;
}

const TABS = [
  { id: "overview", label: "Overview", icon: <Info className="h-3.5 w-3.5" /> },
  { id: "tags", label: "Tags", icon: <Tag className="h-3.5 w-3.5" /> },
  { id: "seo", label: "SEO Score", icon: <BarChart2 className="h-3.5 w-3.5" /> },
  { id: "thumbnails", label: "Thumbnails", icon: <ImageIcon className="h-3.5 w-3.5" /> },
  { id: "embed", label: "Embed", icon: <Code className="h-3.5 w-3.5" /> },
];

export default function MetadataViewer({ data }: MetadataViewerProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedKey, setCopiedKey] = useState("");
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [embedWidth, setEmbedWidth] = useState(560);
  const [embedHeight, setEmbedHeight] = useState(315);
  const [embedControls, setEmbedControls] = useState(true);
  const [embedAutoplay, setEmbedAutoplay] = useState(false);
  const [embedStartTime, setEmbedStartTime] = useState(0);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 2000);
  };

  const totalTagsLength = data.tags.join(", ").length;

  const getSeoScore = () => {
    let score = 0;
    const tips: { text: string; positive: boolean }[] = [];

    if (data.title.length >= 20 && data.title.length <= 70) {
      score += 20; tips.push({ text: "Great title length (20–70 chars).", positive: true });
    } else {
      tips.push({ text: `Title is ${data.title.length} chars — ideal is 20–70.`, positive: false });
    }
    if (data.description.length > 200) {
      score += 20; tips.push({ text: "Healthy description length (>200 chars).", positive: true });
    } else {
      tips.push({ text: "Add a longer description for better search visibility.", positive: false });
    }
    if (data.tags.length > 0) {
      score += totalTagsLength >= 300 ? 20 : 10;
      tips.push({ text: `${data.tags.length} tags — ${totalTagsLength}/500 chars used.`, positive: data.tags.length > 0 });
    } else {
      tips.push({ text: "No tags found. Tags help the algorithm place your video.", positive: false });
    }
    if (data.description.includes("#")) {
      score += 10; tips.push({ text: "Has hashtags in description.", positive: true });
    } else {
      tips.push({ text: "Add hashtags (#Topic) to appear in category pages.", positive: false });
    }
    if (/\d+:\d+/.test(data.description)) {
      score += 20; tips.push({ text: "Has timestamped chapters — great for engagement!", positive: true });
    } else {
      tips.push({ text: "Add chapters (e.g. 1:15 Introduction) for better UX.", positive: false });
    }
    if (data.category && data.category !== "Unknown") {
      score += 10; tips.push({ text: `Category set: ${data.category}.`, positive: true });
    }
    return { score, tips };
  };

  const seo = getSeoScore();

  const getEmbedCode = () => {
    let src = `${data.embedUrl}?controls=${embedControls ? 1 : 0}`;
    if (embedAutoplay) src += "&autoplay=1&mute=1";
    if (embedStartTime > 0) src += `&start=${embedStartTime}`;
    return `<iframe width="${embedWidth}" height="${embedHeight}" src="${src}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
  };

  const fmt = (v: string) => (!isNaN(Number(v)) ? Number(v).toLocaleString() : v);

  return (
    <div className="card-dark overflow-hidden animate-slideUp">
      {/* ── Video Banner ── */}
      <div className="flex flex-col md:flex-row gap-6 p-6 border-b border-[#1a1e2a]">
        <div className="relative md:w-80 aspect-video rounded-xl overflow-hidden bg-[#0d0f14] flex-shrink-0 border border-[#23283a]">
          <img src={data.thumbnails.high} alt={data.title} className="w-full h-full object-cover" />
          {data.isMockData && (
            <span className="absolute top-2 right-2 flex items-center gap-1 rounded-lg bg-amber-500/90 text-white px-2 py-0.5 text-[10px] font-bold shadow">
              <Sparkles className="h-3 w-3" /> Demo
            </span>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <h2 className="text-lg font-bold text-white leading-snug">{data.title}</h2>
            <p className="mt-1 text-sm text-[#8b92a9]">by <span className="font-semibold text-white">{data.channelTitle}</span></p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
            {[
              { icon: <Eye className="h-3.5 w-3.5" />, label: "Views", value: fmt(data.viewCount) },
              { icon: <ThumbsUp className="h-3.5 w-3.5" />, label: "Likes", value: fmt(data.likeCount) },
              { icon: <MessageCircle className="h-3.5 w-3.5" />, label: "Comments", value: fmt(data.commentCount) },
              { icon: <Calendar className="h-3.5 w-3.5" />, label: "Published", value: data.publishedAt ? new Date(data.publishedAt).toLocaleDateString() : "N/A" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-[#0d0f14] border border-[#1a1e2a] p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-[#4f566b] text-[10px] mb-1">
                  {stat.icon} {stat.label}
                </div>
                <span className="text-sm font-bold text-white">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex overflow-x-auto border-b border-[#1a1e2a] px-4 gap-1 scrollbar-dark">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-3.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === tab.id
                ? "border-red-500 text-white"
                : "border-transparent text-[#4f566b] hover:text-[#8b92a9]"
            }`}
          >
            {tab.icon} {tab.label}
            {tab.id === "tags" && data.tags.length > 0 && (
              <span className="ml-1 rounded-full bg-[#1a1e2a] px-1.5 py-0.5 text-[10px] text-[#8b92a9]">
                {data.tags.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div className="p-6">

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#4f566b] mb-2">Description</h4>
              <div className="rounded-xl border border-[#1a1e2a] bg-[#0d0f14] p-4 text-sm font-mono text-[#8b92a9] whitespace-pre-line max-h-72 overflow-y-auto leading-relaxed scrollbar-dark">
                {data.description || "No description available."}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-[#0d0f14] border border-[#1a1e2a] p-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#4f566b] mb-1">Category</h4>
                <p className="text-sm font-bold text-white">{data.category || "N/A"}</p>
              </div>
              <div className="rounded-xl bg-[#0d0f14] border border-[#1a1e2a] p-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#4f566b] mb-1">Embed URL</h4>
                <p className="text-xs text-[#8b92a9] font-mono break-all">{data.embedUrl}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAGS */}
        {activeTab === "tags" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#4f566b]">Video Tags</h4>
                <span className="text-xs text-[#4f566b]">{totalTagsLength} / 500 characters</span>
              </div>
              {data.tags.length > 0 && (
                <button
                  onClick={() => copy(data.tags.join(", "), "all-tags")}
                  className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-500 px-3 py-1.5 text-xs font-bold text-white transition active:scale-95"
                >
                  {copiedKey === "all-tags" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedKey === "all-tags" ? "Copied!" : "Copy All"}
                </button>
              )}
            </div>

            {data.tags.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#23283a] p-10 text-center">
                <AlertTriangle className="mx-auto h-8 w-8 text-amber-500/60 mb-2" />
                <p className="text-sm font-semibold text-white">No tags detected</p>
                <p className="text-xs text-[#4f566b] mt-1">Tags may require API access or aren't set by the creator.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {data.tags.map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => copy(tag, `tag-${i}`)}
                    className="group flex items-center gap-1.5 rounded-lg border border-[#23283a] bg-[#0d0f14] hover:border-[#2e3450] px-3 py-1.5 text-xs font-medium text-[#8b92a9] hover:text-white transition"
                  >
                    {tag}
                    {copiedKey === `tag-${i}` ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SEO */}
        {activeTab === "seo" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center gap-5">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 flex-shrink-0">
                <Award className="h-10 w-10 text-red-500" />
                <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-[11px] font-extrabold text-white ring-2 ring-[#181c25] shadow">
                  {seo.score}
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">SEO Score</h3>
                <p className="text-xs text-[#8b92a9] mt-0.5">Based on title, description, tags, chapters, and category usage.</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {seo.tips.map((tip, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 rounded-xl px-4 py-3 text-xs font-medium ${
                    tip.positive
                      ? "bg-emerald-500/5 border border-emerald-500/20 text-emerald-400"
                      : "bg-amber-500/5 border border-amber-500/20 text-amber-400"
                  }`}
                >
                  <span className={`flex-shrink-0 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold mt-0.5 ${tip.positive ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"}`}>
                    {tip.positive ? "✓" : "!"}
                  </span>
                  {tip.text}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* THUMBNAILS */}
        {activeTab === "thumbnails" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
            {Object.entries(data.thumbnails).map(([key, url]) => {
              if (!url) return null;
              return (
                <div key={key} className="rounded-xl border border-[#1a1e2a] bg-[#0d0f14] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#4f566b]">{key}</span>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#4f566b] hover:text-white transition">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                  <div className="aspect-video rounded-lg overflow-hidden border border-[#23283a]">
                    <img src={url} alt={key} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                  </div>
                  <button
                    onClick={() => copy(url, `url-${key}`)}
                    className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-[#23283a] bg-[#181c25] hover:bg-[#1e2230] py-2 text-xs font-semibold text-[#8b92a9] hover:text-white transition"
                  >
                    {copiedKey === `url-${key}` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedKey === `url-${key}` ? "Copied!" : "Copy URL"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* EMBED */}
        {activeTab === "embed" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#4f566b]">Embed Settings</h4>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Width (px)", value: embedWidth, set: setEmbedWidth },
                  { label: "Height (px)", value: embedHeight, set: setEmbedHeight },
                ].map(({ label, value, set }) => (
                  <div key={label}>
                    <label className="text-xs text-[#8b92a9] font-semibold block mb-1">{label}</label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => set(Number(e.target.value))}
                      className="w-full rounded-lg border border-[#23283a] bg-[#0d0f14] px-3 py-2 text-sm text-white focus:border-red-500/50 focus:outline-none transition"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                {[
                  { label: "Show player controls", value: embedControls, set: setEmbedControls },
                  { label: "Autoplay (muted)", value: embedAutoplay, set: setEmbedAutoplay },
                ].map(({ label, value, set }) => (
                  <label key={label} className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => set(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500 h-4 w-4 accent-red-600"
                    />
                    <span className="text-sm text-[#8b92a9]">{label}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="text-xs text-[#8b92a9] font-semibold block mb-1">Start Time (seconds)</label>
                <input
                  type="number"
                  value={embedStartTime}
                  onChange={(e) => setEmbedStartTime(Number(e.target.value))}
                  placeholder="e.g. 30"
                  className="w-full rounded-lg border border-[#23283a] bg-[#0d0f14] px-3 py-2 text-sm text-white focus:border-red-500/50 focus:outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#4f566b]">HTML Code</h4>
                <button
                  onClick={() => { copy(getEmbedCode(), "embed"); setCopiedEmbed(true); setTimeout(() => setCopiedEmbed(false), 2000); }}
                  className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-500 px-3 py-1.5 text-xs font-bold text-white transition active:scale-95"
                >
                  {copiedEmbed ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedEmbed ? "Copied!" : "Copy Code"}
                </button>
              </div>

              <textarea
                readOnly
                value={getEmbedCode()}
                className="w-full h-28 rounded-xl border border-[#1a1e2a] bg-[#0d0f14] p-3 text-[11px] font-mono text-[#8b92a9] focus:outline-none resize-none scrollbar-dark"
              />

              <div className="rounded-xl border border-[#1a1e2a] overflow-hidden bg-[#0d0f14]">
                <iframe
                  width="100%"
                  height="160"
                  src={`${data.embedUrl}?controls=${embedControls ? 1 : 0}&mute=1&start=${embedStartTime}`}
                  title="Embed Preview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
