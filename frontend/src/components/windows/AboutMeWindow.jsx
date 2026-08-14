import { memo } from "react";
import Window from "./Window";
import { GraduationCap, MapPin, Target, Sparkles, User, Briefcase } from "lucide-react";
import profileData from "../../../../data/profile.json";
import personalityData from "../../../../data/personality.json";

function AboutMeWindow({
  title = "About Me",
  zIndex,
  defaultPosition,
  onFocus,
  onMinimize,
  onClose,
}) {
  const { identity, education, career } = profileData;
  const { personality } = personalityData;

  return (
    <Window
      title={title}
      zIndex={zIndex}
      defaultPosition={defaultPosition}
      onFocus={onFocus}
      onMinimize={onMinimize}
      onClose={onClose}
    >
      <div className="flex-1 overflow-y-auto p-5 md:p-6 bg-slate-950/60 font-sans space-y-6 text-sm">
        {/* Header Hero */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.05]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold">
              <User size={18} />
              <h2 className="text-xl font-bold text-white">{identity.full_name}</h2>
            </div>
            <p className="text-white/70 text-sm">{identity.professional_title}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/60">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <MapPin size={12} className="text-cyan-300" />
              {identity.current_city}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/20">
              Open to Relocation
            </span>
          </div>
        </div>

        {/* Education & Career */}
        <div className="grid gap-4 md:grid-cols-2">
          <section className="p-4 rounded-xl border border-white/10 bg-black/30 space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-cyan-200">
              <GraduationCap size={16} />
              Education
            </h3>
            <div className="text-white/90 font-medium">{education.degree}</div>
            <div className="text-xs text-white/60">{education.institution}</div>
            <div className="text-xs text-white/50">{education.university} ({education.start_year} – {education.graduation_year})</div>
            <div className="text-xs text-emerald-300 font-semibold pt-1">CGPA: {education.cgpa} / 10</div>
          </section>

          <section className="p-4 rounded-xl border border-white/10 bg-black/30 space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-cyan-200">
              <Target size={16} />
              Career Positioning
            </h3>
            <div className="text-white/90 font-medium">{career.primary_positioning}</div>
            <div className="text-xs text-white/60">{career.secondary_positioning}</div>
            <div className="text-xs text-white/50 pt-1">
              <span className="text-white/70 font-medium">Long-term:</span> {career.long_term_direction}
            </div>
          </section>
        </div>

        {/* Core Strengths */}
        <section className="p-4 rounded-xl border border-white/10 bg-black/30 space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
            <Sparkles size={16} />
            Core Strengths
          </h3>
          <div className="flex flex-wrap gap-2">
            {personality.core_strengths.map((strength) => (
              <span key={strength} className="px-3 py-1 rounded-lg border border-emerald-400/20 bg-emerald-400/10 text-xs font-medium text-emerald-200">
                {strength}
              </span>
            ))}
          </div>
        </section>

        {/* Work Style */}
        <section className="p-4 rounded-xl border border-white/10 bg-black/30 space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-cyan-200">
            <Briefcase size={16} />
            Work Approach
          </h3>
          <ul className="space-y-1.5 text-xs text-white/80">
            {personality.work_style.map((style) => (
              <li key={style} className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>{style}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Window>
  );
}

export default memo(AboutMeWindow);
