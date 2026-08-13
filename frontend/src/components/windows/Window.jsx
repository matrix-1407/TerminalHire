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

  useLayoutEffect(() => {
    setPosition(resolvePosition(defaultPosition));
  }, [defaultPosition]);

  useEffect(() => {
    if (!defaultPosition?.center) return undefined;

    const handleResize = () => {
      setPosition(resolvePosition(defaultPosition));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [defaultPosition]);

  useEffect(() => {
    const move = (event) => {
      if (!dragRef.current.active || maximized) return;
      setPosition({
        x: Math.max(8, event.clientX - dragRef.current.offsetX),
        y: Math.max(56, event.clientY - dragRef.current.offsetY),
      });
    };

    const up = () => {
      dragRef.current.active = false;
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
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
      className={`pointer-events-auto absolute rounded-[28px] border border-white/10 bg-white/[0.06] backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] overflow-hidden flex flex-col ${
        maximized ? "inset-3 md:inset-5" : "w-[min(1120px,calc(100vw-2rem))] h-[min(80vh,800px)]"
      } ${className}`.trim()}
      style={
        maximized
          ? { zIndex }
          : {
              zIndex,
              left: `${position.x}px`,
              top: `${position.y}px`,
            }
      }
      onPointerDown={() => onFocus?.()}
    >
      <div
        className="h-14 border-b border-white/10 flex items-center justify-between px-5 bg-black/20 cursor-grab active:cursor-grabbing"
        onPointerDown={startDrag}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Close window"
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-red-400 hover:brightness-110"
          />
          <button
            type="button"
            aria-label="Minimize window"
            onClick={onMinimize}
            className="w-3 h-3 rounded-full bg-yellow-400 hover:brightness-110"
          />
          <button
            type="button"
            aria-label="Maximize window"
            onClick={() => setMaximized((prev) => !prev)}
            className="w-3 h-3 rounded-full bg-green-400 hover:brightness-110"
          />
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
