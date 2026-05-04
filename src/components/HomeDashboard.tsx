import {
  FileSearch,
  Scissors,
  Image as ImageIcon,
  Download,
  FileText,
  Sparkles,
  Play,
  ChevronRight,
  Zap,
  Plus,
} from "lucide-react";

interface HomeDashboardProps {
  onSelectTool: (page: string) => void;
}

const tools = [
  {
    id: "metadata",
    title: "Metadata & SEO Extractor",
    description: "Extract titles, full descriptions, categories, hidden tags, and SEO ratings from any link.",
    icon: <FileSearch className="h-5 w-5" />,
    iconBg: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
  },
  {
    id: "clipper",
    title: "Video Clipper & Share",
    description: "Crop specific segments with precise start and end times to share exactly the right snippet.",
    icon: <Scissors className="h-5 w-5" />,
    iconBg: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  },
  {
    id: "thumbnails",
    title: "Thumbnail Hub",
    description: "Directly fetch and save multiple resolutions of video thumbnails without an API key.",
    icon: <ImageIcon className="h-5 w-5" />,
    iconBg: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  },
  {
    id: "downloader",
    title: "Downloader Assistant",
    description: "Extract video and audio direct download scripts, format insights, and terminal download lines.",
    icon: <Download className="h-5 w-5" />,
    iconBg: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  },
  {
    id: "transcript",
    title: "Transcript & Summary",
    description: "Review automated transcripts, create lecture summaries, or generate high-quality notes.",
    icon: <FileText className="h-5 w-5" />,
    iconBg: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
  },
];

const steps = [
  {
    num: "01",
    title: "Analyze the Leaders",
    description: "Deep dive into metadata. Extract titles and hidden tags to master the algorithm.",
  },
  {
    num: "02",
    title: "Refine Your Assets",
    description: "Fetch high-res thumbnails and use the Clipper to create high-impact social snippets.",
  },
  {
    num: "03",
    title: "Repurpose & Scale",
    description: "Turn transcripts into summaries and structured notes for your digital workflow.",
  },
];

export default function HomeDashboard({ onSelectTool }: HomeDashboardProps) {
  return (
    <div className="space-y-0 -mt-8">
      {/* ─── HERO SECTION ─────────────────────────────── */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden hero-bg">
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[#0d0f14]" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/70 mb-6 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            NOW POWERED BY ADVANCED NLP
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight mb-5">
            The Ultimate YouTube<br />
            <span className="text-gradient-red">Optimization Toolkit</span>
          </h1>

          <p className="text-base text-white/60 max-w-xl mx-auto mb-10 leading-relaxed">
            Unlock video optimizations, analyze hidden tags, crop specific clips, and download resources — all without an API key.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                document.getElementById("toolkit")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-3.5 text-sm shadow-lg shadow-red-900/40 transition active:scale-95"
            >
              Explore Tools <Download className="h-4 w-4" />
            </button>
            <button
              onClick={() => onSelectTool("metadata")}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-3.5 text-sm backdrop-blur-sm transition active:scale-95"
            >
              <Play className="h-4 w-4" /> Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* ─── WORKFLOW SECTION ─────────────────────────── */}
      <section className="bg-[#0d0f14] px-4 py-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold tracking-widest text-red-500 uppercase block mb-3">
              Workflow
            </span>
            <h2 className="text-3xl font-extrabold text-white mb-8 leading-tight">
              Three steps to viral content
            </h2>

            <div className="space-y-6">
              {steps.map((step) => (
                <div key={step.num} className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-lg bg-red-600/10 border border-red-500/20 text-xs font-extrabold text-red-400">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">{step.title}</h3>
                    <p className="text-xs text-[#8b92a9] leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden border border-[#23283a] shadow-2xl shadow-black/60">
              <img
                src="/images/workflow-laptop.jpg"
                alt="Workflow Analytics"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center animate-float">
              <Zap className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── TOOLS GRID ───────────────────────────────── */}
      <section id="toolkit" className="bg-[#0d0f14] px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest text-red-500 uppercase block mb-3">
              The Toolkit
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              Powerful tools for every creator
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => onSelectTool(tool.id)}
                className="group card-dark text-left p-6 flex flex-col justify-between min-h-[200px] hover:shadow-xl hover:shadow-black/40 transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${tool.iconBg}`}>
                    {tool.icon}
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-[#8b92a9] leading-relaxed max-w-xs">
                    {tool.description}
                  </p>
                </div>

                <div className="flex items-center gap-1 mt-6 text-xs font-bold text-red-500 group-hover:translate-x-1 transition-transform duration-200">
                  Open Tool <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </button>
            ))}

            {/* Feature Request Card */}
            <div className="card-dark p-6 flex flex-col items-center justify-center min-h-[200px] gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
                <Plus className="h-5 w-5 text-red-400" />
              </div>
              <p className="text-sm font-semibold text-white text-center">
                Custom tools for your team?
              </p>
              <a
                href="mailto:hello@tubeinspect.com"
                className="w-full rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2.5 text-center transition active:scale-95"
              >
                Request a Feature
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
