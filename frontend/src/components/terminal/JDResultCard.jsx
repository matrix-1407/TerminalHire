import {
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Lightbulb,
  MinusCircle,
  Sparkles,
} from "lucide-react";

import JDScoreRing from "./JDScoreRing";

const fitStyles = {
  strong: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  moderate: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
  weak: "border-red-400/30 bg-red-400/10 text-red-300",
};

const relevanceStyles = {
  high: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  medium: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
  low: "border-yellow-400/30 bg-yellow-400/10 text-yellow-300",
};

const SkillChip = ({ children, tone }) => (
  <span
    className={
      tone === "matched"
        ? "rounded font-mono border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-0.5 text-xs text-emerald-200"
        : "rounded font-mono border border-yellow-400/20 bg-yellow-400/10 px-2.5 py-0.5 text-xs text-yellow-200"
    }
  >
    {children}
  </span>
);

const ActionButton = ({ label, onClick, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-lg border px-3 py-1.5 font-mono text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${className}`}
  >
    {label}
  </button>
);

export default function JDResultCard({ analysis, onAction }) {
  if (!analysis) return null;

  const fit = analysis.fit || "weak";

  return (
    <div className="rounded-xl border border-white/10 bg-[#06080e]/90 p-4 sm:p-5 font-mono text-xs shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.08] pb-4">
        <div className="min-w-0 space-y-2">
          <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-cyan-300">
            <FileText size={13} />
            <span>JD SUITABILITY ANALYSIS</span>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white tracking-tight font-sans">
              {analysis.job_title}
            </h2>
            <p className="mt-0.5 truncate text-xs text-white/50 font-mono">
              File: {analysis.file_name}
            </p>
          </div>

          <span
            className={`inline-flex rounded border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${fitStyles[fit]}`}
          >
            {fit} fit
          </span>
        </div>

        <JDScoreRing score={analysis.score} />
      </div>

      {/* Matched / Missing skills */}
      <div className="grid gap-3 lg:grid-cols-2">
        <section className="rounded-lg border border-white/[0.08] bg-black/40 p-3 space-y-2">
          <h3 className="flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-300">
            <CheckCircle2 size={14} />
            MATCHED SKILLS
          </h3>

          <div className="flex flex-wrap gap-1.5">
            {analysis.matched_skills?.length ? (
              analysis.matched_skills.map((skill) => (
                <SkillChip key={skill} tone="matched">
                  {skill}
                </SkillChip>
              ))
            ) : (
              <span className="text-xs text-white/40">
                No matched skills detected.
              </span>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-white/[0.08] bg-black/40 p-3 space-y-2">
          <h3 className="flex items-center gap-1.5 font-mono text-xs font-semibold text-yellow-300">
            <MinusCircle size={14} />
            MISSING SKILLS
          </h3>

          <div className="flex flex-wrap gap-1.5">
            {analysis.missing_skills?.length ? (
              analysis.missing_skills.map((skill) => (
                <SkillChip key={skill} tone="missing">
                  {skill}
                </SkillChip>
              ))
            ) : (
              <span className="text-xs text-white/40">
                No missing skills detected.
              </span>
            )}
          </div>
        </section>
      </div>

      {/* Relevant Projects */}
      <section className="rounded-lg border border-white/[0.08] bg-black/40 p-3 space-y-2">
        <h3 className="flex items-center gap-1.5 font-mono text-xs font-semibold text-cyan-300">
          <BriefcaseBusiness size={14} />
          RELEVANT PROJECTS
        </h3>

        <div className="grid gap-2.5 md:grid-cols-3">
          {analysis.relevant_projects?.map((project) => (
            <article
              key={project.name}
              className="rounded-md border border-white/5 bg-white/[0.02] p-2.5 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-bold text-white font-sans text-xs">{project.name}</h4>
                  <span
                    className={`shrink-0 rounded border px-1.5 py-0.5 text-[9px] uppercase font-mono font-semibold ${relevanceStyles[project.relevance]}`}
                  >
                    {project.relevance}
                  </span>
                </div>
                <p className="text-[11px] leading-snug text-white/70 font-sans">
                  {project.reason}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Summary & Recommendation */}
      <section className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-white/[0.08] bg-black/40 p-3 space-y-1">
          <h3 className="font-mono text-xs font-semibold text-white/90">
            RECRUITER SUMMARY
          </h3>
          <p className="text-xs leading-relaxed text-white/75 font-sans">
            {analysis.summary}
          </p>
        </div>

        <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/[0.05] p-3 space-y-1">
          <h3 className="flex items-center gap-1.5 font-mono text-xs font-semibold text-cyan-300">
            <Lightbulb size={14} />
            RECOMMENDATION
          </h3>
          <p className="text-xs leading-relaxed text-white/80 font-sans">
            {analysis.recommendation}
          </p>
        </div>
      </section>

      {/* AI Follow-up Actions */}
      {onAction && (
        <section className="pt-2 border-t border-white/[0.08] space-y-2">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-white/60">
            <Sparkles size={13} className="text-cyan-300" />
            <span>ASK AI ABOUT THIS JD:</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <ActionButton
              label="Why this score?"
              onClick={() => onAction("why_score", analysis)}
              className="border-cyan-400/30 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20"
            />
            <ActionButton
              label="What should improve?"
              onClick={() => onAction("improve", analysis)}
              className="border-yellow-400/30 bg-yellow-400/10 text-yellow-200 hover:bg-yellow-400/20"
            />
            <ActionButton
              label="Strongest project"
              onClick={() => onAction("strongest_project", analysis)}
              className="border-emerald-400/30 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20"
            />
            <ActionButton
              label="Generate interview questions"
              onClick={() => onAction("interview_questions", analysis)}
              className="border-violet-400/30 bg-violet-400/10 text-violet-200 hover:bg-violet-400/20"
            />
            <ActionButton
              label="Detailed resume vs JD"
              onClick={() => onAction("compare", analysis)}
              className="border-white/15 bg-white/5 text-white/80 hover:bg-white/10"
            />
          </div>
        </section>
      )}
    </div>
  );
}