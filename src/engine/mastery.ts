import type { Attempt } from "../db/db";
import type { Strand } from "../curriculum/types";
import { CRITERIA, criteriaForStrand } from "../curriculum/criteria";
import type { MissionStation } from "./types";
import type { RocketPart } from "../three/rocketDesign";

const DAY = 24 * 60 * 60 * 1000;
export const REVIEW_INTERVALS_DAYS = [1, 3, 7, 14];

export interface CriterionMastery {
  code: string;
  attempts: number;
  correct: number;
  /** current streak of consecutive correct answers */
  streak: number;
  /** streak counting only tier >= 2 answers (resets on any wrong) */
  masteryStreak: number;
  mastered: boolean;
  lastSeenAt: number | null;
  /** number of successful reviews after mastery (drives interval) */
  reviewCount: number;
  /** timestamp when this criterion is due for spaced-repetition review */
  dueAt: number | null;
}

/**
 * Derive mastery state for one criterion from its attempts (oldest → newest).
 * Mastery = 2 correct in a row (any tier). A wrong answer resets streaks
 * and the spaced-repetition interval.  Lowered from the original 3-at-tier-2
 * so younger learners can progress without a punishing streak requirement.
 */
export function masteryForCriterion(
  code: string,
  attempts: Attempt[],
): CriterionMastery {
  const rows = attempts
    .filter((a) => a.criterionCode === code)
    .sort((a, b) => a.createdAt - b.createdAt);

  let streak = 0;
  let masteryStreak = 0;
  let mastered = false;
  let masteredAt: number | null = null;
  let reviewCount = 0;

  for (const a of rows) {
    if (a.correct) {
      streak += 1;
      masteryStreak += 1;
      if (!mastered && masteryStreak >= 2) {
        mastered = true;
        masteredAt = a.createdAt;
      } else if (mastered) {
        reviewCount += 1;
      }
    } else {
      streak = 0;
      masteryStreak = 0;
      if (mastered) reviewCount = 0; // wrong answer resets the interval
    }
  }

  const lastSeenAt = rows.length ? rows[rows.length - 1].createdAt : null;
  let dueAt: number | null = null;
  if (mastered && lastSeenAt !== null) {
    const idx = Math.min(reviewCount, REVIEW_INTERVALS_DAYS.length - 1);
    dueAt = lastSeenAt + REVIEW_INTERVALS_DAYS[idx] * DAY;
  }
  void masteredAt;

  return {
    code,
    attempts: rows.length,
    correct: rows.filter((a) => a.correct).length,
    streak,
    masteryStreak,
    mastered,
    lastSeenAt,
    reviewCount,
    dueAt,
  };
}

export function masteryMap(attempts: Attempt[]): Map<string, CriterionMastery> {
  const map = new Map<string, CriterionMastery>();
  for (const c of CRITERIA) {
    map.set(c.code, masteryForCriterion(c.code, attempts));
  }
  return map;
}

/** fraction (0..1) of a strand's criteria mastered */
export function strandMastery(strand: Strand, attempts: Attempt[]): number {
  const crits = criteriaForStrand(strand);
  if (!crits.length) return 0;
  const mastered = crits.filter(
    (c) => masteryForCriterion(c.code, attempts).mastered,
  ).length;
  return mastered / crits.length;
}

/** fraction of all KS2 criteria mastered */
export function ks2Mastery(attempts: Attempt[]): number {
  const ks2 = CRITERIA.filter((c) => c.keyStage !== "KS3");
  const mastered = ks2.filter(
    (c) => masteryForCriterion(c.code, attempts).mastered,
  ).length;
  return mastered / ks2.length;
}

/** fraction of all KS3 criteria mastered */
export function ks3Mastery(attempts: Attempt[]): number {
  const ks3 = CRITERIA.filter((c) => c.keyStage === "KS3");
  const mastered = ks3.filter(
    (c) => masteryForCriterion(c.code, attempts).mastered,
  ).length;
  return mastered / ks3.length;
}

// ─── XP ──────────────────────────────────────────────────────────────────

export function xpForAnswer(tier: number, hintsUsed: number, correct: boolean): number {
  if (!correct) return 0;
  const base = tier * 10;
  return Math.max(2, base - hintsUsed * 3);
}

// ─── Station unlock rules (§6b) ─────────────────────────────────────────

function combinedStrandMastery(strands: Strand[], attempts: Attempt[]): number {
  const crits = strands.flatMap((s) =>
    criteriaForStrand(s).filter((c) => c.keyStage !== "KS3"),
  );
  if (!crits.length) return 0;
  const mastered = crits.filter(
    (c) => masteryForCriterion(c.code, attempts).mastered,
  ).length;
  return mastered / crits.length;
}

const SIX_AS_MD = ["6AS/MD-1", "6AS/MD-2", "6AS/MD-3", "6AS/MD-4"];

export interface StationUnlockState {
  station: MissionStation;
  unlocked: boolean;
  requirement: string;
  progress: number; // 0..1 toward unlock
}

