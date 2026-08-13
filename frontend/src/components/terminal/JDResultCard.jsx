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
  strong: "border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
  moderate: "border-cyan-300/30 bg-cyan-300/10 text-cyan-200",
  weak: "border-red-300/30 bg-red-300/10 text-red-200",
};

const relevanceStyles = {
  high: "border-emerald-300/25 bg-emerald-300/10 text-emerald-200",
  medium: "border-cyan-300/25 bg-cyan-300/10 text-cyan-200",
  low: "border-yellow-300/25 bg-yellow-300/10 text-yellow-200",
};

const SkillChip = ({ children, tone }) => (
  <span
    className={
      tone === "matched"
        ? "rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-200"
        : "rounded-full border border-yellow-300/20 bg-yellow-300/10 px-3 py-1 text-xs text-yellow-100"
    }
  >
    {children}
  </span>
);

const ActionButton = ({ label, onClick, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${className}`}
  >
    {label}
  </button>
);

export default function JDResultCard({ analysis, onAction }) {
  if (!analysis) return null;

  const fit = analysis.fit || "weak";

  return (
    <div className="rounded-3xl border border-cyan-300/15 bg-white/[0.045] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.32)] backdrop-blur-xl">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">
            <FileText size={14} />
            JD Suitability Analysis
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              {analysis.job_title}
            </h2>
            <p className="mt-1 truncate text-sm text-white/50">
              {analysis.file_name}
            </p>
          </div>

          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${fitStyles[fit]}`}
          >
            {fit} fit
          </span>
        </div>

        <JDScoreRing score={analysis.score} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-200">
            <CheckCircle2 size={16} />
            Matched skills
          </h3>

          <div className="flex flex-wrap gap-2">
            {analysis.matched_skills?.length ? (
              analysis.matched_skills.map((skill) => (
                <SkillChip key={skill} tone="matched">
                  {skill}
                </SkillChip>
              ))
            ) : (
              <span className="text-sm text-white/45">
                No vocabulary skills detected as matched.
              </span>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-yellow-100">
            <MinusCircle size={16} />
            Missing skills
          </h3>

          <div className="flex flex-wrap gap-2">
            {analysis.missing_skills?.length ? (
              analysis.missing_skills.map((skill) => (
                <SkillChip key={skill} tone="missing">
                  {skill}
                </SkillChip>
              ))
            ) : (
              <span className="text-sm text-white/45">
                No missing required skills detected.
              </span>
            )}
          </div>
        </section>
      </div>

      <section className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-cyan-100">
          <BriefcaseBusiness size={16} />
          Relevant projects
        </h3>

        <div className="grid gap-3 md:grid-cols-3">
          {analysis.relevant_projects?.map((project) => (
            <article
              key={project.name}
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <h4 className="font-semibold text-white">{project.name}</h4>

                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase ${relevanceStyles[project.relevance]}`}
                >
                  {project.relevance}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-white/65">
                {project.reason}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <h3 className="mb-2 text-sm font-semibold text-white">
            Recruiter summary
          </h3>

          <p className="text-sm leading-6 text-white/72">
            {analysis.summary}
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.06] p-4">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-cyan-100">
            <Lightbulb size={16} />
            Recommendation
          </h3>

          <p className="text-sm leading-6 text-white/75">
            {analysis.recommendation}
          </p>
        </div>
      </section>

      {onAction && (
        <>
          <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <section className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/80">
              <Sparkles size={16} className="text-cyan-300" />
              Ask AI about this JD
            </div>

            <div className="flex flex-wrap gap-2">
              <ActionButton
                label="Why this score?"
                onClick={() => onAction("why_score", analysis)}
                className="border-cyan-400/20 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20"
              />

              <ActionButton
                label="What should improve?"
                onClick={() => onAction("improve", analysis)}
                className="border-yellow-400/20 bg-yellow-400/10 text-yellow-100 hover:bg-yellow-400/20"
              />

              <ActionButton
                label="Strongest project"
                onClick={() => onAction("strongest_project", analysis)}
                className="border-emerald-400/20 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20"
              />

              <ActionButton
                label="Generate interview questions"
                onClick={() => onAction("interview_questions", analysis)}
                className="border-violet-400/20 bg-violet-400/10 text-violet-200 hover:bg-violet-400/20"
              />

              <ActionButton
                label="Detailed resume vs JD"
                onClick={() => onAction("compare", analysis)}
                className="border-white/10 bg-white/[0.06] text-white/80 hover:bg-white/[0.12]"
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
}