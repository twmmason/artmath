import { num, type WidgetProps } from "./types";

/** Place values on a line — slider synced with the answer. */
export function NumberLineWidget({ task, value, onChange }: WidgetProps) {
  const min = num(task, "min", 0);
  const max = num(task, "max", 100);
  const step = num(task, "step", 1);
  const current = value === "" ? min : Number(value);
  const pct = max > min ? ((current - min) / (max - min)) * 100 : 0;
  return (
    <div className="space-y-1 py-2">
      <div className="relative h-8">
        <div className="absolute top-3 left-0 right-0 h-1 rounded bg-cyan-500/40" />
        <div
          className="absolute top-0 h-7 w-1.5 rounded bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
          style={{ left: `${Math.max(0, Math.min(100, pct))}%` }}
        />
      </div>
      <input
        type="range" min={min} max={max} step={step}
        value={Number.isNaN(current) ? min : current}
        aria-label="Number line marker"
        onChange={(e) => onChange(e.target.value)}
        className="w-full accent-cyan-400"
      />
      <div className="flex justify-between text-xs text-cyan-400/70">
        <span>{min.toLocaleString("en-GB")}</span>
        <span className="text-amber-300 font-semibold">
          {Number.isNaN(current) ? "—" : current.toLocaleString("en-GB")}
        </span>
        <span>{max.toLocaleString("en-GB")}</span>
      </div>
    </div>
  );
}
