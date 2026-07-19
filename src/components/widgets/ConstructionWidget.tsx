import { num, str, type WidgetProps } from "./types";

/** Plotting-table constructions: bisectors, polygons, Pythagoras triangles. */
export function ConstructionWidget({ task }: WidgetProps) {
  const mode = str(task, "mode", "bisect");
  if (mode === "pythagoras") {
    const a = num(task, "a", 3);
    const b = num(task, "b", 4);
    const c = num(task, "c", 5);
    return (
      <div className="py-3 text-center">
        <svg viewBox="0 0 200 140" className="mx-auto w-56">
          <polygon points="30,120 170,120 30,20" fill="rgba(34,211,238,0.1)" stroke="#22d3ee" strokeWidth="2" />
          <rect x="30" y="108" width="12" height="12" fill="none" stroke="#fbbf24" />
          <text x="100" y="135" textAnchor="middle" fill="#e8ecff" fontSize="11">{b}</text>
          <text x="16" y="72" fill="#e8ecff" fontSize="11">{a}</text>
          <text x="112" y="66" fill="#fbbf24" fontSize="11">{c}?</text>
        </svg>
      </div>
    );
  }
  if (mode === "polygon" || mode === "prism") {
    const sides = num(task, "sides", 6);
    const pts = Array.from({ length: sides }, (_, i) => {
      const a = (i / sides) * Math.PI * 2 - Math.PI / 2;
      return `${100 + 55 * Math.cos(a)},${70 + 55 * Math.sin(a)}`;
    }).join(" ");
    return (
      <div className="py-3 text-center">
        <svg viewBox="0 0 200 140" className="mx-auto w-56">
          <polygon points={pts} fill="rgba(34,211,238,0.08)" stroke="#22d3ee" strokeWidth="2" />
        </svg>
      </div>
    );
  }
  const angle = num(task, "angle", 80);
  const r1 = ((180 - angle) * Math.PI) / 180;
  const rh = ((180 - angle / 2) * Math.PI) / 180;
  return (
    <div className="py-3 text-center">
      <svg viewBox="0 0 200 130" className="mx-auto w-56">
        <line x1="30" y1="110" x2="190" y2="110" stroke="#22d3ee" strokeWidth="2" />
        <line x1="30" y1="110" x2={30 + 150 * Math.cos(r1)} y2={110 - 150 * Math.sin(r1)} stroke="#22d3ee" strokeWidth="2" />
        <line x1="30" y1="110" x2={30 + 150 * Math.cos(rh)} y2={110 - 150 * Math.sin(rh)} stroke="#fbbf24" strokeWidth="2" strokeDasharray="5 4" />
        <text x="70" y="100" fill="#e8ecff" fontSize="11">{angle}°</text>
      </svg>
      <div className="text-[10px] text-cyan-500/70">PLOTTING TABLE — compasses set</div>
    </div>
  );
}
