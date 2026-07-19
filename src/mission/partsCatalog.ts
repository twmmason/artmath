import type { RocketPart, RocketDesign } from "../three/rocketDesign";

export interface PartVariant {
  id: string;
  part: RocketPart;
  name: string;
  description: string;
  stats: Partial<RocketDesign>;
  unlockLevel: 1 | 2 | 3;
  attachment: "stack" | "radial";
}

export const PARTS_CATALOG: PartVariant[] = [
  // NOSE CONES
  { id: "stubby-cone", part: "noseCone", name: "Stubby Cone", description: "Forgiving and tough, but drags through the air", stats: { noseAngle: 70, noseHeight: 1.4 }, unlockLevel: 1, attachment: "stack" },
  { id: "standard-cone", part: "noseCone", name: "Standard Cone", description: "The all-rounder every rocket starts with", stats: { noseAngle: 45, noseHeight: 2 }, unlockLevel: 1, attachment: "stack" },
  { id: "needle-cone-mk2", part: "noseCone", name: "Needle Cone Mk2", description: "Ultra-low drag — needs precise angle work", stats: { noseAngle: 25, noseHeight: 2.8 }, unlockLevel: 2, attachment: "stack" },
  // HULLS
  { id: "hull-short", part: "hull", name: "Scout Hull", description: "Short and light — quick to orbit", stats: { hullHeight: 6, hullRadius: 0.9, hullPanels: 40 }, unlockLevel: 1, attachment: "stack" },
  { id: "hull-standard", part: "hull", name: "Voyager Hull", description: "Balanced height and mass", stats: { hullHeight: 8, hullRadius: 1, hullPanels: 60 }, unlockLevel: 1, attachment: "stack" },
  { id: "hull-heavy", part: "hull", name: "Titan Hull", description: "Huge fuel volume, heavy frame", stats: { hullHeight: 11, hullRadius: 1.3, hullPanels: 90 }, unlockLevel: 2, attachment: "stack" },
  // FUEL TANKS
  { id: "tank-standard", part: "fuelTank", name: "Standard Tank", description: "Reliable everyday propellant tank", stats: { tankFill: 0.75, fuelRatio: 2.5 }, unlockLevel: 1, attachment: "stack" },
  { id: "tank-cryo", part: "fuelTank", name: "Cryo Tank", description: "Dense super-cooled fuel — more push per litre", stats: { tankFill: 0.85, fuelRatio: 3 }, unlockLevel: 2, attachment: "stack" },
  // ENGINES
  { id: "engine-hound", part: "engine", name: "Hound", description: "Low thrust, light and thrifty", stats: { engineCount: 2, thrustPerEngine: 220 }, unlockLevel: 1, attachment: "stack" },
  { id: "engine-mastiff", part: "engine", name: "Mastiff", description: "High thrust, heavy beast", stats: { engineCount: 2, thrustPerEngine: 380 }, unlockLevel: 1, attachment: "stack" },
  { id: "engine-wolfpack", part: "engine", name: "Wolfpack Cluster", description: "Four engines — maximum liftoff muscle", stats: { engineCount: 4, thrustPerEngine: 300 }, unlockLevel: 3, attachment: "stack" },
  // FINS
  { id: "fins-tri", part: "fins", name: "Tri-Fin Set", description: "Three fins — the stable minimum", stats: { finCount: 3, finSymmetry: true, finAngle: 0 }, unlockLevel: 1, attachment: "radial" },
  { id: "fins-quad", part: "fins", name: "Quad-Fin Set", description: "Four fins for rock-solid stability", stats: { finCount: 4, finSymmetry: true, finAngle: 0 }, unlockLevel: 2, attachment: "radial" },
  // PAYLOAD BAYS
  { id: "bay-quad", part: "payloadBay", name: "Quad Bay", description: "Four balanced cargo pods", stats: { payloadPods: 4, payloadPerPod: 50 }, unlockLevel: 1, attachment: "stack" },
  { id: "bay-hex", part: "payloadBay", name: "Hex Bay", description: "Six pods for bigger science hauls", stats: { payloadPods: 6, payloadPerPod: 50 }, unlockLevel: 2, attachment: "stack" },
  // ELECTRONICS
  { id: "elec-basic", part: "electronics", name: "Avionics Rack", description: "Core guidance and power circuits", stats: { circuitsWired: 0, powerBalanced: false }, unlockLevel: 1, attachment: "stack" },
  { id: "elec-pro", part: "electronics", name: "ProNav Suite", description: "Extra sensor buses and smart routing", stats: { circuitsWired: 0, powerBalanced: false }, unlockLevel: 2, attachment: "stack" },
  // BOOSTERS
  { id: "booster-solid", part: "booster", name: "Solid Booster", description: "Big early thrust, jettisoned at staging", stats: { boosterCount: 2 }, unlockLevel: 1, attachment: "radial" },
  { id: "booster-heavy", part: "booster", name: "Heavy Booster", description: "Maximum kick off the pad", stats: { boosterCount: 3 }, unlockLevel: 2, attachment: "radial" },
];

export function variantById(id: string): PartVariant | undefined {
  return PARTS_CATALOG.find((v) => v.id === id);
}

export function variantsForPart(part: RocketPart): PartVariant[] {
  return PARTS_CATALOG.filter((v) => v.part === part);
}
