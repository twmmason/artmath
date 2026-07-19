import { num, str, type WidgetProps } from "./types";

/** Translucent tank + slider; used for fill fractions and quantities. */
export function FuelGaugeWidget({ task, value, onChange }: WidgetProps) {
  const mode = str(task, "mode", "quantity");
  const capacity = num(task, "capacity", 100);
  const level = num(task, "level", 0);
  const interactive = mode === "fraction";
  let fill: number;
  if (interactive) {
    const m = value.match(/^(\d+)\s*\/\s*(\d+)$/);
    fill = m ? Number(m[1]) / Number(m[2]) : Number(value) || 0;
  } else {
    fill = capacity > 0 ? level / capacity : 0;
  }
  fill = Math.max(0, Math.min(1, fill));
  return (
    <div className="flex items-center justify-center gap-6 py-2">
      <div className="relative h-40 w-16 rounded-xl border-2 border-cyan-400/50 bg-space-900/60 overflow-hidden">
        <div
          className="absolute bottom-0 left-0 right-0 bg-cyan-500/60 transition-all duration-300"
          style={{ height: `${fill * 100}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-cyan-100 text-sm font-bold">
          {Math.round(fill * 100)}%
        </div>
      </div>
      {interactive && (
        <input
          type="range" min={0} max={1} step={0.05}
          value={fill}
          aria-label="Fuel fill level"
          onChange={(e) => onChange(String(Number(e.target.value)))}
          className="h-40 accent-cyan-400"
          style={{ writingMode: "vertical-lr", direction: "rtl" }}
        />
      )}
    </div>
  );
}
