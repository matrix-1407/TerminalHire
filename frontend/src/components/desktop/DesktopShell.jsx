import MenuBar from "./MenuBar";
import Dock from "../dock/Dock";

export default function DesktopShell({ desktopItems, children }) {
  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_38%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.14),transparent_34%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <MenuBar />

      <div className="absolute left-6 top-20 hidden lg:flex flex-col gap-5 z-10">
        {desktopItems.map((item) => {
          const Icon = item.icon;

          return (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="w-24 flex flex-col items-center gap-2 group"
            >
              <div className="relative w-16 h-16 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:bg-white/[0.1] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]">
                <Icon className="w-7 h-7 text-cyan-200" />
              </div>
              <span className="text-xs text-white/80 text-center font-medium">
                {item.label}
              </span>
            </a>
          );
        })}
      </div>

      <div className="h-[calc(100vh-3rem)] flex items-center justify-center p-3 md:p-5">
        {children}
      </div>

      <Dock />
    </div>
  );
}
