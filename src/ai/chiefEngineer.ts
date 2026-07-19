import { generateText } from "./gemini";
import { validateOutput } from "./flightDirector";
import { fallbackChiefEngineer } from "./fallbacks";
import { CRITERIA_BY_CODE } from "../curriculum/criteria";
import type { GeneratedTask } from "../engine/types";

/** "Ask the Chief Engineer" (§5a #4): explains concepts, never solves the task. */
export async function askChiefEngineer(
  question: string,
  task: GeneratedTask | null,
  profileName: string,
): Promise<string> {
  const isKS3 =
    task != null && CRITERIA_BY_CODE.get(task.criterionCode)?.keyStage === "KS3";
  const system = [
    `You are the Chief Engineer at Commander ${profileName}'s Rocket Lab,`,
    isKS3
      ? "speaking to a Year 7 to 9 secondary-school commander in the Astronaut Academy. Give richer, slightly more grown-up explanations (3 to 5 sentences) and feel free to name mathematical ideas like gradient, ratio, probability or standard form by name."
      : "speaking to a curious 10-year-old. Explain rocket and maths CONCEPTS in friendly, simple UK English (2 to 4 sentences).",
    "You are strictly FORBIDDEN from solving the current",
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
