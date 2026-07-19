import { num, type WidgetProps } from "./types";

/** Compartments filling with crates / fraction bars beside the bay. */
export function PayloadSplitWidget({ task }: WidgetProps) {
  const compartments = num(task, "compartments", num(task, "groups", 4));
  const loaded = num(task, "loaded", 0);
  const groupSize = num(task, "groupSize", 0);
  return (
    <div className="py-2">
      <div className="flex flex-wrap gap-2 justify-center">
        {Array.from({ length: Math.min(compartments, 12) }, (_, i) => (
          <div
            key={i}
            className={`flex h-14 w-14 items-center justify-center rounded-lg border-2 text-xs font-bold ${
              i < loaded
                ? "border-violet-400 bg-violet-500/40 text-violet-100"
                : "border-violet-700/50 bg-space-900/60 text-violet-500/60"
            }`}
          >
            {groupSize ? groupSize : i < loaded ? "📦" : ""}
          </div>
        ))}
      </div>
      <div className="mt-1 text-center text-xs text-violet-400/70">PAYLOAD BAY COMPARTMENTS</div>
    </div>
  );
}
