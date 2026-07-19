import { num, str, type WidgetProps } from "./types";

/** LED board / bolt ring / power trace visual for the electronics & engine. */
export function CircuitWidget({ task }: WidgetProps) {
  const mode = str(task, "mode", "leds");
  const total = num(task, "total", num(task, "groups", 8));
  const done = num(task, "done", 0);
  const groupSize = num(task, "groupSize", 0);
  const groups = num(task, "groups", 0);
  if (mode === "groups" && groups > 0) {
    return (
      <div className="space-y-1.5 py-2">
        {Array.from({ length: Math.min(groups, 10) }, (_, g) => (
          <div key={g} className="flex justify-center gap-1">
            {Array.from({ length: Math.min(groupSize, 20) }, (_, i) => (
              <div key={i} className="h-3.5 w-3.5 rounded-full bg-emerald-400/70 shadow-[0_0_5px_rgba(52,211,153,0.7)]" />
            ))}
            {groupSize > 20 && <span className="text-xs text-emerald-300">… {groupSize} each</span>}
          </div>
        ))}
        <div className="text-center text-xs text-emerald-400/70">{groups} groups on the bench</div>
      </div>
    );
  }
  return (
    <div className="py-2">
      <div className="flex flex-wrap justify-center gap-1.5">
        {Array.from({ length: Math.min(total, 40) }, (_, i) => (
          <div
            key={i}
            className={`h-4 w-4 rounded-full ${
              i < done
                ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]"
                : "bg-amber-700/50 border border-amber-500/40"
            }`}
          />
        ))}
      </div>
      <div className="mt-1 text-center text-xs text-emerald-400/70">
        {done} of {total} complete — status board
      </div>
    </div>
  );
}
