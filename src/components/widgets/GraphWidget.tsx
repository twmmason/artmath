import { num, str, type WidgetProps } from "./types";

/** Trajectory-screen graph: lines, parabolas, drains, intersections. */
export function GraphWidget({ task }: WidgetProps) {
  const mode = str(task, "mode", "line");
  const W = 260;
  const H = 160;
  const pts: string[] = [];
  const pts2: string[] = [];
  if (mode === "quadratic") {
    const a = num(task, "a", -5);
    const b = num(task, "b", 100);
    for (let t = 0; t <= 20; t += 0.5) {
      const h = a * t * t + b * t;
      pts.push(`${(t / 20) * W},${H - Math.max(0, (h / 550) * H)}`);
    }
  } else if (mode === "geometric") {
    const start = num(task, "start", 640);
    const ratio = num(task, "ratio", 0.5);
    for (let i = 0; i <= 6; i++) {
      pts.push(`${(i / 6) * W},${H - (start * Math.pow(ratio, i) / start) * (H - 10)}`);
    }
  } else if (mode === "drain") {
    const start = num(task, "start", 100);
    const rate = num(task, "rate", 10);
    for (let h = 0; h <= 10; h++) {
      pts.push(`${(h / 10) * W},${H - (Math.max(0, start - rate * h) / 100) * (H - 10)}`);
    }
  } else if (mode === "intersection") {
    const m1 = num(task, "m1", 40);
    const c2 = num(task, "c2", 200);
    for (let t = 0; t <= 10; t++) {
      pts.push(`${(t / 10) * W},${H - Math.min(H - 5, (m1 * t / 500) * H)}`);
      pts2.push(`${(t / 10) * W},${H - Math.min(H - 5, (c2 / 500) * H)}`);
    }
  } else {
    const m = num(task, "m", num(task, "m1", 40));
    const c = num(task, "c", 0);
    for (let t = 0; t <= 10; t++) {
      pts.push(`${(t / 10) * W},${H - Math.min(H - 5, ((m * t + c) / 800) * H)}`);
    }
    if (num(task, "m2", 0)) {
      const m2 = num(task, "m2", 0);
      for (let t = 0; t <= 10; t++) {
        pts2.push(`${(t / 10) * W},${H - Math.min(H - 5, ((m2 * t + c) / 800) * H)}`);
      }
    }
  }
  return (
    <div className="py-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full max-w-sm rounded border border-cyan-700/40 bg-space-900/70">
        <line x1="0" y1={H - 1} x2={W} y2={H - 1} stroke="#164e63" />
        <line x1="1" y1="0" x2="1" y2={H} stroke="#164e63" />
        {Array.from({ length: 5 }, (_, i) => (
          <line key={i} x1="0" y1={(i / 5) * H} x2={W} y2={(i / 5) * H} stroke="#0e2b3d" strokeDasharray="3 4" />
        ))}
        <polyline points={pts.join(" ")} fill="none" stroke="#22d3ee" strokeWidth="2" />
        {pts2.length > 0 && (
          <polyline points={pts2.join(" ")} fill="none" stroke="#fbbf24" strokeWidth="2" />
        )}
      </svg>
      <div className="mt-1 text-center text-[10px] text-cyan-500/70">TRAJECTORY SCREEN</div>
    </div>
  );
}
