import SpecularButton from "../ui/SpecularButton";

export default function Dock({ items = [], windows = {}, onSelect }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 flex justify-center z-20">
      <div className="pointer-events-auto flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/[0.05] px-3 py-2 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        {items.map(({ id, label, icon: Icon, primary }) => {
          const state = windows?.[id];
          const isOpen = Boolean(state?.isOpen && !state?.minimized);

          return (
            <div key={label} className="relative group">
              {primary ? (
              <SpecularButton
                size="sm"
                radius={18}
                tint="#dbeafe"
                tintOpacity={0.1}
                lineColor="#7dd3fc"
                baseColor="#0f172a"
                intensity={1.2}
                shineSize={11}
                shineFade={36}
                thickness={1.2}
                followMouse
                proximity={220}
                autoAnimate={false}
                className="h-12 px-5"
                onClick={() => onSelect?.(id)}
              >
                {label}
              </SpecularButton>
            ) : (
              <button
                type="button"
                aria-label={label}
                onClick={() => onSelect?.(id)}
                className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-200 hover:bg-white/[0.08]"
              >
                <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/60 px-2 py-1 text-[10px] text-white/70 opacity-0 transition-opacity group-hover:opacity-100">
                  {label}
                </span>
                <Icon className="h-5 w-5 text-white/80" />
              </button>
            )}

            {isOpen && (
              <span className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-cyan-300" />
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}
