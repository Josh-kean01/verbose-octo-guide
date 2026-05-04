import { FileText, CheckCircle, XCircle, AlertTriangle, Scale, RefreshCw, Mail } from "lucide-react";

const LAST_UPDATED = "June 1, 2025";

interface Section {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}

export default function TermsPage() {
  const sections: Section[] = [
    {
      icon: <CheckCircle className="h-5 w-5 text-emerald-400" />,
      title: "Acceptance of Terms",
      content: (
        <p className="text-sm text-[#8b92a9] leading-relaxed">
          By accessing or using TubeInspect Suite ("the Service"), you agree to be bound by these Terms of Service. 
          If you disagree with any part of these terms, you may not use the Service. These terms apply to all 
          visitors, users, and anyone who accesses the Service.
        </p>
      ),
    },
    {
      icon: <FileText className="h-5 w-5 text-blue-400" />,
      title: "Description of Service",
      content: (
        <div className="space-y-3 text-sm text-[#8b92a9] leading-relaxed">
          <p>
            TubeInspect Suite is a free, browser-based collection of tools designed to help users extract and 
            analyze publicly available information from YouTube videos. The Service includes:
          </p>
          <ul className="space-y-2 pl-4">
            {[
              "Metadata & SEO Extractor — retrieve titles, descriptions, tags, categories",
              "Video Clipper & Share — generate timestamped share links and embed codes",
              "Thumbnail Hub — download video thumbnails in multiple resolutions",
              "Downloader Assistant — generate terminal commands for yt-dlp",
              "Transcript & Summary Generator — fetch and display video captions",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p>
            All tools operate on <strong className="text-white">publicly available data</strong> and do not 
            circumvent any YouTube authentication or access controls.
          </p>
        </div>
      ),
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-violet-400" />,
      title: "Permitted Use",
      content: (
        <div className="space-y-3 text-sm text-[#8b92a9] leading-relaxed">
          <p>You may use TubeInspect Suite for:</p>
          <ul className="space-y-2 pl-4">
            {[
              "Personal research and analysis of YouTube content",
              "SEO and competitive analysis of publicly available videos",
              "Educational purposes including transcript review and note-taking",
              "Content creation workflows (thumbnail sourcing, clip timestamps)",
              "Non-commercial projects that reference YouTube metadata",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      icon: <XCircle className="h-5 w-5 text-rose-400" />,
      title: "Prohibited Use",
      content: (
        <div className="space-y-3 text-sm text-[#8b92a9] leading-relaxed">
          <p>You may <strong className="text-white">not</strong> use TubeInspect Suite to:</p>
          <ul className="space-y-2 pl-4">
            {[
              "Scrape, harvest, or systematically collect YouTube data at scale in ways that violate YouTube's Terms of Service",
              "Infringe on any copyright, trademark, or intellectual property rights of YouTube, Google, or content creators",
              "Distribute, sell, or commercially resell extracted content without appropriate licensing",
              "Use the Downloader Assistant to download copyrighted material for redistribution without permission",
              "Attempt to reverse-engineer, disrupt, or interfere with YouTube's platform or APIs",
              "Use the Service for any unlawful purpose or in violation of any applicable laws",
              "Misrepresent extracted data or use it to deceive third parties",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      icon: <AlertTriangle className="h-5 w-5 text-amber-400" />,
      title: "Disclaimer of Warranties",
      content: (
        <div className="space-y-3 text-sm text-[#8b92a9] leading-relaxed">
          <p>
            TubeInspect Suite is provided <strong className="text-white">"AS IS" and "AS AVAILABLE"</strong> without 
            any warranties of any kind, express or implied, including but not limited to:
          </p>
          <ul className="space-y-2 pl-4">
            {[
              "Merchantability or fitness for a particular purpose",
              "Accuracy, completeness, or reliability of extracted data",
              "Uninterrupted or error-free operation of the Service",
              "Compatibility with all YouTube video types, regions, or privacy settings",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p>
            The Service relies on undocumented YouTube endpoints and third-party CORS proxies that may change 
            without notice. We do not guarantee that all features will work for all videos at all times.
          </p>
        </div>
      ),
    },
    {
      icon: <Scale className="h-5 w-5 text-indigo-400" />,
      title: "Limitation of Liability",
      content: (
        <p className="text-sm text-[#8b92a9] leading-relaxed">
          To the fullest extent permitted by applicable law, Joshua Adekunle and TubeInspect Suite shall not 
          be liable for any indirect, incidental, special, consequential, or punitive damages — including loss 
          of data, revenue, goodwill, or profits — arising from your use of or inability to use the Service, 
          even if we have been advised of the possibility of such damages. Our total liability for any claim 
          related to the Service shall not exceed zero dollars ($0), as the Service is provided free of charge.
        </p>
      ),
    },
    {
      icon: <FileText className="h-5 w-5 text-cyan-400" />,
      title: "Intellectual Property",
      content: (
        <div className="space-y-3 text-sm text-[#8b92a9] leading-relaxed">
          <p>
            The TubeInspect Suite application code, design, and branding are the intellectual property of 
            Joshua Adekunle. All YouTube content (video titles, descriptions, thumbnails, captions) retrieved 
            through the Service belongs to its respective creators and is governed by YouTube's Terms of Service 
            and applicable copyright law.
          </p>
          <p>
            Use of extracted YouTube content must comply with YouTube's Terms of Service and copyright law. 
            TubeInspect claims no ownership over any content retrieved from YouTube.
          </p>
        </div>
      ),
    },
    {
      icon: <FileText className="h-5 w-5 text-rose-400" />,
      title: "Third-Party Links & Services",
      content: (
        <p className="text-sm text-[#8b92a9] leading-relaxed">
          The Service uses third-party services (AllOrigins, YouTube, Noembed) to function. We are not 
          responsible for the content, policies, or practices of these third-party services. Use of the 
          Service implies acceptance of these third-party terms where applicable. Links to external sites 
          are provided for convenience and do not constitute endorsement.
        </p>
      ),
    },
    {
      icon: <RefreshCw className="h-5 w-5 text-emerald-400" />,
      title: "Changes to Terms",
      content: (
        <p className="text-sm text-[#8b92a9] leading-relaxed">
          We reserve the right to update these Terms of Service at any time. The "Last Updated" date at the 
          top will reflect any changes. Your continued use of the Service after changes constitutes acceptance 
          of the new terms. We encourage you to review this page periodically.
        </p>
      ),
    },
    {
      icon: <Scale className="h-5 w-5 text-violet-400" />,
      title: "Governing Law",
      content: (
        <p className="text-sm text-[#8b92a9] leading-relaxed">
          These Terms shall be governed by and construed in accordance with applicable law. Any disputes 
          arising from these Terms or your use of the Service will be subject to the exclusive jurisdiction 
          of the courts applicable to Joshua Adekunle's place of residence. If any provision of these Terms 
          is found to be unenforceable, the remaining provisions will continue in full force and effect.
        </p>
      ),
    },
    {
      icon: <Mail className="h-5 w-5 text-blue-400" />,
      title: "Contact",
      content: (
        <p className="text-sm text-[#8b92a9] leading-relaxed">
          If you have any questions about these Terms of Service, please contact us at{" "}
          <a href="mailto:hello@tubeinspect.dev" className="text-violet-400 hover:underline font-semibold">
            hello@tubeinspect.dev
          </a>
          . We take all inquiries seriously and will respond within 48 hours.
        </p>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-slideUp">
      {/* Header */}
      <div className="card-dark p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-indigo-600/5 pointer-events-none" />
        <div className="relative z-10 flex items-start gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 flex-shrink-0">
            <Scale className="h-7 w-7 text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-1">Legal</p>
            <h1 className="text-3xl font-extrabold text-white mb-2">Terms of Service</h1>
            <p className="text-sm text-[#8b92a9]">Last updated: <span className="text-white font-semibold">{LAST_UPDATED}</span></p>
            <p className="text-sm text-[#8b92a9] mt-2 max-w-2xl leading-relaxed">
              Please read these terms carefully before using TubeInspect Suite. They outline what you can 
              do with our tools, what we're responsible for, and how we operate.
            </p>
          </div>
        </div>
      </div>

      {/* Summary banner */}
      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-blue-300 mb-1">TL;DR — The Short Version</p>
          <p className="text-xs text-[#8b92a9] leading-relaxed">
            Use TubeInspect for <strong className="text-white">personal, research, and educational purposes</strong> on 
            publicly available videos. Don't use it to infringe copyright, sell extracted content, or abuse YouTube's 
            platform. The Service is free, so it comes without warranties. Be responsible.
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

      {/* Footer note */}
      <div className="rounded-2xl border border-[#1a1e2a] bg-[#0d0f14] p-5 text-center">
        <p className="text-xs text-[#4f566b]">
          These terms were last updated on <span className="text-[#8b92a9]">{LAST_UPDATED}</span> and 
          apply to all users of TubeInspect Suite. &copy; {new Date().getFullYear()} Joshua Adekunle.
        </p>
      </div>
    </div>
  );
}
