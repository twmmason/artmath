export type RocketPart =
  | "noseCone"
  | "hull"
  | "fuelTank"
  | "engine"
  | "fins"
  | "payloadBay"
  | "electronics"
  | "booster";

export const ALL_PARTS: RocketPart[] = [
  "noseCone",
  "hull",
  "fuelTank",
  "engine",
  "fins",
  "payloadBay",
  "electronics",
  "booster",
];

export interface InstalledPart {
  variantId: string;
  certified: boolean;
  attachment: "stack" | "radial";
  radialCount?: 2 | 3 | 4;
}

export interface RocketDesign {
  noseAngle: number; // degrees (tip angle)
  noseHeight: number; // metres
  hullHeight: number; // metres
  hullRadius: number; // metres
  hullPanels: number;
  tankFill: number; // 0..1
  fuelRatio: number; // fuel:oxidiser
  engineCount: number;
  thrustPerEngine: number; // kN
  finCount: number;
  finAngle: number; // degrees
  finSymmetry: boolean;
  payloadPods: number;
  payloadPerPod: number;
  circuitsWired: number;
  powerBalanced: boolean;
  boosterCount: number;
  installedParts: Partial<Record<RocketPart, InstalledPart>>;
}

export function defaultRocketDesign(): RocketDesign {
  return {
    noseAngle: 40,
    noseHeight: 2,
    hullHeight: 8,
    hullRadius: 1,
    hullPanels: 40,
    tankFill: 0.75,
    fuelRatio: 2.5,
    engineCount: 2,
    thrustPerEngine: 300,
    finCount: 3,
    finAngle: 0,
    finSymmetry: true,
    payloadPods: 4,
    payloadPerPod: 50,
    circuitsWired: 0,
    powerBalanced: false,
    boosterCount: 0,
    installedParts: {},
  };
}

export const PART_LABELS: Record<RocketPart, string> = {
  noseCone: "Nose Cone",
  hull: "Hull",
  fuelTank: "Fuel Tank",
  engine: "Engine",
  fins: "Fins",
  payloadBay: "Payload Bay",
  electronics: "Electronics Bay",
  booster: "Boosters",
};

export const PART_EMOJI: Record<RocketPart, string> = {
  noseCone: "📐",
  hull: "🛢️",
  fuelTank: "⛽",
  engine: "🔧",
  fins: "🪽",
  payloadBay: "📦",
  electronics: "🔌",
  booster: "🧨",
};