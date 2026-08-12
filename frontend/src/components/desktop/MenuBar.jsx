export default function MenuBar() {
  return (
    <div className="h-12 border-b border-white/10 bg-white/[0.04] backdrop-blur-xl flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-red-400" />
        <div className="w-2 h-2 rounded-full bg-yellow-400" />
        <div className="w-2 h-2 rounded-full bg-green-400" />
        <span className="text-sm text-white/70 ml-2 font-medium">
          TerminalHire • Recruiter Mode
        </span>
      </div>

      <div className="hidden md:flex items-center gap-2 text-xs text-emerald-300/80">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        SYSTEM ONLINE
      </div>
    </div>
  );
}
