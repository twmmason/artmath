import type { RocketPart } from "../three/rocketDesign";
import type { Strand } from "../curriculum/types";

/** Part → strand mapping (§6a table). */
export const PART_STRAND_MAP: Record<RocketPart, Strand[]> = {
  noseCone: ["G"],
  hull: ["NPV"],
  fuelTank: ["NPV", "F"],
  engine: ["NF", "MD"],
  fins: ["G", "AS"],
  payloadBay: ["F", "MD"],
  electronics: ["AS", "MD"],
  booster: ["NF", "MD"],
};

/** Which criterion codes each part owns for task generation. */
export const PART_CRITERIA: Record<RocketPart, string[]> = {
  noseCone: ["1G-1", "1G-2", "2G-1", "3G-1", "4G-1", "4G-2", "5G-1", "6G-1"],
  hull: ["1NPV-1", "2NPV-1", "3NPV-1", "3NPV-2", "3NPV-3", "4NPV-1", "4NPV-2", "4NPV-3", "4NPV-4", "5NPV-1", "6NPV-1", "6NPV-2", "6NPV-3"],
  fuelTank: ["1NPV-2", "2NPV-2", "2NPV-3", "3NPV-4", "5NPV-2", "5NPV-3", "5NPV-4", "6NPV-4", "3F-1", "4F-1", "5F-1", "5F-3", "6F-1", "6F-3", "6AS/MD-3"],
  engine: ["1NF-1", "1NF-2", "2NF-1", "3NF-1", "3NF-2", "3NF-3", "4NF-1", "4NF-2", "4NF-3", "5NF-1", "5NF-2", "2MD-1", "3MD-1", "3MD-2", "4MD-1", "4MD-2", "4MD-3", "5MD-3", "6MD-1"],
  fins: ["3G-2", "4G-3", "5G-2", "1AS-1", "2AS-1", "2AS-4", "3AS-1"],
  payloadBay: ["3F-2", "3F-3", "3F-4", "4F-2", "4F-3", "5F-2", "6F-2", "2MD-2", "5MD-1", "5MD-2", "5MD-4"],
  electronics: ["1AS-2", "2AS-2", "2AS-3", "3AS-2", "3AS-3", "6AS/MD-1", "6AS/MD-2", "6AS/MD-4"],
  // boosters reuse engine NF+MD templates with booster context (§ Phase 4)
  booster: ["1NF-1", "3NF-2", "4NF-1", "3MD-1", "6MD-1"],
};
