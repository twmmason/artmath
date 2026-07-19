import type { RocketPart } from "./rocketDesign";

export interface ZoneMaterial {
  color: string;
  roughness: number;
  metalness: number;
  opacity?: number;
  transparent?: boolean;
}

export const PART_MATERIALS: Record<RocketPart, ZoneMaterial> = {
  noseCone: { color: "#e8ecff", roughness: 0.3, metalness: 0.4 },
  hull: { color: "#aab7f0", roughness: 0.5, metalness: 0.3 },
  fuelTank: { color: "#22d3ee", roughness: 0.2, metalness: 0.1, opacity: 0.55, transparent: true },
  engine: { color: "#5b6690", roughness: 0.4, metalness: 0.6 },
  fins: { color: "#f472b6", roughness: 0.5, metalness: 0.2 },
  payloadBay: { color: "#a78bfa", roughness: 0.4, metalness: 0.3 },
  electronics: { color: "#34d399", roughness: 0.35, metalness: 0.5 },
  booster: { color: "#fbbf24", roughness: 0.45, metalness: 0.4 },
};
