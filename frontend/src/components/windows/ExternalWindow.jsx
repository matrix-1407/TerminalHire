import { ArrowUpRight, ShieldAlert } from "lucide-react";
import Window from "./Window";

const EMBEDDABLE_HOSTS = [
  "mrudul.dev",
  "localhost",
  "127.0.0.1",
];

function canEmbed(url) {
  try {
    const host = new URL(url).hostname;
    return EMBEDDABLE_HOSTS.some((allowed) => host.includes(allowed));
  } catch {
    return false;
  }
}

export default function ExternalWindow({
  title,
  href,
  zIndex,
  defaultPosition,
  onFocus,
  onMinimize,
  onClose,
}) {
  const embeddable = canEmbed(href);

  return (
    <Window
      title={title}
      zIndex={zIndex}
      defaultPosition={defaultPosition}
      onFocus={onFocus}
      onMinimize={onMinimize}
      onClose={onClose}
      headerActions={
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-xs text-cyan-300 hover:text-cyan-200 transition-colors inline-flex items-center gap-1"
        >
          Open in browser
          <ArrowUpRight size={13} />
        </a>
      }
    >
      <div className="flex-1 bg-slate-950/80">
        {embeddable ? (
          <iframe
            src={href}
            title={title}
            className="w-full h-full border-0"
          />
        ) : (
          <div className="h-full flex items-center justify-center p-8 text-center font-sans">
            <div className="max-w-md space-y-4 p-6 rounded-2xl border border-white/10 bg-black/40 shadow-2xl">
              <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 flex items-center justify-center mx-auto">
                <ShieldAlert size={24} />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">
                  Embedding Restricted by Provider
                </h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  {title} enforces strict browser security policies (CSP / X-Frame-Options) that prevent inside-window frame rendering.
                </p>
              </div>

              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 text-xs font-bold text-black hover:bg-cyan-300 transition-all shadow-md hover:shadow-cyan-400/20"
              >
                Open {title} in New Tab
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        )}
      </div>
    </Window>
  );
}