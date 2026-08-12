import MenuBar from "./MenuBar";
import Dock from "../dock/Dock";
import GradientWaves from "../ui/GradientWaves";
import ParticleText from "../ui/ParticleText";

export default function DesktopShell({
  desktopItems,
  dockItems,
  menuItems,
  windows,
  onOpenWindow,
  onDockAction,
  onMenuAction,
  children,
}) {
  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-hidden relative isolate">
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <GradientWaves
          horizonColor="#0f172a"
          waveColor="#60a5fa"
          crestColor="#e2e8f0"
          speed={0.9}
          amplitude={2.4}
          waveScale={0.90}
          waveRatio={1.15}
          swell={20}
          turbulence={30}
          tilt={0.85}
          zoom={1.15}
          height={5.2}
          fogDepth={13}
          detail="medium"
          brightness={1.15}
          opacity={0.7}
          mouseInteraction={false}
          grain={true}
          grainIntensity={0.04}
          className="h-full w-full"
        />
      </div>

        <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_36%)] pointer-events-none" />
        <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.18),transparent_34%)] pointer-events-none" />
        <div className="absolute inset-0 z-[1] opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <MenuBar menuItems={menuItems} onMenuAction={onMenuAction} />
      
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 pointer-events-none">
            <div className="w-full max-w-4xl flex flex-col items-center justify-center gap-4 pointer-events-auto">
                <ParticleText
                    text="MRUDUL BOKADE"
                    fontSize={65}
                    fontWeight={700}
                    particleSize={1.4}
                    density={1}
                    color="#ebab73"
                    highlightColor="#6c37e9"
                    scatter={14}
                    gatherDuration={1200}
                    stagger={120}
                    pointerRepel={35}
                    repelRadius={170}
                    idleDrift={0.18}
                    trigger="hover"
                    glow={true}
                    className="h-24 w-full md:h-28"
                />

                <div className="text-center text-white/70 text-sm md:text-base tracking-wide font-medium pointer-events-none"> 
                Backend • Cloud • DevOps • AI Systems • Security 
                </div>

                <div className="text-center text-cyan-300/70 text-xs md:text-sm tracking-[0.35em] uppercase font-semibold pointer-events-none">  TERMINALHIRE 
                </div>
            </div> 
        </div>

      <div className="absolute left-6 top-20 hidden lg:flex flex-col gap-5 z-10">
        {desktopItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onOpenWindow?.(item.id)}
              aria-label={`Open ${item.label}`}
              className="w-24 flex flex-col items-center gap-2 group"
            >
              <div className="relative w-16 h-16 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:bg-white/[0.1] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]">
                <Icon className="w-7 h-7 text-cyan-200" />
              </div>
              <span className="text-xs text-white/80 text-center font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="pointer-events-none relative z-20 h-[calc(100vh-3rem)] p-3 md:p-5 pb-24 md:pb-28">
        {children}
      </div>

      <Dock items={dockItems} windows={windows} onSelect={onDockAction} />
    </div>
  );
}
