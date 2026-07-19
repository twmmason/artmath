import { num, str, type WidgetProps } from "./types";

/** Bar model for part-whole, complements and 2-unknowns problems. */
export function BarModelWidget({ task }: WidgetProps) {
  const mode = str(task, "mode", "join");
  const whole = num(task, "whole", 0);
  const partA = num(task, "partA", 0);
  const partB = num(task, "partB", 0);
  const factor = num(task, "factor", 0);
  if (mode === "twoUnknowns" && factor > 0) {
    return (
      <div className="space-y-2 py-2">
        <div className="flex gap-0.5">
          {Array.from({ length: factor + 1 }, (_, i) => (
            <div
              key={i}
              className={`h-9 flex-1 rounded flex items-center justify-center text-xs font-bold ${
                i === 0 ? "bg-cyan-500/60 text-black" : "bg-amber-500/60 text-black"
              }`}
            >
              {i === 0 ? "B" : "A"}
            </div>
          ))}
        </div>
        <div className="text-center text-xs text-cyan-400/70">
          whole bar totals {whole} ohms — B is one block, A is {factor} blocks
        </div>
      </div>
    );
  }
  const total = whole || partA + partB;
  const aW = total > 0 ? (partA / total) * 100 : 50;
  return (
    <div className="space-y-2 py-2">
      <div className="flex h-9 overflow-hidden rounded">
        <div className="bg-cyan-500/60 flex items-center justify-center text-xs font-bold text-black" style={{ width: `${aW}%` }}>
          {partA || "?"}
        </div>
        <div className="bg-amber-500/60 flex items-center justify-center text-xs font-bold text-black" style={{ width: `${100 - aW}%` }}>
          {mode === "complement" || mode === "missing" ? "?" : partB || "?"}
        </div>
      </div>
      <div className="text-center text-xs text-cyan-400/70">whole bar: {total || "?"}</div>
    </div>
  );
}
