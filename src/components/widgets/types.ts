import type { GeneratedTask } from "../../engine/types";

export interface WidgetProps {
  task: GeneratedTask;
  value: string;
  onChange: (v: string) => void;
}

export function num(task: GeneratedTask, key: string, fallback = 0): number {
  const v = task.visual.config[key];
  return typeof v === "number" ? v : fallback;
}

export function str(task: GeneratedTask, key: string, fallback = ""): string {
  const v = task.visual.config[key];
  return typeof v === "string" ? v : fallback;
}
