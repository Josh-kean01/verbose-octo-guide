import { useState } from "react";
import {
  Mail, MessageSquare, Send, Check, ExternalLink,
  Globe, AlertCircle, Sparkles,
} from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.message.trim()) e.message = "Please write a message.";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    // Compose mailto link as fallback (no backend in this static app)
    const subject = encodeURIComponent(form.subject || "TubeInspect Inquiry");
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );
    window.open(`mailto:hello@tubeinspect.dev?subject=${subject}&body=${body}`, "_blank");
    setSubmitted(true);
  };

  const handleChange = (field: string, val: string) => {
    setForm((p) => ({ ...p, [field]: val }));
    if (errors[field]) setErrors((p) => { const n = { ...p }; delete n[field]; return n; });
  };

  const inputClass = (field: string) =>
    `w-full rounded-xl border ${errors[field] ? "border-red-500/50 bg-red-500/5" : "border-[#23283a] bg-[#0d0f14]"} py-3 px-4 text-sm text-white placeholder-[#4f566b] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 focus:outline-none transition`;

  const channels = [
    {
      icon: <Mail className="h-5 w-5 text-red-400" />,
      label: "Email",
      value: "hello@tubeinspect.dev",
      href: "mailto:hello@tubeinspect.dev",
      bg: "bg-red-500/10 border-red-500/20",
    },
    {
      icon: (
        <svg className="h-5 w-5 text-blue-400 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      label: "Twitter / X",
      value: "@TubeInspect",
      href: "https://twitter.com/",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      icon: <Globe className="h-5 w-5 text-emerald-400" />,
      label: "Portfolio",
      value: "thejosh.vercel.app",
      href: "https://thejosh.vercel.app/",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  const faqs = [
    {
      q: "Is TubeInspect completely free?",
      a: "Yes — all core tools (metadata, thumbnails, clipper, downloader scripts, transcript) are 100% free and require no API key or account.",
    },
    {
      q: "Can I request a new tool?",
      a: "Absolutely. Use the contact form or email us directly and we'll consider it for the next update.",
    },
    {
      q: "What data do you store?",
      a: "None. Everything is processed entirely in your browser. We don't log URLs, video IDs, or any personal information.",
    },
    {
      q: "How do I report a bug?",
      a: "Send us a message via the form with the video link that caused the issue and a description of what happened.",
    },
  ];

  return (
    <div className="space-y-8 animate-slideUp">
      {/* Header */}
      <div className="card-dark p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-transparent to-red-600/5 pointer-events-none" />
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-2">Get In Touch</p>
          <h1 className="text-3xl font-extrabold text-white mb-3">Contact Us</h1>
          <p className="text-sm text-[#8b92a9] leading-relaxed max-w-xl">
            Have a question, feature request, or just want to say hi? We'd love to hear from you.
            Joshua responds to every message personally, usually within 24–48 hours.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Form ── */}
        <div className="lg:col-span-2 card-dark p-7">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-16 gap-5 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <Check className="h-8 w-8 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-sm text-[#8b92a9] max-w-sm">
                  Your mail client should have opened. If not, email us directly at{" "}
                  <a href="mailto:hello@tubeinspect.dev" className="text-violet-400 hover:underline">
                    hello@tubeinspect.dev
                  </a>
                </p>
              </div>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                className="rounded-xl bg-[#1a1e2a] hover:bg-[#1e2230] border border-[#23283a] px-6 py-2.5 text-sm font-bold text-white transition"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-violet-400" /> Send a Message
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#8b92a9] mb-1.5">
                    Your Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Joshua Adekunle"
                    className={inputClass("name")}
                  />
                  {errors.name && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8b92a9] mb-1.5">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass("email")}
                  />
                  {errors.email && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8b92a9] mb-1.5">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  placeholder="Feature Request / Bug Report / Partnership…"
                  className={inputClass("subject")}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8b92a9] mb-1.5">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  rows={6}
                  placeholder="Tell us what's on your mind…"
                  className={`${inputClass("message")} resize-none`}
                />
                {errors.message && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.message}</p>}
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-900/30 transition"
              >
                <Send className="h-4 w-4" /> Send Message
              </button>
            </form>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-5">
          {/* Contact Channels */}
          <div className="card-dark p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Direct Channels</h3>
            <div className="space-y-3">
              {channels.map((ch) => (
                <a
                  key={ch.label}
                  href={ch.href}
                  target={ch.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-[#0d0f14] border border-[#1a1e2a] hover:border-[#2e3450] p-3.5 group transition"
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${ch.bg} flex-shrink-0`}>
                    {ch.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-[#4f566b] uppercase tracking-wide">{ch.label}</p>
                    <p className="text-xs font-bold text-[#8b92a9] group-hover:text-white transition truncate">{ch.value}</p>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-[#4f566b] group-hover:text-white transition flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>

          {/* Response Time */}
          <div className="card-dark p-5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400">Available</span>
            </div>
            <p className="text-xs text-[#8b92a9] leading-relaxed">
              Typical response time: <span className="text-white font-semibold">24–48 hours</span>. 
              For urgent matters, Twitter/X DMs are fastest.
            </p>
          </div>

          {/* Feature request note */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <p className="text-xs font-bold text-amber-300">Request a Feature</p>
            </div>
            <p className="text-xs text-[#8b92a9] leading-relaxed">
              Have an idea for a new YouTube tool? Send it over — Joshua reviews every suggestion and the most popular ones make it into the next release.
            </p>
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="card-dark p-7 space-y-5">
        <h2 className="text-lg font-extrabold text-white">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl bg-[#0d0f14] border border-[#1a1e2a] p-5 space-y-2">
              <p className="text-sm font-bold text-white">{faq.q}</p>
              <p className="text-xs text-[#8b92a9] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
