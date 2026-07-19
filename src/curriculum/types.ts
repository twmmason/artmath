export type KeyStage = "KS1" | "KS2" | "KS3";

export type Strand =
  | "NPV" // Number & Place Value
  | "NF" // Number Facts
  | "AS" // Addition & Subtraction
  | "MD" // Multiplication & Division (incl. 6AS/MD)
  | "F" // Fractions
  | "G" // Geometry
  // KS3 domains
  | "KS3N"
  | "KS3A"
  | "KS3R"
  | "KS3G"
  | "KS3P"
  | "KS3S";

export interface Criterion {
  code: string; // e.g. "3NPV-1", "KS3A-7"
  strand: Strand;
  keyStage: KeyStage;
  year: number; // 1–6 for KS1/KS2; 7 for KS3 statements
  description: string;
}

export const KS2_STRANDS: Strand[] = ["NPV", "NF", "AS", "MD", "F", "G"];
export const KS3_STRANDS: Strand[] = [
  "KS3N",
  "KS3A",
  "KS3R",
  "KS3G",
  "KS3P",
  "KS3S",
];