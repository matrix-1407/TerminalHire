import Window from "./Window";
import { FolderGit2, ExternalLink, Code } from "lucide-react";
import projectsData from "../../../../data/projects.json";

export default function ProjectsWindow({
  title = "Projects",
  zIndex,
  defaultPosition,
  onFocus,
  onMinimize,
  onClose,
}) {
  const { projects } = projectsData;

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
            <FolderGit2 size={18} />
            <h2 className="text-lg font-bold text-white">Flagship Engineering Projects</h2>
          </div>
          <span className="text-xs text-white/50">{projects.length} Projects</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((proj) => (
            <article
              key={proj.name}
              className="flex flex-col justify-between p-4 rounded-xl border border-white/10 bg-black/30 hover:border-cyan-400/30 transition-all duration-200"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-white text-base">{proj.name}</h3>
                    <p className="text-xs text-cyan-300/80 font-medium">{proj.category}</p>
                  </div>
                  {proj.github && (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${proj.name} repository`}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-cyan-200 transition-colors shrink-0"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>

                <p className="text-xs text-white/70 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-1.5">
                {proj.technologies?.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-400/10 border border-cyan-400/20 text-cyan-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </Window>
  );
}
