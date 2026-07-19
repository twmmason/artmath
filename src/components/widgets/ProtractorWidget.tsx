import { num, str, type WidgetProps } from "./types";

/** Interactive protractor: shows an angle to measure, or lets Artie set one. */
export function ProtractorWidget({ task, value, onChange }: WidgetProps) {
  const mode = str(task, "mode", "measure");
  const shown = num(task, "showAngle", 0);
  const setMode = mode === "set" || mode === "measure";
  const current = Number(value) || (shown || 45);
  const angle = setMode ? current : shown || 60;
  const rad = ((180 - angle) * Math.PI) / 180;
  const x2 = 100 + 80 * Math.cos(rad);
  const y2 = 100 - 80 * Math.sin(rad);
  return (
    <div className="space-y-2">
      <svg viewBox="0 0 200 110" className="w-full max-w-xs mx-auto">
        <path d="M20,100 A80,80 0 0 1 180,100" fill="none" stroke="#22d3ee" strokeWidth="1.5" opacity="0.5" />
        {Array.from({ length: 19 }, (_, i) => {
          const a = ((180 - i * 10) * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={100 + 72 * Math.cos(a)} y1={100 - 72 * Math.sin(a)}
              x2={100 + 80 * Math.cos(a)} y2={100 - 80 * Math.sin(a)}
              stroke="#67e8f9" strokeWidth="1"
            />
          );
        })}
        <line x1="100" y1="100" x2="180" y2="100" stroke="#fbbf24" strokeWidth="2.5" />
        <line x1="100" y1="100" x2={x2} y2={y2} stroke="#fbbf24" strokeWidth="2.5" />
        <text x="100" y="55" textAnchor="middle" fill="#e8ecff" fontSize="14">{Math.round(angle)}°</text>
      </svg>
      {setMode && (
        <input
          type="range" min={0} max={180} step={1}
          value={current}
          aria-label="Protractor angle"
          onChange={(e) => onChange(e.target.value)}
          className="w-full accent-cyan-400"
        />
      )}
    </div>
  );
}
