export interface MissionPatch {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export const PATCHES: MissionPatch[] = [
  { id: "first-launch", name: "First Launch", emoji: "🚀", description: "Fly your first mission" },
  { id: "moon-mission", name: "Moonshot", emoji: "🌙", description: "Complete a Moon mission" },
  { id: "mars-mission", name: "Red Planet", emoji: "🔴", description: "Complete a Mars mission" },
  { id: "streak-5", name: "5-Day Streak", emoji: "🔥", description: "Launch on 5 days in a row" },
  { id: "strand-master", name: "Systems Master", emoji: "🏅", description: "Master an entire KS2 strand" },
  { id: "perfect-mission", name: "Perfect Mission", emoji: "💯", description: "Certify every task first time in one mission" },
  { id: "station-open", name: "Power Up", emoji: "⚡", description: "Power up your first Mission Control station" },
  { id: "jupiter-mission", name: "Giant Leap", emoji: "🪐", description: "Complete a Jupiter mission" },
  { id: "secondary-ready", name: "Secondary-Ready", emoji: "🎓", description: "Open all six Mission Control stations" },
  { id: "ks3-domain", name: "Advanced Systems", emoji: "🧠", description: "Master a whole KS3 domain" },
  { id: "interstellar", name: "Starfarer", emoji: "🌌", description: "Complete an Interstellar launch" },
];

export function patchById(id: string): MissionPatch | undefined {
  return PATCHES.find((p) => p.id === id);
}
