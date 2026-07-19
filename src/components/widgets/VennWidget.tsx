import { num, str, type WidgetProps } from "./types";

/** Venn board / sample-space grid for probability tasks. */
export function VennWidget({ task }: WidgetProps) {
  const mode = str(task, "mode", "venn");
  if (mode === "sampleSpace") {
    const combos = ["ON · ON", "ON · OFF", "OFF · ON", "OFF · OFF"];
    return (
      <div className="grid grid-cols-2 gap-2 py-3 max-w-xs mx-auto">
        {combos.map((c) => (
          <div key={c} className="rounded border border-cyan-600/40 bg-space-900/60 p-2 text-center text-xs text-cyan-200">
            {c}
          </div>
        ))}
      </div>
    );
  }
  const setA = num(task, "setA", 0);
  const setB = num(task, "setB", 0);
  const both = num(task, "both", 0);
  return (
    <div className="py-3 text-center">
      <svg viewBox="0 0 240 130" className="mx-auto w-64">
        <circle cx="90" cy="65" r="52" fill="rgba(34,211,238,0.12)" stroke="#22d3ee" strokeWidth="1.5" />
        <circle cx="150" cy="65" r="52" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="60" y="68" textAnchor="middle" fill="#e8ecff" fontSize="13">{setA - both}</text>
        <text x="120" y="68" textAnchor="middle" fill="#e8ecff" fontSize="13">{both}</text>
        <text x="180" y="68" textAnchor="middle" fill="#e8ecff" fontSize="13">{setB - both}</text>
        <text x="120" y="122" textAnchor="middle" fill="#94a3b8" fontSize="10">outside both: ?</text>
        <text x="60" y="14" textAnchor="middle" fill="#22d3ee" fontSize="9">pressure ✓</text>
        <text x="182" y="14" textAnchor="middle" fill="#fbbf24" fontSize="9">cold-soak ✓</text>
      </svg>
    </div>
  );
}
