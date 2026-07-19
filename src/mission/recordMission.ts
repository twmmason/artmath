import { db, type Profile, type MissionRecord } from "../db/db";
import type { FlightResult } from "../physics/types";
import { masteryForCriterion, stationUnlocks, strandMastery } from "../engine/mastery";
import { KS2_STRANDS, KS3_STRANDS } from "../curriculum/types";

const DAY = 24 * 60 * 60 * 1000;

export interface MissionOutcome {
  record: MissionRecord;
  newPatches: string[];
}

/** Save mission results, update streak & award patches. Returns new patch ids. */
export async function recordMission(
  profile: Profile,
  destinationId: string,
  tasksCorrect: number,
  tasksTotal: number,
  flight: FlightResult,
  firstTryAll: boolean,
  screenshot?: string,
): Promise<MissionOutcome> {
  const record: MissionRecord = {
    profileId: profile.id,
    destinationId,
    launchSiteId: profile.launchSiteId,
    tasksCorrect,
    tasksTotal,
    maxAltitudeKm: flight.maxAltitudeKm,
    reachedDestination: flight.reached,
    screenshot,
    photos: [],
    createdAt: Date.now(),
  };
  const id = await db.missions.add(record);
  record.id = id;

  // launch streak: consecutive days with ≥1 launch
  const sinceLast = Date.now() - profile.lastPlayedAt;
  const sameDay =
    new Date(profile.lastPlayedAt).toDateString() === new Date().toDateString();
  let streak = profile.launchStreak;
  if (profile.launchStreak === 0) streak = 1;
  else if (!sameDay && sinceLast < 2 * DAY) streak += 1;
  else if (!sameDay) streak = 1;

  // patches
  const attempts = await db.attempts.where("profileId").equals(profile.id).toArray();
  const missions = await db.missions.where("profileId").equals(profile.id).toArray();
  const newPatches: string[] = [];
  const has = (p: string) => profile.patches.includes(p) || newPatches.includes(p);
  const award = (p: string, cond: boolean) => {
    if (cond && !has(p)) newPatches.push(p);
  };

  award("first-launch", true);
  award("moon-mission", destinationId === "moon" && flight.reached);
  award("mars-mission", destinationId === "mars" && flight.reached);
  award("jupiter-mission", destinationId === "jupiter" && flight.reached);
  award("interstellar", destinationId === "interstellar" && flight.reached);
  award("streak-5", streak >= 5);
  award("perfect-mission", firstTryAll && tasksTotal > 0);
  award(
    "strand-master",
    KS2_STRANDS.some((s) => strandMastery(s, attempts) >= 1),
  );
  const unlocks = stationUnlocks(attempts, missions.length, profile.academyUnlocked);
  award("station-open", unlocks.some((u) => u.unlocked));
  award("secondary-ready", unlocks.every((u) => u.unlocked));
  award(
    "ks3-domain",
    KS3_STRANDS.some((s) => strandMastery(s, attempts) >= 1),
  );

  await db.profiles.update(profile.id, {
    launchStreak: streak,
    lastPlayedAt: Date.now(),
    patches: [...profile.patches, ...newPatches],
  });

  void masteryForCriterion; // (referenced for clarity — mastery derives from attempts)
  return { record, newPatches };
}