import { memo } from "react";
import Window from "./Window";
import { Cpu, Server, Cloud, Shield, Network, Bot } from "lucide-react";
import profileData from "../../../../data/profile.json";

function SkillsWindow({
  title = "Skills",
  zIndex,
  defaultPosition,
  onFocus,
  onMinimize,
  onClose,
}) {
  const { skills } = profileData;

  const categories = [
    {
      name: "Backend",
      icon: Server,
      color: "text-cyan-300",
      items: [
        { name: "Python", level: skills.python?.level || "Strong proficiency" },
        { name: "FastAPI", level: skills.fastapi?.level || "Working knowledge" },
        { name: "Node.js", level: skills.node_js?.level || "Intermediate" },
        { name: "SQL / MySQL", level: skills.sql_mysql?.level || "Strong" },
      ],
    },
    {
      name: "Cloud & DevOps",
      icon: Cloud,
      color: "text-emerald-300",
      items: [
        { name: "AWS", level: skills.aws?.level || "Foundational" },
        { name: "Docker", level: "Containerization & deployment" },
        { name: "Git / GitHub", level: "Version control & workflows" },
      ],
    },
    {
      name: "Networking",
      icon: Network,
      color: "text-blue-300",
      items: [
        { name: "Deep Packet Inspection", level: "PCAP parsing, layer analysis" },
        { name: "Protocol Inspection", level: skills.networking?.level || "TCP/IP, HTTP, TLS SNI, DNS" },
      ],
    },
    {
      name: "Security",
      icon: Shield,
      color: "text-amber-300",
      items: [
        { name: "Traffic Analysis", level: skills.security?.level || "Flow tracking, rule evaluation" },
        { name: "Anomaly Detection", level: "Isolation Forest risk scoring" },
      ],
    },
    {
      name: "AI & RAG Systems",
      icon: Bot,
      color: "text-violet-300",
      items: [
        { name: "LLM Integration", level: skills.llm_rag?.level || "Working knowledge" },
        { name: "RAG & Vector Search", level: "FAISS, sentence transformers" },
      ],
    },
  ];

  return (
    <Window
      title={title}
      zIndex={zIndex}
      defaultPosition={defaultPosition}
      onFocus={onFocus}
      onMinimize={onMinimize}
      onClose={onClose}
    >
      <div className="flex-1 overflow-y-auto p-5 md:p-6 bg-slate-950/60 font-sans space-y-5 text-sm">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2 text-cyan-300 font-semibold">
            <Cpu size={18} />
            <h2 className="text-lg font-bold text-white">Technical Skills & Expertise</h2>
          </div>
          <span className="text-xs text-white/50">Verified Repositories</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                className="p-4 rounded-xl border border-white/10 bg-black/30 space-y-3"
              >
                <div className="flex items-center gap-2 font-semibold text-white">
                  <Icon size={16} className={cat.color} />
                  <span>{cat.name}</span>
                </div>

                <div className="space-y-2">
                  {cat.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] border border-white/5"
                    >
                      <span className="font-mono text-xs font-semibold text-cyan-200">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-white/60">
                        {item.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Window>
  );
}

export default memo(SkillsWindow);
