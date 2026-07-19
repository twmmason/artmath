import { generateText } from "./gemini";
import { validateOutput } from "./flightDirector";
import { fallbackChiefEngineer } from "./fallbacks";
import type { GeneratedTask } from "../engine/types";

/** "Ask the Chief Engineer" (§5a #4): explains concepts, never solves the task. */
export async function askChiefEngineer(
  question: string,
  task: GeneratedTask | null,
  profileName: string,
): Promise<string> {
  const system = [
    `You are the Chief Engineer at Commander ${profileName}'s Rocket Lab, speaking to a`,
    "curious 10-year-old. Explain rocket and maths CONCEPTS in friendly, simple UK",
    "English (2 to 4 sentences). You are strictly FORBIDDEN from solving the current",
    "task or revealing its answer. Never write operation symbols. Never use the words",
    "'wrong', 'incorrect' or 'failed'. Stay on rockets and maths.",
  ].join(" ");
  const prompt = [
    task ? `Current task context (do NOT solve it): "${task.briefing}"` : "",
    task ? `SECRET answer, never reveal: ${task.answer}` : "",
    `The commander asks: "${question}"`,
  ]
    .filter(Boolean)
    .join("\n");
  const text = await generateText(prompt, system, 6000);
  if (text && validateOutput(text, task?.answer, 700)) return text.trim();
  return fallbackChiefEngineer();
}
