import { num, type WidgetProps } from "./types";

/** Two coloured liquids mixed in ratio. */
export function RatioMixerWidget({ task }: WidgetProps) {
  const a = num(task, "ratioA", 1);
  const b = num(task, "ratioB", 1);
  const total = a + b;
  return (
    <div className="py-2">
      <div className="flex h-10 overflow-hidden rounded-lg border border-cyan-500/40">
        <div className="bg-amber-500/70 flex items-center justify-center text-xs font-bold text-black" style={{ width: `${(a / total) * 100}%` }}>
          fuel {a}
        </div>
        <div className="bg-cyan-500/70 flex items-center justify-center text-xs font-bold text-black" style={{ width: `${(b / total) * 100}%` }}>
          oxidiser {b}
        </div>
      </div>
      <div className="mt-1 text-center text-xs text-cyan-400/70">MIXING VAT — ratio view</div>
    </div>
  );
}
