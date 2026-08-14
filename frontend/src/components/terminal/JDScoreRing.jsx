const scoreColor = (score) => {
  if (score >= 80) return "#34d399";
  if (score >= 60) return "#38bdf8";
  if (score >= 40) return "#facc15";
  return "#f87171";
};

export default function JDScoreRing({ score = 0 }) {
  const value = Math.max(0, Math.min(100, Number(score) || 0));
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const color = scoreColor(value);

  return (
    <div className="relative h-24 w-24 shrink-0 font-mono select-none" aria-label={`Match score ${value} out of 100`}>
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100" role="img">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value / 100)}
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white tracking-tight">{value}%</span>
        <span className="text-[9px] uppercase tracking-widest text-white/50 font-semibold">match</span>
      </div>
    </div>
  );
}

