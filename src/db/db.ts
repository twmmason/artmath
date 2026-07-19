import Dexie, { type Table } from "dexie";
import type { RocketDesign, RocketPart } from "../three/rocketDesign";
import { defaultRocketDesign } from "../three/rocketDesign";

export interface Profile {
  id: string; // slug of the name, e.g. "artie"
  name: string; // display name from the Commander Roster
  createdAt: number;
  xp: number;
  launchStreak: number;
  lastPlayedAt: number;
  rocketDesign: RocketDesign;
  launchSiteId: string;
  partLevels: Record<RocketPart, 1 | 2 | 3>;
  patches: string[];
  /** "I'm in Year 7+" — unlocks the full Astronaut Academy (all KS3 stations). */
  academyUnlocked?: boolean;
}

export interface Attempt {
  id?: number;
  profileId: string;
  criterionCode: string;
  tier: number;
  correct: boolean;
  hintsUsed: number;
  missionId?: number;
  createdAt: number;
}

export interface MissionRecord {
  id?: number;
  profileId: string;
  destinationId: string;
  launchSiteId?: string;
  tasksCorrect: number;
  tasksTotal: number;
  maxAltitudeKm: number;
  reachedDestination: boolean;
  screenshot?: string;
  photos?: string[];
  createdAt: number;
}

/** Mid-build mission state so a mission can be saved & resumed. */
export interface MissionSave {
  id?: number;
  profileId: string;
  destinationId: string;
  state: string; // JSON of in-progress mission
  updatedAt: number;
}

class RocketLabDB extends Dexie {
  profiles!: Table<Profile, string>;
  attempts!: Table<Attempt, number>;
  missions!: Table<MissionRecord, number>;
  missionSaves!: Table<MissionSave, number>;

  constructor() {
    super("rocketlab");
    this.version(1).stores({
      profiles: "id",
      attempts: "++id, profileId, criterionCode, createdAt",
      missions: "++id, profileId, destinationId, createdAt",
      missionSaves: "++id, profileId, updatedAt",
    });
    // v2: Year 7+ Academy toggle on profiles (non-indexed field, default false)
    this.version(2)
      .stores({
        profiles: "id",
        attempts: "++id, profileId, criterionCode, createdAt",
        missions: "++id, profileId, destinationId, createdAt",
        missionSaves: "++id, profileId, updatedAt",
      })
      .upgrade((tx) =>
        tx
          .table("profiles")
          .toCollection()
          .modify((p: Profile) => {
            if (p.academyUnlocked === undefined) p.academyUnlocked = false;
          }),
      );
  }
}

export const db = new RocketLabDB();

export function slugify(name: string): string {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || `commander-${Date.now().toString(36)}`
  );
}

export function newProfile(name: string, academyUnlocked = false): Profile {
  return {
    id: slugify(name),
    name: name.trim(),
    createdAt: Date.now(),
    xp: 0,
    launchStreak: 0,
    lastPlayedAt: Date.now(),
    rocketDesign: defaultRocketDesign(),
    launchSiteId: "canaveral",
    partLevels: {
      noseCone: 1,
      hull: 1,
      fuelTank: 1,
      engine: 1,
      fins: 1,
      payloadBay: 1,
      electronics: 1,
      booster: 1,
    },
    patches: [],
    academyUnlocked,
  };
}

const ACTIVE_KEY = "rocketlab.activeProfileId";

export function getActiveProfileId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_KEY);
  } catch {
    return null;
  }
}

export function setActiveProfileId(id: string | null): void {
  try {
    if (id === null) localStorage.removeItem(ACTIVE_KEY);
    else localStorage.setItem(ACTIVE_KEY, id);
  } catch {
    // storage unavailable — non-fatal
  }
}