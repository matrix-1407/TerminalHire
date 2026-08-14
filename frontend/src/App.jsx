import { useMemo, useState } from "react";
import {
  FileText,
  Globe,
  Code2,
  CircleUserRound,
  TerminalSquare,
  FolderGit2,
  Cpu,
  BriefcaseBusiness,
  Mail,
} from "lucide-react";

import DesktopShell from "./components/desktop/DesktopShell";
import TerminalWindow from "./components/terminal/TerminalWindow";
import ExternalWindow from "./components/windows/ExternalWindow";
import AboutMeWindow from "./components/windows/AboutMeWindow";
import ProjectsWindow from "./components/windows/ProjectsWindow";
import SkillsWindow from "./components/windows/SkillsWindow";
import ContactWindow from "./components/windows/ContactWindow";

const desktopItems = [
  {
    id: "terminal",
    label: "Ask Me",
    icon: TerminalSquare,
  },
  {
    id: "aboutme",
    label: "About Me",
    icon: CircleUserRound,
  },
  {
    id: "projects",
    label: "Projects",
    icon: FolderGit2,
  },
  {
    id: "skills",
    label: "Skills",
    icon: Cpu,
  },
  {
    id: "resume",
    label: "Resume",
    icon: FileText,
    href: "https://drive.google.com/file/d/1klRUfr8mcAEAr4ZkwcXFO_30c1zcKEKP/view?pli=1",
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
    icon: BriefcaseBusiness,
    href: "https://www.linkedin.com/in/mrudul-bokade-140705mb",
  },
  {
    id: "contact",
    label: "Contact",
    icon: Mail,
  },
];

const dockItems = [
  { id: "aboutme", label: "About Me", icon: CircleUserRound },
  { id: "portfolio", label: "Portfolio", icon: Globe },
  { id: "github", label: "GitHub", icon: Code2 },
  { id: "linkedin", label: "LinkedIn", icon: BriefcaseBusiness },
  { id: "terminal", label: "Ask Me", icon: TerminalSquare, primary: true },
];

const defaultWindows = {
  terminal: {
    id: "terminal",
    title: "ask-me — recruiter session",
    kind: "terminal",
    href: "",
    isOpen: false,
    minimized: false,
    z: 40,
    position: { center: true, y: 36 },
  },
  aboutme: {
    id: "aboutme",
    title: "About Me",
    kind: "aboutme",
    href: "",
    isOpen: false,
    minimized: true,
    z: 40,
    position: { center: true, y: 36 },
  },
  projects: {
    id: "projects",
    title: "Projects",
    kind: "projects",
    href: "",
    isOpen: false,
    minimized: true,
    z: 40,
    position: { center: true, y: 36 },
  },
  skills: {
    id: "skills",
    title: "Skills",
    kind: "skills",
    href: "",
    isOpen: false,
    minimized: true,
    z: 40,
    position: { center: true, y: 36 },
  },
  contact: {
    id: "contact",
    title: "Contact",
    kind: "contact",
    href: "",
    isOpen: false,
    minimized: true,
    z: 40,
    position: { center: true, y: 36 },
  },
  resume: {
    id: "resume",
    title: "Resume",
    kind: "external",
    href: "https://drive.google.com/file/d/1klRUfr8mcAEAr4ZkwcXFO_30c1zcKEKP/view?pli=1",
    isOpen: false,
    minimized: true,
    z: 40,
    position: { center: true, y: 36 },
  },
  portfolio: {
    id: "portfolio",
    title: "Portfolio",
    kind: "external",
    href: "https://mrudul.dev",
    isOpen: false,
    minimized: true,
    z: 40,
    position: { center: true, y: 36 },
  },
  github: {
    id: "github",
    title: "GitHub",
    kind: "external",
    href: "https://github.com/matrix-1407",
    isOpen: false,
    minimized: true,
    z: 40,
    position: { center: true, y: 36 },
  },
  linkedin: {
    id: "linkedin",
    title: "LinkedIn",
    kind: "external",
    href: "https://www.linkedin.com/in/mrudul-bokade-140705mb",
    isOpen: false,
    minimized: true,
    z: 40,
    position: { center: true, y: 36 },
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
    { label: "About Me", windowId: "aboutme" },
    { label: "Skills", windowId: "skills" },
    { label: "Contact", windowId: "contact" },
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

        if (win.kind === "aboutme") {
          return (
            <AboutMeWindow
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

        if (win.kind === "projects") {
          return (
            <ProjectsWindow
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

        if (win.kind === "skills") {
          return (
            <SkillsWindow
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

        if (win.kind === "contact") {
          return (
            <ContactWindow
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

