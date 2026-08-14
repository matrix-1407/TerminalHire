import { useState, memo } from "react";
import Window from "./Window";
import {
  Mail,
  Globe,
  Code2,
  BriefcaseBusiness,
  ArrowUpRight,
  Copy,
  Check,
  MapPin,
  Send,
  Sparkles,
  MessageSquareCode,
} from "lucide-react";
import profileData from "../../../../data/profile.json";

function ContactWindow({
  title = "Contact",
  zIndex,
  defaultPosition,
  onFocus,
  onMinimize,
  onClose,
}) {
  const { social_links, identity } = profileData;
  const emailAddress = "mrudulbokade1407@gmail.com";

  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const links = [
    {
      title: "Portfolio",
      url: social_links.portfolio,
      icon: Globe,
      color: "text-cyan-300",
      badge: "mrudul.dev",
      description: "Interactive terminal & showcase",
    },
    {
      title: "GitHub",
      url: social_links.github,
      icon: Code2,
      color: "text-emerald-300",
      badge: "matrix-1407",
      description: "Repositories & DPI / RAG engines",
    },
    {
      title: "LinkedIn",
      url: social_links.linkedin,
      icon: BriefcaseBusiness,
      color: "text-blue-300",
      badge: "mrudul-bokade",
      description: "Professional updates & network",
    },
  ];

  return (
    <Window
      title={title}
      zIndex={zIndex}
      defaultPosition={defaultPosition}
      onFocus={onFocus}
      onMinimize={onMinimize}
      onClose={onClose}
      className="!w-[min(560px,calc(100vw-2rem))] !h-auto max-h-[88vh]"
    >
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-[#070a11]/95 font-sans space-y-5 text-sm select-text scrollbar-thin scrollbar-thumb-white/10">
        {/* Creative Catchy Header */}
        <div className="text-center space-y-2 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 font-mono text-[11px] font-semibold tracking-wide">
            <Sparkles size={12} className="animate-pulse text-cyan-400" />
            LET'S CONNECT
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
            Let's connect, discuss opportunities, or just talk tech! 🚀
          </h2>

          <p className="text-xs text-white/60 max-w-md mx-auto leading-relaxed">
            Whether you have an internship or full-time engineering role in mind, or want to discuss cloud, backend, or AI systems—my inbox is open!
          </p>
        </div>

        {/* Featured Email Card */}
        <div className="relative overflow-hidden p-4 sm:p-5 rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-950/50 via-slate-900/80 to-slate-950/95 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5 min-w-0">
              <div className="text-[10px] font-mono font-bold tracking-wider text-cyan-400 uppercase">
                DIRECT EMAIL CHANNEL
              </div>
              <div className="text-sm sm:text-base font-mono font-bold text-white tracking-tight truncate">
                {emailAddress}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`mailto:${emailAddress}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-400 text-black font-bold text-xs hover:bg-cyan-300 transition-all duration-200 shadow-md hover:shadow-cyan-400/20 active:scale-95 cursor-pointer"
              >
                <Send size={13} />
                Send Email
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.08] border border-white/10 text-xs font-mono font-medium text-white/90 hover:bg-white/[0.15] transition-all duration-200 cursor-pointer active:scale-95"
              >
                {copied ? (
                  <>
                    <Check size={13} className="text-emerald-400" />
                    <span className="text-emerald-300 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} className="text-cyan-300" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Connect Links */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono font-semibold tracking-wider text-white/40 uppercase">
            Quick Connect Links
          </div>

          <div className="grid gap-2.5">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.title}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between p-3.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] hover:border-cyan-400/30 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-900 border border-white/10 group-hover:border-cyan-400/40 group-hover:scale-105 transition-all">
                      <Icon size={16} className={link.color} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-white group-hover:text-cyan-200 transition-colors text-xs sm:text-sm">
                          {link.title}
                        </h4>
                        <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/10 text-white/50">
                          {link.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50">{link.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center p-1.5 text-white/40 group-hover:text-cyan-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                    <ArrowUpRight size={15} />
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Location & Status Footer */}
        <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-white/50 font-mono">
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={12} className="text-cyan-300" />
            {identity.current_city}
          </span>
          <span className="text-emerald-300/90 font-medium">● Open to Hybrid / On-site</span>
        </div>
      </div>
    </Window>
  );
}

export default memo(ContactWindow);
