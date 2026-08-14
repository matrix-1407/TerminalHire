import { useEffect, useLayoutEffect, useRef, useState } from "react";

const resolvePosition = (position) => {
  if (!position?.center || typeof window === "undefined") {
    return {
      x: position?.x ?? 280,
      y: position?.y ?? 64,
    };
  }

  const windowWidth = Math.min(1120, window.innerWidth - 32);

  return {
    x: Math.max(8, Math.round((window.innerWidth - windowWidth) / 2)),
    y: Math.max(36, position.y ?? 36),
  };
};

export default function Window({
  title,
  headerActions,
  children,
  className = "",
  zIndex = 40,
  defaultPosition = { x: 280, y: 64 },
  onFocus,
  onMinimize,
  onClose,
}) {
  const [position, setPosition] = useState(() => resolvePosition(defaultPosition));
  const [maximized, setMaximized] = useState(false);
  const dragRef = useRef({ active: false, offsetX: 0, offsetY: 0 });
  const rafRef = useRef(0);

  useLayoutEffect(() => {
    setPosition(resolvePosition(defaultPosition));
  }, [defaultPosition]);

  useEffect(() => {
    if (!defaultPosition?.center) return undefined;

    const handleResize = () => {
      setPosition(resolvePosition(defaultPosition));
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [defaultPosition]);

  useEffect(() => {
    const move = (event) => {
      if (!dragRef.current.active || maximized) return;
      
      const newX = Math.max(8, event.clientX - dragRef.current.offsetX);
      const newY = Math.max(36, event.clientY - dragRef.current.offsetY);

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setPosition({ x: newX, y: newY });
      });
    };

    const up = () => {
      dragRef.current.active = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [maximized]);

  const startDrag = (event) => {
    if (maximized) return;

    const target = event.target;
    if (target instanceof Element && target.closest("button, a, input, textarea, select, [contenteditable='true'], [data-no-drag]")) {
      return;
    }

    dragRef.current = {
      active: true,
      offsetX: event.clientX - position.x,
      offsetY: event.clientY - position.y,
    };

    onFocus?.();
  };

  return (
    <div
      className={`pointer-events-auto absolute top-0 left-0 rounded-2xl border border-white/[0.08] bg-[#0a0e17]/98 backdrop-blur-sm shadow-[0_25px_90px_rgba(0,0,0,0.65)] overflow-hidden flex flex-col select-none ${
        maximized ? "inset-3 md:inset-5 !transform-none" : "w-[min(1120px,calc(100vw-2rem))] h-[min(80vh,800px)]"
      } ${className}`.trim()}
      style={
        maximized
          ? { zIndex }
          : {
              zIndex,
              transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
              willChange: "transform",
            }
      }
      onPointerDown={() => onFocus?.()}
    >
      <div
        className="h-10 border-b border-white/[0.08] flex items-center justify-between px-4 bg-black/40 cursor-grab active:cursor-grabbing shrink-0"
        onPointerDown={startDrag}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 group/controls">
            <button
              type="button"
              aria-label="Close window"
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 transition-transform active:scale-95 flex items-center justify-center text-[8px] text-black font-bold opacity-90 hover:opacity-100 cursor-pointer"
            />
            <button
              type="button"
              aria-label="Minimize window"
              onClick={onMinimize}
              className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-110 transition-transform active:scale-95 flex items-center justify-center text-[8px] text-black font-bold opacity-90 hover:opacity-100 cursor-pointer"
            />
            <button
              type="button"
              aria-label="Maximize window"
              onClick={() => setMaximized((prev) => !prev)}
              className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-110 transition-transform active:scale-95 flex items-center justify-center text-[8px] text-black font-bold opacity-90 hover:opacity-100 cursor-pointer"
            />
          </div>
          <span className="font-mono text-xs text-white/70 ml-2 font-medium tracking-tight truncate max-w-[280px] sm:max-w-md">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {headerActions}
        </div>
      </div>

      {children}
    </div>
  );
}
