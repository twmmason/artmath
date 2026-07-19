import { num, str, type WidgetProps } from "./types";

/** Measurement / place-value visual: panels, rings, crates or a value readout. */
export function RulerWidget({ task }: WidgetProps) {
  const mode = str(task, "mode", "placeValue");
  const count = num(task, "count", num(task, "rings", num(task, "crates", 0)));
  const value = num(task, "value", 0);
  if (mode === "countPanels" || mode === "rings" || mode === "crates") {
    return (
      <div className="flex flex-wrap gap-1.5 justify-center py-2">
        {Array.from({ length: Math.min(count, 40) }, (_, i) => (
          <div key={i} className="h-6 w-6 rounded-sm bg-cyan-500/40 border border-cyan-300/60 shadow-[0_0_6px_rgba(34,211,238,0.4)]" />
        ))}
      </div>
    );
  }
  return (
    <div className="text-center py-3">
      <div className="inline-block rounded-lg border border-cyan-500/40 bg-space-900/70 px-6 py-3 font-mono text-3xl tracking-[0.3em] text-cyan-200">
        {value ? value.toLocaleString("en-GB") : "—"}
      </div>
      <div className="mt-2 text-xs text-cyan-500/70">LASER GAUGE READOUT</div>
    </div>
  );
}
