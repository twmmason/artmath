/** Static text used whenever Gemini is unavailable or validation fails. */

export const FALLBACK_NUDGE =
  "Almost, Commander — take another look at the readout and try again.";

export function fallbackHint(staticHints: string[], hintsUsed: number): string {
  if (!staticHints.length)
    return "Check the numbers in the briefing one more time, Commander.";
  return staticHints[Math.min(hintsUsed, staticHints.length - 1)];
}

export function fallbackDebrief(
  name: string,
  destination: string,
  correct: number,
  total: number,
  altitudeKm: number,
  reached: boolean,
): string {
  const quality =
    total > 0 && correct / total >= 0.8
      ? "Beautiful engineering work in the VAB today."
      : "Solid work in the VAB — a few systems will fly even better next time.";
  const outcome = reached
    ? `We made it to ${destination}, topping out at ${Math.round(altitudeKm).toLocaleString("en-GB")} km.`
    : `We reached ${Math.round(altitudeKm).toLocaleString("en-GB")} km — not quite ${destination} this time, but the data we gathered is gold.`;
  return `Commander ${name}, ${quality} ${outcome} The whole control room is proud of this one. See you in the hangar for the next build.`;
}

export function fallbackChiefEngineer(): string {
  return "Good question, Commander. The Chief Engineer is elbow-deep in an engine right now — check the briefing and the widget for clues, and ask me again in a moment.";
}

export function fallbackMilestone(label: string): string {
  return `Outstanding, Commander — ${label}. Mission Control is proud of you.`;
}
