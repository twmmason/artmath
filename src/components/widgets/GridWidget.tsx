import { num, str, type WidgetProps } from "./types";

/** Clickable coordinate grid (first quadrant or all four). */
export function GridWidget({ task, value, onChange }: WidgetProps) {
  const mode = str(task, "mode", "plot");
  const size = num(task, "size", 10);
  const four = mode === "plot4";
  const cells = four ? size : size;
  const half = four ? Math.floor(size / 2) : 0;
  const clickable = mode === "plot" || mode === "plot4" || mode === "translate" || mode === "enlarge";
  const sel = value.match(/\((-?\d+),\s*(-?\d+)\)/);
  const selX = sel ? Number(sel[1]) : null;
  const selY = sel ? Number(sel[2]) : null;
  const cellPx = 22;
  return (
    <div className="py-2 overflow-auto">
      <div className="mx-auto w-fit rounded border border-cyan-700/40 bg-space-900/60 p-2">
        <div
          className="grid"
          style={{ gridTemplateColumns: `repeat(${cells + 1}, ${cellPx}px)` }}
        >
          {Array.from({ length: (cells + 1) * (cells + 1) }, (_, i) => {
            const col = i % (cells + 1);
            const row = Math.floor(i / (cells + 1));
            const gx = four ? col - half : col;
            const gy = four ? half - row : cells - row;
            const isSel = selX === gx && selY === gy;
            const isAxis = four ? gx === 0 || gy === 0 : gx === 0 || gy === 0;
            return (
              <button
                key={i}
                disabled={!clickable}
                aria-label={`grid point ${gx}, ${gy}`}
                onClick={() => onChange(`(${gx}, ${gy})`)}
                className={`h-[22px] w-[22px] border border-cyan-900/30 text-[8px] ${
                  isSel
                    ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]"
                    : isAxis
                      ? "bg-cyan-900/40"
                      : "bg-transparent hover:bg-cyan-700/30"
                }`}
              />
            );
          })}
        </div>
        <div className="mt-1 text-center text-[10px] text-cyan-500/70">
          {value || "click a grid point"}
        </div>
      </div>
    </div>
  );
}
