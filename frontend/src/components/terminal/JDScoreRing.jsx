const scoreColor = (score) => {
  if (score >= 80) return "#34d399";
  if (score >= 60) return "#22d3ee";
  if (score >= 40) return "#facc15";
  return "#f87171";
};

export default function JDScoreRing({ score = 0 }) {
  const value = Math.max(0, Math.min(100, Number(score) || 0));
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const color = scoreColor(value);

  return (
    <div className="relative h-28 w-28 shrink-0" aria-label={`Match score ${value} out of 100`}>
      <svg className="h-full w-full -rotate-90" viewBox="0 0 112 112" role="img">
        <circle
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="10"
        />
        <circle
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value / 100)}
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold text-white">{value}</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/45">match</span>
      </div>
    </div>
  );
}
