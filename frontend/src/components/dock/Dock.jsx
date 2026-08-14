'use client';

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { Children, cloneElement, useEffect, useMemo, useRef, useState } from 'react';

import './Dock.css';

function DockItem({
  children,
  className = '',
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
  label,
  isOpen,
  isPrimary
}) {
  const ref = useRef(null);
  const isHovered = useMotionValue(0);

  const itemWidthBase = isPrimary ? 115 : baseItemSize;
  const itemWidthMag = isPrimary ? 140 : magnification;

  const mouseDistance = useTransform(mouseX, val => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: itemWidthBase
    };
    return val - rect.x - itemWidthBase / 2;
  });

  const targetWidth = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [itemWidthBase, itemWidthMag, itemWidthBase]
  );
  const targetHeight = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize]
  );

  const width = useSpring(targetWidth, spring);
  const height = useSpring(targetHeight, spring);

  const handleKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <motion.div
      ref={ref}
      style={{
        width,
        height,
        willChange: "width, height"
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`dock-item group ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
      aria-label={label}
      onKeyDown={handleKeyDown}
    >
      {Children.map(children, child =>
        child ? cloneElement(child, { isHovered }) : null
      )}
      {isOpen && <span className="dock-dot" />}
    </motion.div>
  );
}

function DockLabel({ children, className = '', ...rest }) {
  const { isHovered } = rest;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return undefined;
    const unsubscribe = isHovered.on('change', latest => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -8 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.15 }}
          className={`dock-label ${className}`}
          role="tooltip"
          style={{ x: '-50%' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className = '' }) {
  return <div className={`dock-icon ${className}`}>{children}</div>;
}

export default function Dock({
  items = [],
  windows = {},
  onSelect,
  className = '',
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 72,
  distance = 180,
  panelHeight = 64,
  dockHeight = 256,
  baseItemSize = 50
}) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [magnification, dockHeight]
  );
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div style={{ height, scrollbarWidth: 'none' }} className="dock-outer">
      <motion.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={`dock-panel ${className}`}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => {
          const state = windows?.[item.id];
          const isOpen = Boolean(state?.isOpen && !state?.minimized);
          const Icon = item.icon;
          const isPrimary = Boolean(item.primary);

          return (
            <DockItem
              key={item.id || index}
              onClick={() => {
                if (item.onClick) item.onClick();
                onSelect?.(item.id);
              }}
              className={item.className || ''}
              mouseX={mouseX}
              spring={spring}
              distance={distance}
              magnification={magnification}
              baseItemSize={baseItemSize}
              label={item.label}
              isOpen={isOpen}
              isPrimary={isPrimary}
            >
              <div
                className={`w-full h-full rounded-xl flex items-center justify-center transition-all duration-200 border ${
                  isPrimary
                    ? "bg-cyan-950/70 border-cyan-400/40 group-hover:border-cyan-300 group-hover:bg-cyan-900/80 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                    : "bg-white/[0.06] border-white/10 group-hover:bg-white/[0.14] group-hover:border-cyan-400/40 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                }`}
              >
                <DockIcon>
                  {isPrimary ? (
                    <span className="flex items-center justify-center gap-2 px-3 font-mono text-xs font-bold text-cyan-200 whitespace-nowrap">
                      {Icon && <Icon className="w-4.5 h-4.5 text-cyan-300 shrink-0" />}
                      <span>{item.label}</span>
                    </span>
                  ) : (
                    Icon && <Icon className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />
                  )}
                </DockIcon>
              </div>
              <DockLabel>{item.label}</DockLabel>
            </DockItem>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
