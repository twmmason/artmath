import type { Attempt } from "../db/db";
import type { RocketPart } from "../three/rocketDesign";
import type { MissionStation } from "../engine/types";
import { PART_CRITERIA } from "./parts";
import { STATIONS } from "./stations";
import { CRITERIA_BY_CODE, criteriaForStrand } from "../curriculum/criteria";
import {
  masteryForCriterion,
  tierFor,
  stationUnlocks,
} from "../engine/mastery";
import type { Destination } from "./destinations";

export interface PlannedTask {
  criterionCode: string;
  tier: number;
  station?: MissionStation;
}

export interface MissionPlan {
  /** criteria each part pulls when it is certified (2 per part, §2 session design) */
  partTasks: Record<RocketPart, PlannedTask[]>;
  /** KS3 Mission Control science package for advanced destinations (§7) */
  stationTasks: PlannedTask[];
}

/**
 * Plan which criteria each part pulls for this mission (§7 priorities):
 * 1. due spaced-repetition reviews  2. recent wrong answers
 * 3. new criteria in curriculum order.
 * A mission stays ~15–20 min: 2 tasks per part + checklist.
 */
export function planMission(
  destination: Destination,
  attempts: Attempt[],
  missionCount: number,
  tasksPerPart = 2,
  academyUnlocked = false,
): MissionPlan {
  const now = Date.now();
  const [minTier, maxTier] = destination.tierRange;

  const planPart = (part: RocketPart): PlannedTask[] => {
    const codes = PART_CRITERIA[part];
    const due: string[] = [];
    const wrong: string[] = [];
    const inProgress: string[] = [];
    const fresh: string[] = [];
    for (const code of codes) {
      const m = masteryForCriterion(code, attempts);
      if (m.mastered && m.dueAt !== null && m.dueAt <= now) due.push(code);
      else if (!m.mastered && m.attempts > 0 && m.streak === 0) wrong.push(code);
      else if (m.attempts === 0) fresh.push(code);
      else if (!m.mastered) inProgress.push(code);
    }
    // fresh criteria in curriculum year order so Artie starts with wins
    fresh.sort(
      (a, b) =>
        (CRITERIA_BY_CODE.get(a)?.year ?? 9) - (CRITERIA_BY_CODE.get(b)?.year ?? 9),
    );
    const ordered = [...due, ...wrong, ...inProgress, ...fresh];
    return ordered.slice(0, tasksPerPart).map((code) => ({
      criterionCode: code,
      tier: Math.max(minTier, Math.min(maxTier, tierFor(code, attempts))),
    }));
  };

  const partTasks = {
    noseCone: planPart("noseCone"),
    hull: planPart("hull"),
    fuelTank: planPart("fuelTank"),
    engine: planPart("engine"),
    fins: planPart("fins"),
    payloadBay: planPart("payloadBay"),
    electronics: planPart("electronics"),
    booster: planPart("booster"),
  } as Record<RocketPart, PlannedTask[]>;

  // Advanced destinations add a Mission Control science package (3–5 KS3 tasks)
  const stationTasks: PlannedTask[] = [];
  if (destination.ks3) {
    const unlocks = stationUnlocks(attempts, missionCount, academyUnlocked);
    const openStations = STATIONS.filter((s) =>
      unlocks.find((u) => u.station === s.id && u.unlocked),
    );
    for (const st of openStations) {
      const codes = criteriaForStrand(st.ks3Strand).map((c) => c.code);
      const notMastered = codes.filter(
        (code) => !masteryForCriterion(code, attempts).mastered,
      );
      const pool = notMastered.length ? notMastered : codes;
      if (pool.length) {
        stationTasks.push({
          criterionCode: pool[missionCount % pool.length],
          tier: Math.max(minTier, Math.min(maxTier, tierFor(pool[0], attempts))),
          station: st.id,
        });
      }
      if (stationTasks.length >= 5) break;
    }
  }

  return { partTasks, stationTasks };
}