import {
  Code2, Zap, Globe, Users, ExternalLink,
  Layers, Cpu, Database, Wind, Star, ArrowRight,
} from "lucide-react";

interface AboutPageProps {
  onSelectTool: (id: string) => void;
}

const skills = [
  { label: "React & TypeScript", icon: <Layers className="h-4 w-4" />, color: "text-blue-400" },
  { label: "Vite & Tailwind CSS", icon: <Wind className="h-4 w-4" />, color: "text-cyan-400" },
  { label: "Node.js & APIs", icon: <Cpu className="h-4 w-4" />, color: "text-emerald-400" },
  { label: "Databases & Backend", icon: <Database className="h-4 w-4" />, color: "text-violet-400" },
  { label: "UI / UX Design", icon: <Star className="h-4 w-4" />, color: "text-amber-400" },
  { label: "Web Scraping & Automation", icon: <Globe className="h-4 w-4" />, color: "text-rose-400" },
];

const stats = [
  { value: "5+", label: "Tools Built" },
  { value: "0", label: "API Keys Required" },
  { value: "100%", label: "Open & Free" },
  { value: "10k+", label: "Creators Served" },
];

const tools = [
  { id: "metadata", label: "Metadata & SEO Extractor" },
  { id: "clipper", label: "Video Clipper & Share" },
  { id: "thumbnails", label: "Thumbnail Hub" },
  { id: "downloader", label: "Downloader Assistant" },
  { id: "transcript", label: "Transcript & Summary" },
];

export default function AboutPage({ onSelectTool }: AboutPageProps) {
  return (
    <div className="space-y-8 animate-slideUp">
      {/* ── About the Project ── */}
      <div className="card-dark p-7 space-y-4">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Zap className="h-7 w-7 text-amber-400" /> About TubeInspect Suite
        </h1>
        <div className="space-y-3 text-sm text-[#8b92a9] leading-relaxed">
          <p>
            <strong className="text-white">TubeInspect Suite</strong> is a free, browser-based collection of 
            YouTube utility tools designed for content creators, marketers, SEO specialists, and researchers. 
            Every tool in the suite works directly in your browser — no server-side processing, no accounts, 
            no API keys needed for core features.
          </p>
          <p>
            The suite leverages YouTube's public page structure and smart HTML parsing via CORS-free proxies 
            to retrieve metadata, captions, thumbnails, and more — all without requiring you to set up a 
            Google Cloud project or pay for quota.
          </p>
          <p>
            Whether you're analyzing competitor videos for SEO insights, grabbing thumbnails in every 
            resolution, clipping specific moments to share, extracting MP3-ready terminal scripts, or reading 
            through full timestamped transcripts — TubeInspect has you covered.
          </p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card-dark p-5 text-center">
            <p className="text-2xl font-extrabold text-white">{s.value}</p>
            <p className="text-xs text-[#4f566b] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Tools List ── */}
      <div className="card-dark p-7 space-y-5">
        <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
          <Users className="h-5 w-5 text-emerald-400" /> Tools in the Suite
        </h2>
        <div className="space-y-2">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className="w-full flex items-center justify-between rounded-xl bg-[#0d0f14] border border-[#1a1e2a] hover:border-[#2e3450] hover:bg-[#13161d] px-4 py-3 group transition"
            >
              <span className="text-sm font-semibold text-[#8b92a9] group-hover:text-white transition">
                {tool.label}
              </span>
              <ArrowRight className="h-4 w-4 text-[#4f566b] group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>

      {/* ── Mission ── */}
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-7 space-y-3">
        <h2 className="text-lg font-extrabold text-white">Our Mission</h2>
        <p className="text-sm text-[#8b92a9] leading-relaxed">
          To democratize YouTube content analysis by providing every creator — regardless of budget or 
          technical skill — access to the same quality of metadata insights, transcript tools, and 
          optimization features that large agencies use every day. Free. Forever.
        </p>
      </div>

      {/* ── Skills ── */}
      <div className="card-dark p-7 space-y-5">
        <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
          <Code2 className="h-5 w-5 text-indigo-400" /> Core Tech Stack
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {skills.map((sk) => (
            <div
              key={sk.label}
              className="flex items-center gap-3 rounded-xl bg-[#0d0f14] border border-[#1a1e2a] px-4 py-3"
            >
              <span className={sk.color}>{sk.icon}</span>
              <span className="text-xs font-semibold text-[#8b92a9]">{sk.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bio ── */}
      <div className="card-dark p-8 md:p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-violet-600/5 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start gap-8">
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-red-600 to-violet-600 flex items-center justify-center text-3xl font-extrabold text-white shadow-xl shadow-red-900/30 select-none">
                JA
              </div>
              <span className="absolute -bottom-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 border-2 border-[#181c25]">
                <span className="h-2 w-2 rounded-full bg-white" />
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-1">Meet the Creator</p>
              <h2 className="text-2xl font-extrabold text-white">Joshua Adekunle</h2>
              <p className="text-[#8b92a9] mt-1 text-sm">
                Full-Stack Developer · UI/UX Enthusiast · Open-Source Builder
              </p>
            </div>
            <p className="text-sm text-[#8b92a9] leading-relaxed max-w-2xl">
              Hey! I'm Joshua — a passionate full-stack developer who loves building tools that make people's 
              digital workflows faster and smarter. TubeInspect Suite was born from a simple frustration: 
              why should creators need expensive subscriptions or complicated API setups just to understand 
              their own content? So I built this — a completely free, no-key-required YouTube toolkit for 
              everyone.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href="https://thejosh.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-white/5 border border-[#23283a] hover:bg-white/10 hover:border-[#2e3450] px-4 py-2 text-xs font-bold text-white transition"
              >
                <ExternalLink className="h-3.5 w-3.5 text-red-400" /> Portfolio
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
