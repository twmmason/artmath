import type { RocketPart } from "../three/rocketDesign";

export type MissionStation =
  | "rdLab"
  | "guidanceComputer"
  | "propulsionLab"
  | "trajectoryPlanner"
  | "missionAssurance"
  | "telemetryCentre";

export const ALL_STATIONS: MissionStation[] = [
  "rdLab",
  "guidanceComputer",
  "propulsionLab",
  "trajectoryPlanner",
  "missionAssurance",
  "telemetryCentre",
];

export type WidgetKind =
  | "protractor"
  | "ruler"
  | "fuelGauge"
  | "numberLine"
  | "ratioMixer"
  | "payloadSplit"
  | "grid"
  | "circuit"
  | "barModel"
  | "checklist"
  // KS3
  | "graph"
  | "equation"
  | "scaleDiagram"
  | "construction"
  | "venn"
  | "dataChart"
  | "riskDial";

export interface VisualSpec {
  widget: WidgetKind;
  config: Record<string, number | string | boolean>;
}

export interface RocketEffect {
  property: string; // e.g. "noseAngle", "tankFill", "thrustPerEngine"
  correctValue: number;
  incorrectValue: number;
  unit: string;
}

export interface GeneratedTask {
  id: string;
  criterionCode: string;
  rocketPart: RocketPart;
  station?: MissionStation;
  tier: number; // 1..3
  briefing: string;
  /** KS3 only: displayed notation (formula/equation) — allowed to contain op symbols */
  notation?: string;
  engineeringContext: string;
  answer: string;
  choices?: string[];
  workedSteps: string[];
  hints: string[];
  visual: VisualSpec;
  rocketEffect: RocketEffect;
  /** answer tolerance for measurement widgets (absolute) */
  tolerance?: number;
  /** if true, equivalent fractions are accepted */
  acceptEquivalentFractions?: boolean;
  /** additional accepted answer strings (case-insensitive) */
  acceptAnswers?: string[];
}

export type Rng = () => number;

export type TaskTemplate = (tier: number, rng: Rng) => GeneratedTask;

/** map of criterionCode → template */
export type TemplateMap = Record<string, TaskTemplate>;

// ─── shared answer checking ──────────────────────────────────────────────

function parseFraction(s: string): number | null {
  const m = s.match(/^(-?\d+)\s*\/\s*(\d+)$/);
  if (!m) return null;
  const den = Number(m[2]);
  if (den === 0) return null;
  return Number(m[1]) / den;
}

function normalise(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[£,]/g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*(kg|km|kn|m\/s|litres?|l\b|m\b|cm|mm|watts?|w\b|°c?|deg|degrees|seconds?|s\b|t\b|tonnes?|ohms?)\.?$/i, "")
    .trim();
}

/**
 * §10 rule 4: briefings must never contain bare operation symbols.
 * (KS3 notation lives in the separate `notation` field, never the briefing.)
 */
export function briefingViolatesRule4(briefing: string): boolean {
  return /[+×÷=]|\u2212/.test(briefing);
}

/** Check a user's answer against a task, honouring tolerance and fraction equivalence. */
export function checkAnswer(task: GeneratedTask, given: string): boolean {
  const expectedRaw = task.answer;
  const g = normalise(given);
  const e = normalise(expectedRaw);
  if (g === e) return true;
  if (task.acceptAnswers?.some((a) => normalise(a) === g)) return true;

  // fraction equivalence
  const gf = parseFraction(g);
  const ef = parseFraction(e);
  if (gf !== null && ef !== null) {
    if (task.acceptEquivalentFractions) return Math.abs(gf - ef) < 1e-9;
    return g.replace(/\s/g, "") === e.replace(/\s/g, "");
  }
  if (gf !== null && ef === null) {
    const en = Number(e);
    if (!Number.isNaN(en)) return Math.abs(gf - en) < 1e-6;
  }

  const gn = Number(g);
  const en = Number(e);
  if (!Number.isNaN(gn) && !Number.isNaN(en)) {
    const tol = task.tolerance ?? 1e-9;
    return Math.abs(gn - en) <= tol + 1e-12;
  }
  return false;
}