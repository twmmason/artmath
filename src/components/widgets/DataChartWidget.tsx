import { num, str, type WidgetProps } from "./types";

/** Telemetry charts: bar, pie, scatter, percent bar. */
export function DataChartWidget({ task }: WidgetProps) {
  const mode = str(task, "mode", "bar");
  if (mode === "bar") {
    const values = str(task, "values", "").split(",").map(Number).filter((n) => !Number.isNaN(n));
    const highlight = num(task, "highlight", -1);
    const max = Math.max(...values, 1);
    return (
      <div className="flex items-end justify-center gap-2 py-3 h-36">
        {values.map((v, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className={`w-8 rounded-t ${v === highlight ? "bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse" : "bg-cyan-500/60"}`}
              style={{ height: `${(v / max) * 100}px` }}
            />
            <span className="text-[10px] text-cyan-300">{v}</span>
          </div>
        ))}
      </div>
    );
  }
  if (mode === "pie") {
    const slices = [
      { k: "engines", v: num(task, "engines", 40), c: "#22d3ee" },
      { k: "fuel", v: num(task, "fuel", 35), c: "#fbbf24" },
      { k: "payload", v: num(task, "payload", 15), c: "#a78bfa" },
      { k: "avionics", v: num(task, "avionics", 10), c: "#34d399" },
    ];
    let acc = 0;
    return (
      <div className="flex items-center justify-center gap-4 py-3">
        <svg viewBox="-1.1 -1.1 2.2 2.2" className="h-32 w-32 -rotate-90">
          {slices.map((s) => {
            const start = acc;
            acc += s.v / 100;
            const x1 = Math.cos(start * Math.PI * 2);
            const y1 = Math.sin(start * Math.PI * 2);
            const x2 = Math.cos(acc * Math.PI * 2);
            const y2 = Math.sin(acc * Math.PI * 2);
            const large = s.v > 50 ? 1 : 0;
            return (
              <path key={s.k} d={`M0,0 L${x1},${y1} A1,1 0 ${large} 1 ${x2},${y2} Z`} fill={s.c} opacity={str(task, "highlight") === s.k ? 1 : 0.55} />
            );
          })}
        </svg>
        <div className="space-y-1 text-xs">
          {slices.map((s) => (
            <div key={s.k} className="flex items-center gap-2 text-cyan-200">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.c }} />
              {s.k} {s.v}%
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (mode === "percentBar") {
    const pct = num(task, "pct", 20);
    return (
      <div className="py-3">
        <div className="flex h-8 overflow-hidden rounded max-w-sm mx-auto border border-cyan-700/40">
          <div className="bg-cyan-500/60 flex items-center justify-center text-[10px] font-bold text-black" style={{ width: `${100 - pct}%` }}>kept</div>
          <div className="bg-amber-500/60 flex items-center justify-center text-[10px] font-bold text-black" style={{ width: `${pct}%` }}>{pct}% saved</div>
        </div>
      </div>
    );
  }
  // scatter
  const trend = str(task, "trend", "positive");
  const points = Array.from({ length: 10 }, (_, i) => ({
    x: 15 + i * 22 + (i % 3) * 4,
    y: trend === "positive" ? 130 - i * 11 - (i % 4) * 5 : 30 + i * 10,
  }));
  return (
    <div className="py-3">
      <svg viewBox="0 0 240 150" className="mx-auto w-64 rounded border border-cyan-700/40 bg-space-900/70">
        {points.map((p, i) => (
          <text key={i} x={p.x} y={p.y} fontSize="11">🚀</text>
        ))}
      </svg>
      <div className="mt-1 text-center text-[10px] text-cyan-500/70">SCATTER BOARD — fin area vs stability</div>
    </div>
  );
}
