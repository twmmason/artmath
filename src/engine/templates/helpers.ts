import type {
  GeneratedTask,
  MissionStation,
  RocketEffect,
  VisualSpec,
} from "../types";
import type { RocketPart } from "../../three/rocketDesign";
import { taskId } from "../rng";

interface MakeTaskArgs {
  criterionCode: string;
  rocketPart: RocketPart;
  station?: MissionStation;
  tier: number;
  briefing: string;
  notation?: string;
  engineeringContext: string;
  answer: string | number;
  choices?: (string | number)[];
  workedSteps: string[];
  hints: string[];
  visual: VisualSpec;
  rocketEffect?: Partial<RocketEffect>;
  tolerance?: number;
  acceptEquivalentFractions?: boolean;
}

/** Small factory that fills defaults & normalises answer/choices to strings. */
export function makeTask(args: MakeTaskArgs): GeneratedTask {
  const effect: RocketEffect = {
    property: args.rocketEffect?.property ?? "hullPanels",
    correctValue: args.rocketEffect?.correctValue ?? 1,
    incorrectValue: args.rocketEffect?.incorrectValue ?? 0,
    unit: args.rocketEffect?.unit ?? "",
  };
  return {
    id: taskId(args.criterionCode),
    criterionCode: args.criterionCode,
    rocketPart: args.rocketPart,
    station: args.station,
    tier: args.tier,
    briefing: args.briefing,
    notation: args.notation,
    engineeringContext: args.engineeringContext,
    answer: String(args.answer),
    choices: args.choices?.map(String),
    workedSteps: args.workedSteps,
    hints: args.hints,
    visual: args.visual,
    rocketEffect: effect,
    tolerance: args.tolerance,
    acceptEquivalentFractions: args.acceptEquivalentFractions,
  };
}

export function numberInWords(n: number): string {
  const ones = [
    "zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
    "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
    "sixteen", "seventeen", "eighteen", "nineteen",
  ];
  const tens = [
    "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy",
    "eighty", "ninety",
  ];
  if (n < 0) return `minus ${numberInWords(-n)}`;
  if (n < 20) return ones[n];
  if (n < 100) {
    const t = Math.floor(n / 10);
    const r = n % 10;
    return r ? `${tens[t]}-${ones[r]}` : tens[t];
  }
  if (n < 1000) {
    const h = Math.floor(n / 100);
    const r = n % 100;
    return r ? `${ones[h]} hundred and ${numberInWords(r)}` : `${ones[h]} hundred`;
  }
  if (n < 1_000_000) {
    const th = Math.floor(n / 1000);
    const r = n % 1000;
    return r ? `${numberInWords(th)} thousand, ${numberInWords(r)}` : `${numberInWords(th)} thousand`;
  }
  const m = Math.floor(n / 1_000_000);
  const r = n % 1_000_000;
  return r ? `${numberInWords(m)} million, ${numberInWords(r)}` : `${numberInWords(m)} million`;
}

export function formatThousands(n: number): string {
  return n.toLocaleString("en-GB");
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

export function simplifyFraction(num: number, den: number): [number, number] {
  const g = gcd(num, den) || 1;
  return [num / g, den / g];
}