export function stationUnlocks(
  attempts: Attempt[],
  missionCount: number,
  academyUnlocked = false,
): StationUnlockState[] {
  // "I'm in Year 7+" toggle: full Astronaut Academy access, all stations live
  if (academyUnlocked) {
    const ALL: MissionStation[] = [
      "rdLab",
      "guidanceComputer",
      "propulsionLab",
      "trajectoryPlanner",
      "missionAssurance",
      "telemetryCentre",
    ];
    return ALL.map((station) => ({
      station,
      unlocked: true,
      requirement: "Year 7+ Academy access granted",
      progress: 1,
    }));
  }
  const npvNf = combinedStrandMastery(["NPV", "NF"], attempts);

  // Guidance: 70% of AS + the four 6AS/MD criteria mastered
  const asCrits = criteriaForStrand("AS");
  const asMastered = asCrits.filter(
    (c) => masteryForCriterion(c.code, attempts).mastered,
  ).length;
  const asFrac = asMastered / asCrits.length;
  const sixMastered = SIX_AS_MD.filter(
    (code) => masteryForCriterion(code, attempts).mastered,
  ).length;
  const guidanceProgress = Math.min(
    1,
    (asFrac / 0.7) * 0.5 + (sixMastered / 4) * 0.5,
  );
  const guidanceUnlocked = asFrac >= 0.7 && sixMastered === 4;

  const mdF = combinedStrandMastery(["MD", "F"], attempts);
  const g = combinedStrandMastery(["G"], attempts);

  const base: StationUnlockState[] = [
    {
      station: "rdLab",
      unlocked: npvNf >= 0.7,
      requirement: "Master 70% of Place Value + Number Facts systems",
      progress: Math.min(1, npvNf / 0.7),
    },
    {
      station: "guidanceComputer",
      unlocked: guidanceUnlocked,
      requirement:
        "Master 70% of Addition & Subtraction + all four Y6 power-grid systems",
      progress: guidanceProgress,
    },
    {
      station: "propulsionLab",
      unlocked: mdF >= 0.7,
      requirement: "Master 70% of Multiplication/Division + Fractions systems",
      progress: Math.min(1, mdF / 0.7),
    },
    {
      station: "trajectoryPlanner",
      unlocked: g >= 0.7,
      requirement: "Master 70% of Geometry systems",
      progress: Math.min(1, g / 0.7),
    },
  ];

  const openCount = base.filter((s) => s.unlocked).length;
  base.push({
    station: "missionAssurance",
    unlocked: openCount >= 3,
    requirement: "Power up any 3 other stations",
    progress: Math.min(1, openCount / 3),
  });
  base.push({
    station: "telemetryCentre",
    unlocked: openCount >= 3 && missionCount >= 5,
    requirement: "Power up any 3 other stations + fly 5 recorded missions",
    progress: Math.min(1, (Math.min(openCount, 3) / 3) * 0.5 + (Math.min(missionCount, 5) / 5) * 0.5),
  });
  return base;
}

// ─── Destination unlock rules (§7) ──────────────────────────────────────

export function destinationUnlocked(
  destinationId: string,
  attempts: Attempt[],
  missionCount: number,
  academyUnlocked = false,
): boolean {
  const k2 = ks2Mastery(attempts);
  const k3 = ks3Mastery(attempts);
  const stations = stationUnlocks(attempts, missionCount, academyUnlocked);
  const open = stations.filter((s) => s.unlocked).length;
  switch (destinationId) {
    case "orbit":
      return true;
    case "moon":
      return k2 >= 0.1;
    case "mars":
      return k2 >= 0.3;
    case "deep":
      return k2 >= 0.5;
    case "jupiter":
      return open >= 1;
    case "saturn":
      return k3 >= 0.25 && open >= 4;
    case "interstellar":
      return k3 >= 0.5 && open === 6;
    default:
      return false;
  }
}

// ─── Part upgrade levels (§7) ────────────────────────────────────────────

const PART_STRANDS: Record<RocketPart, Strand[]> = {
  noseCone: ["G"],
  hull: ["NPV"],
  fuelTank: ["NPV", "F"],
  engine: ["NF", "MD"],
  fins: ["G", "AS"],
  payloadBay: ["F", "MD"],
  electronics: ["AS", "MD"],
  booster: ["NF", "MD"],
};

export function partLevel(part: RocketPart, attempts: Attempt[]): 1 | 2 | 3 {
  const strands = PART_STRANDS[part];
  const crits = strands.flatMap((s) => criteriaForStrand(s));
  const mastered = crits.filter(
    (c) => masteryForCriterion(c.code, attempts).mastered,
  ).length;
  if (mastered >= 5) return 3;
  if (mastered >= 2) return 2;
  return 1;
}

// ─── Mission planner support ────────────────────────────────────────────

/**
 * Priority order for a strand's criteria (§7):
 * 1. due spaced-repetition reviews
 * 2. criteria with recent wrong answers
 * 3. new criteria in curriculum order (Year 1 → 6, then KS3 when allowed)
 */
export function prioritiseCriteria(
  strands: Strand[],
  attempts: Attempt[],
  opts: { includeKS3: boolean; now?: number },
): string[] {
  const now = opts.now ?? Date.now();
  const crits = strands
    .flatMap((s) => criteriaForStrand(s))
    .filter((c) => (opts.includeKS3 ? true : c.keyStage !== "KS3"))
    .sort((a, b) => a.year - b.year);

  const due: string[] = [];
  const wrong: string[] = [];
  const fresh: string[] = [];
  const rest: string[] = [];

  for (const c of crits) {
    const m = masteryForCriterion(c.code, attempts);
    if (m.mastered && m.dueAt !== null && m.dueAt <= now) due.push(c.code);
    else if (!m.mastered && m.attempts > 0 && m.streak === 0) wrong.push(c.code);
    else if (m.attempts === 0) fresh.push(c.code);
    else if (!m.mastered) rest.push(c.code);
  }
  return [...due, ...wrong, ...rest, ...fresh];
}

/** Suggested tier for a criterion given its history. */
export function tierFor(code: string, attempts: Attempt[]): number {
  const m = masteryForCriterion(code, attempts);
  if (m.attempts === 0) return 1;
  if (m.mastered) return 3;
  if (m.streak >= 2) return Math.min(3, 2 + Math.floor(m.streak / 3));
  return m.streak >= 1 ? 2 : 1;
}