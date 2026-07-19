import type { RocketPart } from "../three/rocketDesign";
import { PART_LABELS, PART_EMOJI, ALL_PARTS } from "../three/rocketDesign";

export interface StageDef {
  part: RocketPart;
  label: string;
  emoji: string;
  strandLabel: string;
}

const STRAND_LABELS: Record<RocketPart, string> = {
  noseCone: "Geometry",
  hull: "Place Value",
  fuelTank: "Place Value + Fractions",
  engine: "Number Facts + Multiplication",
  fins: "Geometry + Addition",
  payloadBay: "Fractions + Division",
  electronics: "Addition + Power Grid",
  booster: "Number Facts + Multiplication",
};

export const STAGES: StageDef[] = ALL_PARTS.map((part) => ({
  part,
  label: PART_LABELS[part],
  emoji: PART_EMOJI[part],
  strandLabel: STRAND_LABELS[part],
}));
