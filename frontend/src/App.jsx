import { FileText, Globe, Code2, UserRound } from "lucide-react";

import DesktopShell from "./components/desktop/DesktopShell";
import TerminalWindow from "./components/terminal/TerminalWindow";

const desktopItems = [
  {
    label: "Resume",
    icon: FileText,
    href: "https://drive.google.com/file/d/1klRUfr8mcAEAr4ZkwcXFO_30c1zcKEKP/view?pli=1",
  },
  {
    label: "Portfolio",
    icon: Globe,
    href: "https://mrudul.dev",
  },
  {
    label: "GitHub",
    icon: Code2,
    href: "https://github.com/matrix-1407",
  },
  {
    label: "LinkedIn",
    icon: UserRound,
    href: "https://www.linkedin.com/in/mrudul-bokade-140705mb",
  },
];

export default function App() {
  return (
    <DesktopShell desktopItems={desktopItems}>
      <TerminalWindow />
    </DesktopShell>
  );
}