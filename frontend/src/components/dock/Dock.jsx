import { FileText, Globe, Code2, UserRound } from "lucide-react";

const dockItems = [
  { label: "Resume", icon: FileText, active: false },
  { label: "Portfolio", icon: Globe, active: false },
  { label: "GitHub", icon: Code2, active: false },
  { label: "LinkedIn", icon: UserRound, active: false },
  { label: "TerminalHire", icon: Code2, active: true },
];

export default function Dock() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 flex justify-center z-20">
      <div className="pointer-events-auto flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/[0.05] px-3 py-2 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        {dockItems.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            className={`group relative flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-200 ${
              active
                ? "border-cyan-400/40 bg-cyan-400/10 shadow-[0_0_30px_rgba(34,211,238,0.18)]"
                : "border-white/10 bg-white/[0.03] hover:bg-white/[0.08]"
            }`}
          >
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/60 px-2 py-1 text-[10px] text-white/70 opacity-0 transition-opacity group-hover:opacity-100">
              {label}
            </span>
            <Icon className={`h-5 w-5 ${active ? "text-cyan-200" : "text-white/80"}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
