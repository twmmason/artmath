import { num, str, type WidgetProps } from "./types";

/** Blueprint scale drawing / cylinder / circle sketch. */
export function ScaleDiagramWidget({ task }: WidgetProps) {
  const mode = str(task, "mode", "blueprint");
  if (mode === "cylinder") {
    const r = num(task, "r", 1.5);
    const h = num(task, "h", 8);
    return (
      <div className="py-3 text-center">
        <svg viewBox="0 0 200 140" className="mx-auto w-56">
          <ellipse cx="100" cy="25" rx="45" ry="12" fill="none" stroke="#22d3ee" strokeWidth="2" />
          <line x1="55" y1="25" x2="55" y2="115" stroke="#22d3ee" strokeWidth="2" />
          <line x1="145" y1="25" x2="145" y2="115" stroke="#22d3ee" strokeWidth="2" />
          <ellipse cx="100" cy="115" rx="45" ry="12" fill="none" stroke="#22d3ee" strokeWidth="2" />
          <text x="100" y="15" textAnchor="middle" fill="#fbbf24" fontSize="11">radius {r} m</text>
          <text x="165" y="72" fill="#fbbf24" fontSize="11">height {h} m</text>
        </svg>
      </div>
    );
  }
  if (mode === "circle") {
    const r = num(task, "r", 2);
    return (
      <div className="py-3 text-center">
        <svg viewBox="0 0 160 130" className="mx-auto w-48">
          <circle cx="80" cy="65" r="50" fill="none" stroke="#22d3ee" strokeWidth="2" />
          <line x1="80" y1="65" x2="130" y2="65" stroke="#fbbf24" strokeWidth="2" />
          <text x="100" y="58" fill="#fbbf24" fontSize="11">r {r} m</text>
        </svg>
      </div>
    );
  }
  const scale = num(task, "scale", 100);
  const paperCm = num(task, "paperCm", 4);
  return (
    <div className="py-3 text-center text-sm text-cyan-300">
      <div className="mx-auto flex w-64 items-end justify-around rounded border border-cyan-700/40 bg-space-900/60 p-3">
        <div>
          <div className="mx-auto h-16 w-4 rounded bg-cyan-600/50" />
          <div className="mt-1 text-[10px]">paper: {paperCm} cm</div>
        </div>
        <div className="text-2xl text-amber-300">→</div>
        <div>
          <div className="mx-auto h-28 w-7 rounded bg-cyan-400/60" />
          <div className="mt-1 text-[10px]">real: scale 1:{scale}</div>
        </div>
      </div>
    </div>
  );
}
