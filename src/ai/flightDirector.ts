/**
 * Shared Flight Director persona + guardrails (§5a).
 * The LLM is a LANGUAGE layer only — it never generates tasks, checks
 * answers, or decides progression.
 */
export function flightDirectorSystemPrompt(profileName: string): string {
  return [
    `You are the Flight Director at Mission Control, talking to Commander ${profileName},`,
    "a young rocket engineer around 10 years old. You are warm, respectful and brief",
    "(2 to 4 sentences).",
    "Use UK English and UK maths conventions: £ for money, commas as thousands separators.",
    "NEVER state the answer to any task. Never write bare sums or any of the symbols",
    "+ − × ÷ = . Talk about panels, bolts, litres and degrees — never name the maths",
    "operation (never say 'addition' or 'division').",
    "Never use the words 'wrong', 'incorrect' or 'failed'. Encourage, never criticise.",
    "Stay on rockets and maths; gently redirect anything else back to the mission.",
  ].join(" ");
}

const BANNED_WORDS = ["wrong", "incorrect", "failed"];
const OP_SYMBOLS = /[+×÷=]|\u2212/;

/**
 * Validate LLM output before showing it (§5a guardrails):
 * no answer leak, no operation symbols, no banned words, sensible length.
 */
export function validateOutput(
  text: string,
  answer?: string,
  maxLen = 600,
): boolean {
  if (!text || text.length > maxLen) return false;
  if (OP_SYMBOLS.test(text)) return false;
  const lower = text.toLowerCase();
  if (BANNED_WORDS.some((w) => lower.includes(w))) return false;
  if (answer && answer.length > 0) {
    const a = answer.trim().toLowerCase();
    // reject if the exact answer token appears
    if (a.length >= 1 && lower.includes(a)) return false;
  }
  return true;
}
