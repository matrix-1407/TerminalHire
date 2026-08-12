import { useMemo, useState } from "react";
import { FileText, Globe, Code2, UserRound, TerminalSquare } from "lucide-react";

import DesktopShell from "./components/desktop/DesktopShell";
import TerminalWindow from "./components/terminal/TerminalWindow";
import ExternalWindow from "./components/windows/ExternalWindow";

const desktopItems = [
  {
    id: "resume",
    label: "Resume",
    icon: FileText,
    href: "https://drive.google.com/file/d/1klRUfr8mcAEAr4ZkwcXFO_30c1zcKEKP/view?pli=1",
  },
  {
    id: "portfolio",
    label: "Portfolio",
    icon: Globe,
    href: "https://mrudul.dev",
  },
  {
    id: "github",
    label: "GitHub",
    icon: Code2,
    href: "https://github.com/matrix-1407",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: UserRound,
    href: "https://www.linkedin.com/in/mrudul-bokade-140705mb",
  },
];

const dockItems = [
  { id: "resume", label: "Resume", icon: FileText },
  { id: "portfolio", label: "Portfolio", icon: Globe },
  { id: "github", label: "GitHub", icon: Code2 },
  { id: "linkedin", label: "LinkedIn", icon: UserRound },
  { id: "terminal", label: "TerminalHire", icon: TerminalSquare, primary: true },
];

const defaultWindows = {
  terminal: {
    id: "terminal",
    title: "terminalhire :: recruiter-mode",
    kind: "terminal",
    href: "",
    isOpen: true,
    minimized: false,
    z: 40,
    position: { x: 320, y: 88 },
  },
  resume: {
    id: "resume",
    title: "Resume",
    kind: "external",
    href: "https://drive.google.com/file/d/1klRUfr8mcAEAr4ZkwcXFO_30c1zcKEKP/view?pli=1",
    isOpen: false,
    minimized: true,
    z: 20,
    position: { x: 140, y: 110 },
  },
  portfolio: {
    id: "portfolio",
    title: "Portfolio",
    kind: "external",
    href: "https://mrudul.dev",
    isOpen: false,
    minimized: true,
    z: 21,
    position: { x: 180, y: 130 },
  },
  github: {
    id: "github",
    title: "GitHub",
    kind: "external",
    href: "https://github.com/matrix-1407",
    isOpen: false,
    minimized: true,
    z: 22,
    position: { x: 220, y: 150 },
  },
  linkedin: {
    id: "linkedin",
    title: "LinkedIn",
    kind: "external",
    href: "https://www.linkedin.com/in/mrudul-bokade-140705mb",
    isOpen: false,
    minimized: true,
    z: 23,
    position: { x: 260, y: 170 },
  },
};

const maxZ = (windows) => Math.max(...Object.values(windows).map((w) => w.z));

export default function App() {
  const [windows, setWindows] = useState(defaultWindows);

  const focusWindow = (id) => {
    setWindows((prev) => {
      const win = prev[id];
      if (!win) return prev;
      const nextZ = maxZ(prev) + 1;
      return {
        ...prev,
        [id]: {
          ...win,
          z: nextZ,
        },
      };
    });
  };

  const openOrRestoreWindow = (id) => {
    setWindows((prev) => {
      const win = prev[id];
      if (!win) return prev;

      const nextZ = maxZ(prev) + 1;
      return {
        ...prev,
        [id]: {
          ...win,
          isOpen: true,
          minimized: false,
          z: nextZ,
        },
      };
    });
  };

  const toggleMinimizeFromDock = (id) => {
    setWindows((prev) => {
      const win = prev[id];
      if (!win) return prev;

      if (!win.isOpen || win.minimized) {
        const nextZ = maxZ(prev) + 1;
        return {
          ...prev,
          [id]: {
            ...win,
            isOpen: true,
            minimized: false,
            z: nextZ,
          },
        };
      }

      return {
        ...prev,
        [id]: {
          ...win,
          minimized: true,
        },
      };
    });
  };

  const minimizeWindow = (id) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        minimized: true,
      },
    }));
  };

  const closeWindow = (id) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: false,
        minimized: true,
      },
    }));
  };

  const windowList = useMemo(
    () => Object.values(windows).filter((w) => w.isOpen && !w.minimized).sort((a, b) => a.z - b.z),
    [windows]
  );

  const menuItems = [
    { label: "TerminalHire", windowId: "terminal" },
    { label: "Projects", windowId: "portfolio" },
    { label: "Resume", windowId: "resume" },
    { label: "Contact", windowId: "linkedin" },
  ];

  return (
    <DesktopShell
      desktopItems={desktopItems}
      dockItems={dockItems}
      menuItems={menuItems}
      windows={windows}
      onOpenWindow={openOrRestoreWindow}
      onDockAction={toggleMinimizeFromDock}
      onMenuAction={openOrRestoreWindow}
    >
      {windowList.map((win) => {
        if (win.kind === "terminal") {
          return (
            <TerminalWindow
              key={win.id}
              title={win.title}
              zIndex={win.z}
              defaultPosition={win.position}
              onFocus={() => focusWindow(win.id)}
              onMinimize={() => minimizeWindow(win.id)}
              onClose={() => closeWindow(win.id)}
            />
          );
        }

        return (
          <ExternalWindow
            key={win.id}
            title={win.title}
            href={win.href}
            zIndex={win.z}
            defaultPosition={win.position}
            onFocus={() => focusWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onClose={() => closeWindow(win.id)}
          />
        );
      })}
    </DesktopShell>
  );
}