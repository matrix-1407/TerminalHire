import { useEffect, useState } from "react";
import { Wifi, Battery, Search, Command } from "lucide-react";

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
    <header className="relative z-30 h-7 border-b border-white/[0.08] bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-3 text-xs select-none">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="System Menu"
          className="text-white/90 hover:text-white font-bold transition-colors flex items-center"
        >
          <Command className="w-3.5 h-3.5" />
        </button>

        <span className="font-semibold text-white/90 tracking-tight">
          Mrudul's Portfolio
        </span>

        <nav className="hidden md:flex items-center gap-0.5 ml-1">
          {menuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onMenuAction?.(item.windowId)}
              className="px-2 py-0.5 rounded text-xs text-white/75 hover:text-white hover:bg-white/10 transition-colors font-medium"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3 text-xs text-white/75 font-mono">
        <div className="hidden sm:flex items-center gap-2 text-white/60">
          <Search className="w-3.5 h-3.5 hover:text-white transition-colors cursor-pointer" aria-label="Search" />
          <Wifi className="w-3.5 h-3.5 hover:text-white transition-colors cursor-pointer" aria-label="Wi-Fi" />
          <Battery className="w-4 h-4 hover:text-white transition-colors cursor-pointer" aria-label="Battery" />
        </div>

        <time className="text-white/85 text-[11px] font-medium tracking-tight">
          {formatNow(now)}
        </time>
      </div>
    </header>
  );
}
