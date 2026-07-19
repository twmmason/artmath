import { num, type WidgetProps } from "./types";

/** 0–1 probability dial, draggable via slider. */
export function RiskDialWidget({ task, value, onChange }: WidgetProps) {
  const p = Math.max(0, Math.min(1, Number(value) || 0));
  const angle = 180 - p * 180;
  const rad = (angle * Math.PI) / 180;
  void num;
  return (
    <div className="space-y-2 py-2">
      <svg viewBox="0 0 200 115" className="mx-auto w-56">
        <path d="M20,100 A80,80 0 0 1 180,100" fill="none" stroke="#164e63" strokeWidth="10" strokeLinecap="round" />
        <path
          d={`M20,100 A80,80 0 0 1 ${100 + 80 * Math.cos(rad)},${100 - 80 * Math.sin(rad)}`}
          fill="none" stroke="#22d3ee" strokeWidth="10" strokeLinecap="round"
        />
        <line x1="100" y1="100" x2={100 + 62 * Math.cos(rad)} y2={100 - 62 * Math.sin(rad)} stroke="#fbbf24" strokeWidth="3" />
        <text x="20" y="112" fill="#94a3b8" fontSize="10">0</text>
        <text x="174" y="112" fill="#94a3b8" fontSize="10">1</text>
        <text x="100" y="60" textAnchor="middle" fill="#e8ecff" fontSize="16">{p.toFixed(2)}</text>
      </svg>
      <input
        type="range" min={0} max={1} step={0.01}
        value={p}
        aria-label="Probability dial"
        onChange={(e) => onChange(e.target.value)}
        className="w-full max-w-xs mx-auto block accent-cyan-400"
      />
    </div>
  );
}
