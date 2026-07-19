import type { MissionStation } from "../engine/types";
import type { Strand } from "../curriculum/types";

export interface StationConfig {
  id: MissionStation;
  name: string;
  emoji: string;
  ks3Strand: Strand;
  description: string;
  feedingStrands: string; // human label of the KS2 strands that power it
}

export const STATIONS: StationConfig[] = [
  { id: "rdLab", name: "R&D Lab", emoji: "🔬", ks3Strand: "KS3N", description: "Standard form, powers & roots, percentages, negatives, rounding & error intervals", feedingStrands: "Place Value + Number Facts" },
  { id: "guidanceComputer", name: "Guidance Computer", emoji: "🖥️", ks3Strand: "KS3A", description: "Flight programs, throttle equations, ascent-profile graphs, staging sequences", feedingStrands: "Addition & Subtraction + Y6 power grid" },
  { id: "propulsionLab", name: "Propulsion Lab", emoji: "⚗️", ks3Strand: "KS3R", description: "Propellant mixes, scale blueprints, percentage change, proportion, speed & density", feedingStrands: "Multiplication/Division + Fractions" },
  { id: "trajectoryPlanner", name: "Trajectory Planner", emoji: "🧭", ks3Strand: "KS3G", description: "Pythagoras & trig on flight paths, tank volumes, angle facts, constructions", feedingStrands: "Geometry" },
  { id: "missionAssurance", name: "Mission Assurance", emoji: "🎲", ks3Strand: "KS3P", description: "Launch-weather odds, failure analysis, Venn boards, sample spaces", feedingStrands: "any 3 stations open" },
  { id: "telemetryCentre", name: "Telemetry Centre", emoji: "📊", ks3Strand: "KS3S", description: "Flight-data averages & outliers, mass-budget charts, scatter graphs", feedingStrands: "any 3 stations + 5 missions" },
];

export function stationById(id: MissionStation): StationConfig {
  return STATIONS.find((s) => s.id === id)!;
}
