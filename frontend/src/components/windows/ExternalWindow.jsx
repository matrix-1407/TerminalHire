import { ArrowUpRight } from "lucide-react";
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
          className="text-xs text-cyan-200 hover:text-cyan-100 transition-colors inline-flex items-center gap-1"
        >
          Open in browser
          <ArrowUpRight size={14} />
        </a>
      }
    >
      <div className="flex-1 bg-slate-950/40">
        {embeddable ? (
          <iframe
            src={href}
            title={title}
            className="w-full h-full border-0"
          />
        ) : (
          <div className="h-full flex items-center justify-center p-8 text-center">
            <div className="max-w-md space-y-4">
              <div className="text-4xl">🌐</div>

              <h3 className="text-lg font-semibold text-white">
                This site cannot be embedded
              </h3>

              <p className="text-sm text-white/70 leading-6">
                {title} blocks iframe embedding using browser security policies
                (CSP / X-Frame-Options).
              </p>

              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-black hover:bg-cyan-300 transition"
              >
                Open {title}
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        )}
      </div>
    </Window>
  );
}