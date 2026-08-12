import { Trash2 } from "lucide-react";

export default function Window({
  title,
  headerActions,
  children,
  className = "",
}) {
  return (
    <div
      className={`w-full max-w-5xl h-[94vh] md:h-[86vh] rounded-[28px] border border-white/10 bg-white/[0.06] backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] overflow-hidden flex flex-col ${className}`.trim()}
    >
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-5 bg-black/20">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <span className="text-sm text-white/75 ml-2 font-medium">{title}</span>
        </div>

        <div className="flex items-center gap-3">
          {headerActions}
        </div>
      </div>

      {children}
    </div>
  );
}
