import { useState, useEffect } from "react";
import KeyInput from "./components/KeyInput";
import VideoInput from "./components/VideoInput";
import MetadataViewer from "./components/MetadataViewer";
import HomeDashboard from "./components/HomeDashboard";
import ClipperTool from "./components/ClipperTool";
import ThumbnailTool from "./components/ThumbnailTool";
import DownloadAssistant from "./components/DownloadAssistant";
import TranscriptTool from "./components/TranscriptTool";
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";
import PrivacyPage from "./components/PrivacyPage";
import TermsPage from "./components/TermsPage";
import { getVideoData, VideoMetadata } from "./services/youtube";
import { ShieldAlert, Sparkles, Code2, Info, Mail, Shield, Scale } from "lucide-react";

const PAGE_LABELS: Record<string, string> = {
  metadata: "Metadata & SEO Extractor",
  clipper: "Video Clipper & Share",
  thumbnails: "Thumbnail Hub",
  downloader: "Downloader Assistant",
  transcript: "Transcript & Summary",
  about: "About Us",
  contact: "Contact",
  privacy: "Privacy Policy",
  terms: "Terms of Service",
};

export default function App() {
  const [apiKey, setApiKey] = useState<string>("");
  const [videoData, setVideoData] = useState<VideoMetadata | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<string>("home");

  useEffect(() => {
    const savedKey = localStorage.getItem("yt_extractor_api_key");
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleSaveKey = (key: string) => {
    setApiKey(key);
    if (key) localStorage.setItem("yt_extractor_api_key", key);
    else localStorage.removeItem("yt_extractor_api_key");
  };

  const handleSearch = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getVideoData(id, apiKey || undefined);
      setVideoData(data);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching video data.");
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isHome = activePage === "home";
  const isToolPage = ["metadata", "clipper", "thumbnails", "downloader", "transcript"].includes(activePage);
  const isContentPage = ["about", "contact", "privacy", "terms"].includes(activePage);

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0f14] text-[#f0f2f8]">

      {/* ─── NAV ───────────────────────────────────────── */}
      <nav className="glass-dark sticky top-0 z-50 border-b border-[#23283a]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 h-16">
          {/* Logo */}
          <button onClick={() => navigate("home")} className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 shadow-lg shadow-red-900/50 group-hover:scale-105 transition">
              <svg className="h-4 w-4 text-white fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </div>
            <div>
              <span className="text-sm font-bold text-white block leading-none">TubeInspect</span>
              <span className="text-[10px] text-red-500 font-semibold">Suite v2</span>
            </div>
          </button>

          {/* Right */}
          <div className="flex items-center gap-2">
            <a
              href="https://developers.google.com/youtube/v3"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-[#23283a] bg-[#181c25] hover:bg-[#1e2230] px-4 py-2 text-xs font-bold text-white transition"
            >
              <Code2 className="h-3.5 w-3.5" /> Developer API
            </a>
          </div>
        </div>
      </nav>

      {/* ─── BREADCRUMB ────────────────────────────────── */}
      {!isHome && (
        <div className="border-b border-[#1a1e2a] bg-[#0d0f14]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-xs text-[#4f566b]">
            <button onClick={() => navigate("home")} className="hover:text-white transition">Home</button>
            <span>/</span>
            <span className="text-[#8b92a9] font-medium">{PAGE_LABELS[activePage] || activePage}</span>
          </div>
        </div>
      )}

      {/* ─── MAIN ──────────────────────────────────────── */}
      <main className={`flex-1 ${isHome ? "" : "mx-auto max-w-5xl px-4 sm:px-6 py-8"}`}>

        {/* HOME */}
        {isHome && (
          <HomeDashboard onSelectTool={navigate} />
        )}

        {/* TOOL PAGES */}
        {isToolPage && (
          <div className="space-y-5 animate-slideUp">
            {activePage === "metadata" && (
              <>
                <KeyInput apiKey={apiKey} onSaveKey={handleSaveKey} />
                <VideoInput onSearch={handleSearch} isLoading={isLoading} />
                {error && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-900/30 bg-red-950/20 p-4">
                    <ShieldAlert className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-red-300 mb-0.5">Extraction Failed</p>
                      <p className="text-xs text-red-400/80">{error}</p>
                    </div>
                  </div>
                )}
                {isLoading && (
                  <div className="card-dark p-12 flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#23283a] border-t-red-500" />
                    <p className="text-sm text-[#8b92a9]">Extracting metadata…</p>
                  </div>
                )}
                {!isLoading && videoData && <MetadataViewer data={videoData} />}
                {!isLoading && !videoData && !error && (
                  <div className="card-dark p-14 text-center">
                    <Sparkles className="mx-auto h-12 w-12 text-indigo-500/30 mb-4" />
                    <h3 className="text-base font-bold text-white mb-1">Ready to inspect</h3>
                    <p className="text-sm text-[#8b92a9] max-w-sm mx-auto">
                      Paste a YouTube link above to extract full metadata, tags, and SEO insights.
                    </p>
                  </div>
                )}
              </>
            )}
            {activePage === "clipper" && <ClipperTool />}
            {activePage === "thumbnails" && <ThumbnailTool />}
            {activePage === "downloader" && <DownloadAssistant />}
            {activePage === "transcript" && <TranscriptTool />}
          </div>
        )}

        {/* CONTENT PAGES */}
        {isContentPage && (
          <div className="animate-slideUp">
            {activePage === "about" && <AboutPage onSelectTool={navigate} />}
            {activePage === "contact" && <ContactPage />}
            {activePage === "privacy" && <PrivacyPage />}
            {activePage === "terms" && <TermsPage />}
          </div>
        )}
      </main>

      {/* ─── FOOTER ─────────────────────────────────────── */}
      <footer className="border-t border-[#1a1e2a] mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button onClick={() => navigate("home")} className="flex items-center gap-2 group">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600">
                <svg className="h-3.5 w-3.5 text-white fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-[#8b92a9] group-hover:text-white transition">TubeInspect Suite</span>
            </button>

            <div className="flex flex-wrap items-center justify-center gap-5">
              <button onClick={() => navigate("privacy")} className={`flex items-center gap-1.5 text-xs transition ${activePage === "privacy" ? "text-white font-semibold" : "text-[#4f566b] hover:text-white"}`}>
                <Shield className="h-3 w-3" /> Privacy Policy
              </button>
              <button onClick={() => navigate("terms")} className={`flex items-center gap-1.5 text-xs transition ${activePage === "terms" ? "text-white font-semibold" : "text-[#4f566b] hover:text-white"}`}>
                <Scale className="h-3 w-3" /> Terms of Service
              </button>
              <button onClick={() => navigate("about")} className={`flex items-center gap-1.5 text-xs transition ${activePage === "about" ? "text-white font-semibold" : "text-[#4f566b] hover:text-white"}`}>
                <Info className="h-3 w-3" /> About
              </button>
              <button onClick={() => navigate("contact")} className={`flex items-center gap-1.5 text-xs transition ${activePage === "contact" ? "text-white font-semibold" : "text-[#4f566b] hover:text-white"}`}>
                <Mail className="h-3 w-3" /> Contact
              </button>
            </div>

            <p className="text-xs text-[#4f566b]">&copy; {new Date().getFullYear()} Joshua Adekunle</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
