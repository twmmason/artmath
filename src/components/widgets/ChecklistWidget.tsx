import { str, type WidgetProps } from "./types";

const ICONS: Record<string, string> = {
  guidance: "🧠",
  lifeSupport: "🫁",
  comms: "📡",
  power: "🔋",
  navigation: "🛰️",
};

/** Rapid-fire pre-flight system check panel item. */
export function ChecklistWidget({ task }: WidgetProps) {
  const system = str(task, "system", "guidance");
  return (
    <div className="flex items-center justify-center gap-3 py-3">
      <span className="text-4xl">{ICONS[system] ?? "✅"}</span>
      <span className="font-mono text-sm uppercase tracking-widest text-cyan-300">
        {system.replace(/([A-Z])/g, " $1")} check
      </span>
    </div>
  );
}
