import { generateText } from "./gemini";
import { flightDirectorSystemPrompt } from "./flightDirector";
import type { GeneratedTask } from "../engine/types";

const cache = new Map<string, string>();

/** every numeric token from the original must survive the paraphrase */
function numbersPreserved(original: string, paraphrase: string): boolean {
  const nums = original.match(/\d[\d,./]*/g) ?? [];
  return nums.every((n) => paraphrase.includes(n));
}

const OP_SYMBOLS = /[+×÷=]|\u2212/;

/**
 * Briefing variety (§5a #2): paraphrase while keeping every number, unit and
 * the question intact. Mechanical validation; original text on any failure.
 */
export async function paraphraseBriefing(
  task: GeneratedTask,
  profileName: string,
): Promise<string> {
  const cached = cache.get(task.id);
  if (cached) return cached;

  const text = await generateText(
    [
      "Paraphrase this rocket engineering briefing for variety. Keep EVERY number,",
      "unit and the final question intact. Do not add operation symbols.",
      `Briefing: "${task.briefing}"`,
      "Reply with the paraphrased briefing only.",
    ].join("\n"),
    flightDirectorSystemPrompt(profileName),
  );

  if (
    text &&
    !OP_SYMBOLS.test(text) &&
    numbersPreserved(task.briefing, text) &&
    text.length < task.briefing.length * 2
  ) {
    cache.set(task.id, text.trim());
    return text.trim();
  }
  return task.briefing;
}
