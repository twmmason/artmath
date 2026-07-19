import type { RocketDesign } from "../three/rocketDesign";
import { computePerformance } from "../physics/computePerformance";

function Bar({ v, max }: { v: number; max: number }) {
  return (
    <div className="h-1.5 w-20 rounded bg-space-900">
      <div
        className="h-1.5 rounded bg-cyan-400"
        style={{ width: `${Math.min(100, (v / max) * 100)}%` }}
      />
    </div>
  );
}

/** Live rocket physics readout — recomputed from RocketDesign in real time. */
export function PerformanceDashboard({ design }: { design: RocketDesign }) {
  const p = computePerformance(design);
  const rows: [string, string, number, number][] = [
    ["Total mass", `${Math.round(p.totalMass).toLocaleString("en-GB")} kg`, p.totalMass, 6000],
    ["Total thrust", `${Math.round(p.totalThrust).toLocaleString("en-GB")} kN`, p.totalThrust, 2500],
    ["TWR", p.twr.toFixed(2), p.twr, 5],
    ["Δv", `${Math.round(p.deltaV).toLocaleString("en-GB")} m/s`, p.deltaV, 5000],
    ["Drag coeff", p.dragCoeff.toFixed(2), p.dragCoeff, 0.5],
    ["Stability", p.stability.toFixed(2), p.stability, 2],
    ["Max altitude", `~${Math.round(p.maxAltitude)} km`, p.maxAltitude, 1000],
    ["Fuel duration", `${Math.round(p.burnTime)} s`, p.burnTime, 200],
  ];
  return (
    <div className="hud-panel p-3 text-xs">
      <div className="mb-2 font-bold tracking-widest text-cyan-300">🚀 ROCKET PERFORMANCE</div>
      <div className="space-y-1.5">
        {rows.map(([label, text, v, max]) => (
          <div key={label} className="flex items-center justify-between gap-2">
            <span className="w-24 text-slate-400">{label}</span>
            <span className="flex-1 text-right font-mono text-cyan-100">{text}</span>
            <Bar v={v} max={max} />
          </div>
        ))}
      </div>
      <div
        className={`mt-2 rounded px-2 py-1 text-center font-bold ${
          p.flightReady
            ? "bg-emerald-500/20 text-emerald-300"
            : "bg-amber-500/20 text-amber-300"
        }`}
      >
        {p.flightReady ? "Status: FLIGHT-READY ✅" : "Status: NEEDS WORK 🛠"}
      </div>
      {p.warnings.map((w) => (
        <div key={w} className="mt-1 text-amber-400/90">⚠️ {w}</div>
      ))}
    </div>
  );
}
