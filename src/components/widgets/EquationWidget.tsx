import { str, type WidgetProps } from "./types";

/** Console readout showing the formula/equation under study (KS3 notation). */
export function EquationWidget({ task }: WidgetProps) {
  const formula = task.notation ?? str(task, "formula", "");
  return (
    <div className="py-3 text-center">
      <div className="inline-block rounded-lg border border-emerald-500/40 bg-black/60 px-6 py-3 font-mono text-2xl text-emerald-300 shadow-[0_0_16px_rgba(52,211,153,0.25)]">
        {formula}
      </div>
      <div className="mt-2 text-xs text-emerald-500/70">FLIGHT COMPUTER — program listing</div>
    </div>
  );
}
