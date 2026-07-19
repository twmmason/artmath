import type { GeneratedTask, Rng } from "../types";
import { makeTask } from "./helpers";
import { pick, randInt } from "../rng";

/**
 * PRE-FLIGHT CHECKLIST — rapid-fire Number Facts system checks.
 * These reuse NF criteria codes for mastery credit; they are not the primary
 * template for those criteria (the engine owns those) but generate the
 * 5-item pre-flight check run before launch.
 */

type ChecklistGen = (rng: Rng, tier: number) => GeneratedTask;

const guidance: ChecklistGen = (rng, tier) => {
  const chips = randInt(rng, 5, 9);
  const boards = randInt(rng, 4, 8);
  return makeTask({
    criterionCode: "4NF-1",
    rocketPart: "electronics",
    tier,
    briefing: `GUIDANCE: The flight computer needs ${chips} backup chips on each of its ${boards} circuit boards. How many chips must we load in total?`,
    engineeringContext: "No spare chips, no safe guidance.",
    answer: chips * boards,
    workedSteps: [
      `${boards} boards each take ${chips} chips.`,
      `${boards} groups of ${chips} make ${chips * boards}.`,
    ],
    hints: [`Use the ${chips} times table.`],
    visual: { widget: "checklist", config: { system: "guidance" } },
    rocketEffect: { property: "circuitsWired", correctValue: 5, incorrectValue: 4, unit: "" },
  });
};

const lifeSupport: ChecklistGen = (rng, tier) => {
  const per = randInt(rng, 6, 9);
  const compartments = randInt(rng, 5, 8);
  const total = per * compartments;
  return makeTask({
    criterionCode: "4NF-2",
    rocketPart: "payloadBay",
    tier,
    briefing: `LIFE SUPPORT: The capsule carries ${total} oxygen canisters shared equally across ${compartments} compartments. How many canisters per compartment?`,
    engineeringContext: "Even oxygen distribution keeps every compartment safe.",
    answer: per,
    workedSteps: [
      `Share ${total} canisters into ${compartments} equal groups.`,
      `Each compartment holds ${per}.`,
    ],
    hints: [`What number, taken ${compartments} times, makes ${total}?`],
    visual: { widget: "checklist", config: { system: "lifeSupport" } },
    rocketEffect: { property: "payloadPods", correctValue: 4, incorrectValue: 3, unit: "" },
  });
};

const comms: ChecklistGen = (rng, tier) => {
  const a = randInt(rng, 12, 28);
  const b = randInt(rng, 13, 29);
  return makeTask({
    criterionCode: "2NF-1",
    rocketPart: "electronics",
    tier,
    briefing: `COMMUNICATIONS: Antenna A draws ${a} watts and Antenna B draws ${b} watts. What is the total power draw for comms?`,
    engineeringContext: "The comms budget must fit inside the power bus.",
    answer: a + b,
    workedSteps: [`Join ${a} and ${b}: ${a + b} watts.`],
    hints: ["Join the tens first, then the ones."],
    visual: { widget: "checklist", config: { system: "comms" } },
    rocketEffect: { property: "powerBalanced", correctValue: 1, incorrectValue: 0, unit: "" },
  });
};

const power: ChecklistGen = (rng, tier) => {
  const used = randInt(rng, 25, 65);
  return makeTask({
    criterionCode: "3AS-1",
    rocketPart: "electronics",
    tier,
    briefing: `POWER: The solar panels generate 100 watts and the engine pre-heaters use ${used} watts. How much power is left for the other systems?`,
    engineeringContext: "The remaining watts run everything else on board.",
    answer: 100 - used,
    workedSteps: [`Find the complement of ${used} to 100: ${100 - used} watts.`],
    hints: [`What joins with ${used} to make 100?`],
    visual: { widget: "checklist", config: { system: "power" } },
    rocketEffect: { property: "powerBalanced", correctValue: 1, incorrectValue: 0, unit: "" },
  });
};

const navigation: ChecklistGen = (rng, tier) => {
  const sats = randInt(rng, 6, 9);
  const secs = pick(rng, [4, 5, 6, 7] as const);
  return makeTask({
    criterionCode: "3NF-2",
    rocketPart: "electronics",
    tier,
    briefing: `NAVIGATION: We must ping ${sats} satellites and each ping takes ${secs} seconds. How long until the position fix is complete, in seconds?`,
    engineeringContext: "The launch window opens once the fix is locked.",
    answer: sats * secs,
    workedSteps: [`${sats} pings of ${secs} seconds make ${sats * secs} seconds.`],
    hints: [`Count in ${secs}s, ${sats} times.`],
    visual: { widget: "checklist", config: { system: "navigation" } },
    rocketEffect: { property: "circuitsWired", correctValue: 5, incorrectValue: 4, unit: "" },
  });
};

const GENERATORS: ChecklistGen[] = [guidance, lifeSupport, comms, power, navigation];

/** Generate the 5-item pre-flight checklist. */
export function generateChecklist(rng: Rng, tier: number): GeneratedTask[] {
  return GENERATORS.map((g) => g(rng, tier));
}