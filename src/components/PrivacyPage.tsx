import { Shield, Eye, Database, Cookie, Lock, RefreshCw, Mail } from "lucide-react";

const LAST_UPDATED = "June 1, 2025";

interface Section {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}

export default function PrivacyPage() {
  const sections: Section[] = [
    {
      icon: <Eye className="h-5 w-5 text-violet-400" />,
      title: "Information We Collect",
      content: (
        <div className="space-y-3 text-sm text-[#8b92a9] leading-relaxed">
          <p>
            <strong className="text-white">TubeInspect Suite does not collect, store, or transmit any personal 
            data.</strong> All processing happens entirely within your browser (client-side). 
          </p>
          <p>The only data involved in using our tools is:</p>
          <ul className="space-y-2 pl-4">
            {[
              "YouTube video URLs you paste into the input fields — these are sent directly to YouTube's public infrastructure via CORS proxy to retrieve metadata.",
              "Optional YouTube API Key — stored exclusively in your browser's localStorage and never sent to any server we operate.",
              "No account registration, no cookies from us, and no tracking pixels are used.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-violet-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      icon: <Database className="h-5 w-5 text-blue-400" />,
      title: "How We Use Your Data",
      content: (
        <div className="space-y-3 text-sm text-[#8b92a9] leading-relaxed">
          <p>We do not use your data — because we don't have any. Specifically:</p>
          <ul className="space-y-2 pl-4">
            {[
              "We do not build profiles on users.",
              "We do not sell, lease, or share any information with third parties.",
              "We do not use analytics services that track individual users (e.g. Google Analytics).",
              "Video URLs you paste are processed transiently — they are used to make a single outbound request and then discarded.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      icon: <Cookie className="h-5 w-5 text-amber-400" />,
      title: "Cookies & Local Storage",
      content: (
        <div className="space-y-3 text-sm text-[#8b92a9] leading-relaxed">
          <p>TubeInspect Suite uses <strong className="text-white">browser localStorage</strong> only for:</p>
          <ul className="space-y-2 pl-4">
            {[
              "Saving your optional YouTube API Key across sessions — so you don't have to re-enter it every visit. This key never leaves your device.",
              "No third-party cookies are set by TubeInspect. The embedded YouTube iframes (used in the Clipper and Embed tools) may set YouTube's own cookies per Google's Privacy Policy.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p>
            You can clear all locally stored data at any time via your browser's developer tools → Application → Local Storage.
          </p>
        </div>
      ),
    },
    {
      icon: <Lock className="h-5 w-5 text-emerald-400" />,
      title: "Third-Party Services",
      content: (
        <div className="space-y-3 text-sm text-[#8b92a9] leading-relaxed">
          <p>TubeInspect uses the following third-party services to function:</p>
          <div className="space-y-3">
            {[
              {
                name: "AllOrigins (api.allorigins.win)",
                desc: "A free, open-source CORS proxy used to fetch YouTube page content from your browser. Requests pass through their server transiently. No data is stored.",
                link: "https://allorigins.win/",
              },
              {
                name: "YouTube / Google",
                desc: "YouTube's public infrastructure (thumbnail CDN, oEmbed API, Innertube caption endpoints) is used to retrieve video data. Google's Privacy Policy governs this.",
                link: "https://policies.google.com/privacy",
              },
              {
                name: "Noembed",
                desc: "Used as an oEmbed fallback to retrieve basic video title and channel name.",
                link: "https://noembed.com/",
              },
            ].map((svc) => (
              <div key={svc.name} className="rounded-xl bg-[#0a0c10] border border-[#1a1e2a] p-4">
                <p className="text-xs font-bold text-white mb-1">{svc.name}</p>
                <p className="text-xs text-[#8b92a9] leading-relaxed">{svc.desc}</p>
                <a href={svc.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-400 hover:underline mt-1 block">
                  {svc.link}
                </a>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: <Shield className="h-5 w-5 text-rose-400" />,
      title: "Children's Privacy",
      content: (
        <p className="text-sm text-[#8b92a9] leading-relaxed">
          TubeInspect Suite is not directed to children under the age of 13. We do not knowingly collect any 
          information from children. Since we collect no personal data at all, there is no specific risk to minors 
          from using our tools.
        </p>
      ),
    },
    {
      icon: <RefreshCw className="h-5 w-5 text-cyan-400" />,
      title: "Changes to This Policy",
      content: (
        <p className="text-sm text-[#8b92a9] leading-relaxed">
          We may update this Privacy Policy from time to time. Changes will be reflected by the "Last Updated" date 
          at the top of this page. Continued use of TubeInspect Suite after changes constitutes your acceptance of 
          the updated policy. Since we collect no personal data, changes are unlikely to affect your privacy in any 
          meaningful way.
        </p>
      ),
    },
    {
      icon: <Mail className="h-5 w-5 text-violet-400" />,
      title: "Contact",
      content: (
        <p className="text-sm text-[#8b92a9] leading-relaxed">
          If you have any questions about this Privacy Policy, you can reach us at{" "}
          <a href="mailto:hello@tubeinspect.dev" className="text-violet-400 hover:underline font-semibold">
            hello@tubeinspect.dev
          </a>{" "}
          or through the Contact page. We'll respond within 48 hours.
        </p>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-slideUp">
      {/* Header */}
      <div className="card-dark p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-transparent to-blue-600/5 pointer-events-none" />
        <div className="relative z-10 flex items-start gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 border border-violet-500/20 flex-shrink-0">
            <Shield className="h-7 w-7 text-violet-400" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-violet-500 mb-1">Legal</p>
            <h1 className="text-3xl font-extrabold text-white mb-2">Privacy Policy</h1>
            <p className="text-sm text-[#8b92a9]">Last updated: <span className="text-white font-semibold">{LAST_UPDATED}</span></p>
            <p className="text-sm text-[#8b92a9] mt-2 max-w-2xl leading-relaxed">
              TubeInspect Suite is built with privacy-first principles. This policy describes our approach 
              to your data — which is essentially: we don't collect or store it.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 flex items-start gap-3">
        <Shield className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-emerald-300 mb-1">TL;DR — The Short Version</p>
          <p className="text-xs text-[#8b92a9] leading-relaxed">
            We collect <strong className="text-white">zero personal data</strong>. Everything happens in your browser. 
            No accounts. No tracking. No cookies from us. Your API key (if set) stays only on your device.
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section, i) => (
          <div key={i} className="card-dark p-6 space-y-4">
            <h2 className="text-base font-extrabold text-white flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0d0f14] border border-[#1a1e2a] flex-shrink-0">
                {section.icon}
              </span>
              {i + 1}. {section.title}
            </h2>
            {section.content}
          </div>
        ))}
      </div>
    </div>
  );
}
