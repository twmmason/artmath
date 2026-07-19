import { generateText } from "./gemini";
import { flightDirectorSystemPrompt, validateOutput } from "./flightDirector";
import { fallbackDebrief } from "./fallbacks";

export interface DebriefStats {
  profileName: string;
  destinationName: string;
  siteName?: string;
  tasksCorrect: number;
  tasksTotal: number;
  maxAltitudeKm: number;
  reached: boolean;
  eventLabels: string[];
}

/** After-action Flight Director narration (§5a #3). */
export async function narrateDebrief(stats: DebriefStats): Promise<string> {
  const fallback = fallbackDebrief(
    stats.profileName,
    stats.destinationName,
    stats.tasksCorrect,
    stats.tasksTotal,
    stats.maxAltitudeKm,
    stats.reached,
  );
  const prompt = [
    "Write a short mission debrief (3 to 4 sentences) for the commander.",
    `Destination: ${stats.destinationName}${stats.siteName ? `, launched from ${stats.siteName}` : ""}.`,
    `Engineering tasks certified: ${stats.tasksCorrect} of ${stats.tasksTotal}.`,
    `Peak altitude: ${Math.round(stats.maxAltitudeKm)} km. Destination reached: ${stats.reached ? "yes" : "not this time"}.`,
    `Flight events: ${stats.eventLabels.join("; ")}.`,
    "Reference at least one specific thing from this mission. Stay encouraging.",
  ].join("\n");
  const text = await generateText(prompt, flightDirectorSystemPrompt(stats.profileName));
  if (text && validateOutput(text, undefined, 700)) return text.trim();
  return fallback;
}
