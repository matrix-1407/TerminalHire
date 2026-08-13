import { useEffect, useState } from "react";

const formatNow = (date) =>
  date.toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });

export default function MenuBar({ menuItems = [], onMenuAction }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative z-30 h-12 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <span className="text-white/90 text-base leading-none" aria-hidden="true">
          ●
        </span>
        <span className="text-sm text-white/90 font-semibold">TerminalHire</span>

        <div className="hidden md:flex items-center gap-1">
          {menuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onMenuAction?.(item.windowId)}
              className="px-2 py-1 rounded-md text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs md:text-sm text-white/85">
        <span className="hidden md:inline-flex items-center gap-2 text-emerald-300/90">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          SYSTEM ONLINE
        </span>
        <span>{formatNow(now)}</span>
      </div>
    </div>
  );
}
