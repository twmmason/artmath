import { create } from "zustand";
import type { Profile } from "../db/db";
import { db, setActiveProfileId } from "../db/db";
import type {
  RocketDesign,
  RocketPart,
  InstalledPart,
} from "../three/rocketDesign";
import { defaultRocketDesign } from "../three/rocketDesign";
import { variantById } from "./partsCatalog";
import type { MissionPlan } from "./runPlanner";

export interface MissionProgress {
  destinationId: string;
  plan: MissionPlan | null;
  tasksCorrect: number;
  tasksTotal: number;
  firstTryAll: boolean;
  checklistDone: boolean;
  stationTasksDone: number;
}

interface RocketState {
  profile: Profile | null;
  design: RocketDesign;
  mission: MissionProgress | null;
  selectedPart: RocketPart | null;

  setProfile: (p: Profile | null) => void;
  updateDesign: (patch: Partial<RocketDesign>) => void;
  applyEffect: (property: string, value: number) => void;
  attachPart: (variantId: string) => void;
  detachPart: (part: RocketPart) => void;
  certifyPart: (part: RocketPart) => void;
  selectPart: (part: RocketPart | null) => void;
  startMission: (destinationId: string, plan: MissionPlan) => void;
  recordTaskResult: (correct: boolean, firstTry: boolean) => void;
  recordStationTaskDone: () => void;
  completeChecklist: () => void;
  clearMission: () => void;
  restoreMission: (m: MissionProgress, design: RocketDesign) => void;
  addXp: (xp: number) => void;
}

function persistDesign(profile: Profile | null, design: RocketDesign): void {
  if (!profile) return;
  void db.profiles.update(profile.id, {
    rocketDesign: design,
    lastPlayedAt: Date.now(),
  });
}

function persistMissionSave(
  profile: Profile | null,
  mission: MissionProgress | null,
  design: RocketDesign,
): void {
  if (!profile) return;
  void (async () => {
    await db.missionSaves.where("profileId").equals(profile.id).delete();
    if (mission) {
      await db.missionSaves.add({
        profileId: profile.id,
        destinationId: mission.destinationId,
        state: JSON.stringify({ mission, design }),
        updatedAt: Date.now(),
      });
    }
  })();
}

export const useRocketState = create<RocketState>((set, get) => ({
  profile: null,
  design: defaultRocketDesign(),
  mission: null,
  selectedPart: null,

  setProfile: (p) => {
    setActiveProfileId(p?.id ?? null);
    set({
      profile: p,
      design: p ? { ...defaultRocketDesign(), ...p.rocketDesign } : defaultRocketDesign(),
      mission: null,
      selectedPart: null,
    });
    if (p) {
      document.title = `${p.name}'s Rocket Lab`;
    } else {
      document.title = "Rocket Lab";
    }
  },

  updateDesign: (patch) => {
    const design = { ...get().design, ...patch };
    set({ design });
    persistDesign(get().profile, design);
  },

  applyEffect: (property, value) => {
    const design = { ...get().design } as RocketDesign & Record<string, unknown>;
    if (property in design) {
      if (property === "finSymmetry" || property === "powerBalanced") {
        (design as Record<string, unknown>)[property] = value >= 0.5;
      } else {
        (design as Record<string, unknown>)[property] = value;
      }
      set({ design: design as RocketDesign });
      persistDesign(get().profile, design as RocketDesign);
    }
  },

  attachPart: (variantId) => {
    const variant = variantById(variantId);
    if (!variant) return;
    const design = { ...get().design };
    const installed: InstalledPart = {
      variantId,
      certified: false,
      attachment: variant.attachment,
      radialCount:
        variant.attachment === "radial"
          ? ((variant.stats.finCount ?? variant.stats.boosterCount ?? 2) as 2 | 3 | 4)
          : undefined,
    };
    design.installedParts = { ...design.installedParts, [variant.part]: installed };
    Object.assign(design, variant.stats);
    if (variant.part === "booster" && variant.stats.boosterCount === undefined) {
      design.boosterCount = 2;
    }
    set({ design, selectedPart: variant.part });
    persistDesign(get().profile, design);
    persistMissionSave(get().profile, get().mission, design);
  },

  detachPart: (part) => {
    const design = { ...get().design };
    const installedParts = { ...design.installedParts };
    delete installedParts[part];
    design.installedParts = installedParts;
    if (part === "booster") design.boosterCount = 0;
    set({ design, selectedPart: null });
    persistDesign(get().profile, design);
    persistMissionSave(get().profile, get().mission, design);
  },

  certifyPart: (part) => {
    const design = { ...get().design };
    const installed = design.installedParts[part];
    if (!installed) return;
    design.installedParts = {
      ...design.installedParts,
      [part]: { ...installed, certified: true },
    };
    set({ design });
    persistDesign(get().profile, design);
    persistMissionSave(get().profile, get().mission, design);
  },

  selectPart: (part) => set({ selectedPart: part }),

  startMission: (destinationId, plan) => {
    // reset certification for a fresh mission but keep the rocket assembly
    const design = { ...get().design };
    const installedParts: Partial<Record<RocketPart, InstalledPart>> = {};
    for (const [k, v] of Object.entries(design.installedParts)) {
      installedParts[k as RocketPart] = { ...(v as InstalledPart), certified: false };
    }
    design.installedParts = installedParts;
    const mission: MissionProgress = {
      destinationId,
      plan,
      tasksCorrect: 0,
      tasksTotal: 0,
      firstTryAll: true,
      checklistDone: false,
      stationTasksDone: 0,
    };
    set({ mission, design });
    persistMissionSave(get().profile, mission, design);
  },

  recordTaskResult: (correct, firstTry) => {
    const m = get().mission;
    if (!m) return;
    const mission: MissionProgress = {
      ...m,
      tasksCorrect: m.tasksCorrect + (correct ? 1 : 0),
      tasksTotal: m.tasksTotal + 1,
      firstTryAll: m.firstTryAll && correct && firstTry,
    };
    set({ mission });
    persistMissionSave(get().profile, mission, get().design);
  },

  recordStationTaskDone: () => {
    const m = get().mission;
    if (!m) return;
    const mission = { ...m, stationTasksDone: m.stationTasksDone + 1 };
    set({ mission });
    persistMissionSave(get().profile, mission, get().design);
  },

  completeChecklist: () => {
    const m = get().mission;
    if (!m) return;
    const mission = { ...m, checklistDone: true };
    set({ mission });
    persistMissionSave(get().profile, mission, get().design);
  },

  clearMission: () => {
    set({ mission: null });
    persistMissionSave(get().profile, null, get().design);
  },

  restoreMission: (m, design) => {
    set({ mission: m, design });
  },

  addXp: (xp) => {
    const p = get().profile;
    if (!p) return;
    const updated = { ...p, xp: p.xp + xp };
    set({ profile: updated });
    void db.profiles.update(p.id, { xp: updated.xp });
  },
}));

/** All attached parts certified → pre-flight can begin. */
export function allPartsCertified(design: RocketDesign): boolean {
  const parts = Object.values(design.installedParts);
  return parts.length > 0 && parts.every((p) => p?.certified);
}