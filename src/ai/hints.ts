import { generateText } from "./gemini";
import { flightDirectorSystemPrompt, validateOutput } from "./flightDirector";
import { fallbackHint } from "./fallbacks";
import type { GeneratedTask } from "../engine/types";

const cache = new Map<string, string>();

/**
 * Adaptive hint (§5a #1): diagnose the child's actual wrong answer and give
 * ONE gentle scaffolded nudge. Never states the answer. Falls back to the
 * template's static hints.
 */
export async function adaptiveHint(
  task: GeneratedTask,
  wrongAnswer: string,
  hintsUsed: number,
  profileName: string,
): Promise<string> {
  const key = `${task.id}|${wrongAnswer}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const fallback = fallbackHint(task.hints, hintsUsed);
  const prompt = [
    `Engineering task briefing: "${task.briefing}"`,
    `Correct answer (SECRET — never reveal it): ${task.answer}`,
    `Worked steps: ${task.workedSteps.join(" / ")}`,
    `The commander answered: "${wrongAnswer}"`,
    "Diagnose the likely slip in one short clause, then give ONE gentle nudge",
    "toward the method. Do not reveal the answer or any part of it.",
  ].join("\n");

  const text = await generateText(prompt, flightDirectorSystemPrompt(profileName));
  if (text && validateOutput(text, task.answer, 300)) {
    cache.set(key, text.trim());
    return text.trim();
  }
  return fallback;
}
