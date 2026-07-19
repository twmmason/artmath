import { generateText } from "./gemini";
import { validateOutput } from "./flightDirector";
import type { MissionRecord } from "../db/db";

/**
 * Telemetry insight (§6b): AFTER the deterministic stats are computed from the
 * commander's own mission history, ask Gemini to narrate ONE interesting
 * pattern. Validated, cached per (profile, mission count), static fallback.
 * The LLM never computes the statistics — it only describes them.
 */

interface FlightStats {
  flights: number;
  meanKm: number;
  bestKm: number;
  reachedCount: number;
  improving: boolean;
}

function computeStats(missions: MissionRecord[]): FlightStats {
  const alts = missions.map((m) => m.maxAltitudeKm);
  const mean = alts.reduce((a, b) => a + b, 0) / Math.max(1, alts.length);
  const chrono = [...missions].sort((a, b) => a.createdAt - b.createdAt);
  const half = Math.floor(chrono.length / 2);
  const early = chrono.slice(0, half).map((m) => m.maxAltitudeKm);
  const late = chrono.slice(half).map((m) => m.maxAltitudeKm);
  const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
  return {
    flights: missions.length,
    meanKm: Math.round(mean),
    bestKm: Math.round(Math.max(0, ...alts)),
    reachedCount: missions.filter((m) => m.reachedDestination).length,
    improving: avg(late) > avg(early),
  };
}

function fallbackInsight(name: string, s: FlightStats): string {
  const trend = s.improving
    ? "your recent flights are climbing higher than your early ones — the fleet is improving"
    : "your early flights set a strong benchmark to beat";
  return `Commander ${name}, across ${s.flights} recorded flights your average apogee is ${s.meanKm.toLocaleString(
    "en-GB",
  )} km, with a personal best of ${s.bestKm.toLocaleString("en-GB")} km. And ${trend}.`;
}

const cache = new Map<string, string>();

export async function telemetryInsight(
  profileId: string,
  name: string,
  missions: MissionRecord[],
): Promise<string | null> {
  if (missions.length < 3) return null;
  const key = `${profileId}:${missions.length}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const s = computeStats(missions);
  const system = [
    `You are the Flight Director reviewing Commander ${name}'s telemetry wall.`,
    "Describe ONE interesting pattern in their flight data in warm UK English,",
    "2 sentences maximum. Do not invent numbers — only use the statistics given.",
    "Never write operation symbols. Never use the words 'wrong', 'incorrect' or 'failed'.",
  ].join(" ");
  const prompt = [
    `Deterministic statistics from ${s.flights} real flights:`,
    `mean apogee ${s.meanKm} km; best apogee ${s.bestKm} km;`,
    `${s.reachedCount} of ${s.flights} flights reached their destination;`,
    `altitude trend across the log: ${s.improving ? "improving" : "flat or early-peaked"}.`,
    "Narrate one pattern for the commander.",
  ].join(" ");

  const text = await generateText(prompt, system, 5000);
  const result = text && validateOutput(text, undefined, 400) ? text.trim() : fallbackInsight(name, s);
  cache.set(key, result);
  return result;
}