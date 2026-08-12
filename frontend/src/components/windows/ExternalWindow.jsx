import { ArrowUpRight } from "lucide-react";

import Window from "./Window";

export default function ExternalWindow({
  title,
  href,
  zIndex,
  defaultPosition,
  onFocus,
  onMinimize,
  onClose,
}) {
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
      <div className="h-full bg-slate-950/40 p-3">
        <iframe
          title={title}
          src={href}
          className="h-full w-full rounded-2xl border border-white/10 bg-slate-950"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>
    </Window>
  );
}
