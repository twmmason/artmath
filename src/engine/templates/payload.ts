import type { TemplateMap } from "../types";
import { makeTask, formatThousands, gcd } from "./helpers";
import { pick, randInt } from "../rng";

/**
 * PAYLOAD BAY — Fractions + Multiplication/Division strands.
 * Covers: 3F-2, 3F-3, 3F-4, 4F-2, 4F-3, 5F-2, 6F-2, 2MD-2, 5MD-1, 5MD-2, 5MD-4
 */
export const payloadTemplates: TemplateMap = {
  "3F-2": (tier, rng) => {
    const den = pick(rng, [4, 5, 6, 8] as const);
    const loaded = randInt(rng, 1, den - 1);
    const empty = den - loaded;
    return makeTask({
      criterionCode: "3F-2",
      rocketPart: "payloadBay",
      tier,
      briefing: `The payload bay is divided into ${den} equal compartments, and ${loaded} of them are already loaded with science experiments. What fraction of the bay is still empty for more cargo?`,
      engineeringContext:
        "Mission planners fill the empty fraction with supplies on the next loading run.",
      answer: `${empty}/${den}`,
      workedSteps: [
        `The bay has ${den} equal compartments.`,
        `${loaded} are full, so ${empty} are empty.`,
        `The empty fraction is ${empty}/${den}.`,
      ],
      hints: [
        `How many compartments are NOT loaded yet?`,
        `Write that count over the total number of compartments.`,
      ],
      visual: {
        widget: "payloadSplit",
        config: { compartments: den, loaded, mode: "fraction" },
      },
      rocketEffect: {
        property: "payloadPods",
        correctValue: den,
        incorrectValue: den - 1,
        unit: "",
      },
    });
  },

  "3F-3": (tier, rng) => {
    const den = pick(rng, [2, 4] as const);
    const num = randInt(rng, 1, den - 1);
    return makeTask({
      criterionCode: "3F-3",
      rocketPart: "payloadBay",
      tier,
      briefing: `This cargo container weighs ${num}/${den} of a tonne. The loading scale runs from 0 to 1 tonne. Slide the pointer to the container's weight to check it is within the limit.`,
      engineeringContext:
        "Placing the weight on the scale shows at a glance whether the crane can lift it.",
      answer: num / den,
      workedSteps: [
        `Split the scale from 0 to 1 into ${den} equal parts.`,
        `Each part is 1/${den} of a tonne.`,
        `Count ${num} parts from 0 — that's where ${num}/${den} sits.`,
      ],
      hints: [
        `Imagine the scale cut into ${den} equal pieces.`,
        `Move ${num} pieces along from the empty end.`,
      ],
      visual: {
        widget: "numberLine",
        config: { min: 0, max: 1, target: num / den, step: 1 / den },
      },
      tolerance: 0.06,
      rocketEffect: {
        property: "payloadPerPod",
        correctValue: 50,
        incorrectValue: 40,
        unit: "kg",
      },
    });
  },

  "3F-4": (tier, rng) => {
    const den = pick(rng, [4, 5, 6, 8] as const);
    const a = randInt(rng, 1, den - 2);
    const b = randInt(rng, 1, den - a - 1);
    return makeTask({
      criterionCode: "3F-4",
      rocketPart: "payloadBay",
      tier,
      briefing: `Cargo Pod A holds ${a}/${den} of a tonne of food supplies and Pod B holds ${b}/${den} of a tonne of water. The payload arm can only lift them together if you tell it the combined weight. What is the total, as a fraction of a tonne?`,
      engineeringContext:
        "The payload arm's computer needs the exact combined load before it lifts.",
      answer: `${a + b}/${den}`,
      acceptEquivalentFractions: true,
      workedSteps: [
        `Both pods are measured in ${den}ths of a tonne.`,
        `${a} ${den}ths and ${b} ${den}ths make ${a + b} ${den}ths.`,
        `The total is ${a + b}/${den} of a tonne.`,
      ],
      hints: [
        "The bottom numbers match, so just combine the top numbers.",
        `How many ${den}ths are there altogether?`,
      ],
      visual: {
        widget: "payloadSplit",
        config: { compartments: den, loaded: a + b, mode: "addFractions" },
      },
      rocketEffect: {
        property: "payloadPerPod",
        correctValue: 50,
        incorrectValue: 42,
        unit: "kg",
      },
    });
  },

  "4F-2": (tier, rng) => {
    const den = pick(rng, [2, 3, 4] as const);
    const whole = randInt(rng, 1, 2);
    const extra = randInt(rng, 1, den - 1);
    const num = whole * den + extra;
    return makeTask({
      criterionCode: "4F-2",
      rocketPart: "payloadBay",
      tier,
      briefing: `The loading manifest says we have ${num}/${den} tonnes of equipment, but the crane display only shows mixed numbers. Write ${num}/${den} as a mixed number so the crane operator can read it.`,
      engineeringContext:
        "Two displays, one load — engineers translate between fraction styles all the time.",
      answer: `${whole} ${extra}/${den}`,
      workedSteps: [
        `Each whole tonne is ${den}/${den}.`,
        `${num}/${den} contains ${whole} whole tonne${whole === 1 ? "" : "s"} with ${extra}/${den} left over.`,
        `As a mixed number: ${whole} and ${extra}/${den}.`,
      ],
      hints: [
        `How many complete groups of ${den} fit into ${num}?`,
        "The leftovers stay as a fraction.",
      ],
      visual: {
        widget: "payloadSplit",
        config: { compartments: den, loaded: num, mode: "mixed" },
      },
      rocketEffect: {
        property: "payloadPerPod",
        correctValue: 50,
        incorrectValue: 44,
        unit: "kg",
      },
    });
  },

  "4F-3": (tier, rng) => {
    const den = 8;
    const a = randInt(rng, 1, 4);
    const b = randInt(rng, 1, 3);
    const c = den - a - b > 1 ? randInt(rng, 1, den - a - b - 1) : 1;
    return makeTask({
      criterionCode: "4F-3",
      rocketPart: "payloadBay",
      tier,
      briefing: `We're loading three types of cargo: science instruments (${a}/${den} of a tonne), crew supplies (${b}/${den} of a tonne) and communication gear (${c}/${den} of a tonne). The bay's weight computer needs the total payload weight. What is it, as a fraction of a tonne?`,
      engineeringContext:
        "The bay computer uses the total to place the rocket's centre of gravity.",
      answer: `${a + b + c}/${den}`,
      acceptEquivalentFractions: true,
      workedSteps: [
        `All three loads are measured in ${den}ths.`,
        `${a}, ${b} and ${c} ${den}ths combine to ${a + b + c} ${den}ths.`,
        `Total: ${a + b + c}/${den} of a tonne.`,
      ],
      hints: [
        "Same denominators — combine only the numerators.",
        `Count the ${den}ths: ${a}, then ${b} more, then ${c} more.`,
      ],
      visual: {
        widget: "payloadSplit",
        config: { compartments: den, loaded: a + b + c, mode: "addFractions" },
      },
      rocketEffect: {
        property: "payloadPods",
        correctValue: 4,
        incorrectValue: 3,
        unit: "",
      },
    });
  },

  "5F-2": (tier, rng) => {
    const [n1, d1, n2, d2] = pick(rng, [
      [4, 6, 2, 3],
      [6, 8, 3, 4],
      [2, 10, 1, 5],
      [4, 8, 1, 2],
    ] as const);
    return makeTask({
      criterionCode: "5F-2",
      rocketPart: "payloadBay",
      tier,
      briefing: `The payload bay capacity gauge shows ${n1}/${d1} full, but Mission Control's display shows ${n2}/${d2} full. The loading chief asks whether the two readings agree. Do they show the same fill level — yes or no?`,
      engineeringContext:
        "Two instruments reading the same bay must agree before loading continues.",
      answer: "yes",
      choices: ["yes", "no"],
      workedSteps: [
        `Scale ${n2}/${d2} up: multiply top and bottom by ${d1 / d2}.`,
        `That gives ${n1}/${d1} exactly.`,
        "The readings agree — same fill level.",
      ],
      hints: [
        "Try scaling the simpler fraction's top and bottom by the same number.",
        `What do you multiply ${d2} by to reach ${d1}?`,
      ],
      visual: {
        widget: "payloadSplit",
        config: {
          compartments: d1,
          loaded: n1,
          compareFraction: `${n2}/${d2}`,
          mode: "equivalent",
        },
      },
      rocketEffect: {
        property: "payloadPods",
        correctValue: 4,
        incorrectValue: 3,
        unit: "",
      },
    });
  },

  "6F-2": (tier, rng) => {
    const [n1, d1, n2, d2] = pick(rng, [
      [5, 8, 7, 12],
      [3, 4, 7, 10],
      [2, 3, 3, 5],
      [5, 6, 7, 9],
    ] as const);
    const xHeavier = n1 / d1 > n2 / d2;
    return makeTask({
      criterionCode: "6F-2",
      rocketPart: "payloadBay",
      tier,
      briefing: `Only one more container fits in the bay. Container X weighs ${n1}/${d1} of a tonne and Container Y weighs ${n2}/${d2} of a tonne. The crane must take the heavier one first. Which container is heavier?`,
      engineeringContext:
        "Loading heavy items first keeps the rocket balanced as the bay fills.",
      answer: xHeavier ? "X" : "Y",
      choices: ["X", "Y"],
      workedSteps: [
        `Rewrite both fractions with the common denominator ${(d1 * d2) / gcd(d1, d2)}.`,
        `X becomes ${(n1 * d2) / gcd(d1, d2)}/${(d1 * d2) / gcd(d1, d2)} and Y becomes ${(n2 * d1) / gcd(d1, d2)}/${(d1 * d2) / gcd(d1, d2)}.`,
        `The larger numerator wins: Container ${xHeavier ? "X" : "Y"} is heavier.`,
      ],
      hints: [
        "Give both fractions the same denominator, then compare the tops.",
        `A common denominator for ${d1} and ${d2} works well here.`,
      ],
      visual: {
        widget: "payloadSplit",
        config: {
          compareA: `${n1}/${d1}`,
          compareB: `${n2}/${d2}`,
          mode: "compare",
        },
      },
      rocketEffect: {
        property: "payloadPerPod",
        correctValue: 55,
        incorrectValue: 45,
        unit: "kg",
      },
    });
  },

  "2MD-2": (tier, rng) => {
    const groups = pick(rng, [2, 5, 10] as const);
    const per = randInt(rng, 2, 6);
    const total = groups * per;
    return makeTask({
      criterionCode: "2MD-2",
      rocketPart: "payloadBay",
      tier,
      briefing: `${total} supply crates have arrived at the loading dock, and they must be shared equally between the bay's ${groups} compartments so the rocket stays balanced. How many crates go in each compartment?`,
      engineeringContext:
        "An unbalanced bay tips the rocket's centre of gravity off the centre line.",
      answer: per,
      workedSteps: [
        `Share ${total} crates into ${groups} equal groups.`,
        `Deal them out one at a time, like cards.`,
        `Each compartment gets ${per} crates.`,
      ],
      hints: [
        "Deal the crates one per compartment, round and round.",
        `How many times can you deal a full round of ${groups}?`,
      ],
      visual: {
        widget: "payloadSplit",
        config: { total, groups, groupSize: per },
      },
      rocketEffect: {
        property: "payloadPods",
        correctValue: Math.min(6, groups),
        incorrectValue: 3,
        unit: "",
      },
    });
  },

  "5MD-1": (tier, rng) => {
    const pods = pick(rng, [4, 5, 8] as const);
    const per = randInt(rng, 15, 60) * 10;
    const total = pods * per;
    return makeTask({
      criterionCode: "5MD-1",
      rocketPart: "payloadBay",
      tier,
      briefing: `The total payload weighs ${formatThousands(total)} kg and must be split equally across ${pods} pods to keep the centre of gravity stable. What weight goes in each pod?`,
      engineeringContext:
        "Equal pod weights keep the rocket flying straight instead of cartwheeling.",
      answer: per,
      workedSteps: [
        `Share ${formatThousands(total)} kg among ${pods} pods.`,
        `Each pod carries ${formatThousands(per)} kg.`,
      ],
      hints: [
        "This is an equal-sharing problem.",
        `What number, taken ${pods} times, makes ${formatThousands(total)}?`,
      ],
      visual: {
        widget: "payloadSplit",
        config: { total, groups: pods, groupSize: per },
      },
      rocketEffect: {
        property: "payloadPerPod",
        correctValue: Math.min(80, per / 10),
        incorrectValue: 40,
        unit: "kg",
      },
    });
  },

  "5MD-2": (tier, rng) => {
    const n = pick(rng, [24, 36, 48, 60] as const);
    const factor = pick(rng, [4, 6, 12] as const);
    const isFactor = n % factor === 0;
    return makeTask({
      criterionCode: "5MD-2",
      rocketPart: "payloadBay",
      tier,
      briefing: `${n} sample tubes must be packed into racks with none left over, and the stores only stock racks that hold ${factor} tubes each. Will racks of ${factor} pack all ${n} tubes exactly — yes or no?`,
      engineeringContext:
        "Leftover tubes can't fly loose — the rack size must divide the batch exactly.",
      answer: isFactor ? "yes" : "no",
      choices: ["yes", "no"],
      workedSteps: [
        `Check whether ${factor} is a factor of ${n}.`,
        `Count up in ${factor}s and see whether you land exactly on ${n}.`,
        `${isFactor ? `You do — ${factor} divides ${n} exactly.` : `You don't — there would be tubes left over.`}`,
      ],
      hints: [
        `Count in ${factor}s: do you hit ${n} exactly?`,
        "A factor divides a number with nothing left over.",
      ],
      visual: {
        widget: "payloadSplit",
        config: { total: n, groups: Math.floor(n / factor), groupSize: factor },
      },
      rocketEffect: {
        property: "payloadPods",
        correctValue: 4,
        incorrectValue: 3,
        unit: "",
      },
    });
  },

  "5MD-4": (tier, rng) => {
    const divisor = randInt(rng, 3, 8);
    const quotient = randInt(rng, 120, 900);
    const total = divisor * quotient;
    return makeTask({
      criterionCode: "5MD-4",
      rocketPart: "payloadBay",
      tier,
      briefing: `A shipment of ${formatThousands(total)} kg of supplies must be carried up in ${divisor} identical cargo runs. The logistics computer needs the load for each run. How many kilograms per run?`,
      engineeringContext:
        "Every cargo run must carry the same load so the launch schedule holds.",
      answer: quotient,
      workedSteps: [
        `Share ${formatThousands(total)} kg into ${divisor} equal runs.`,
        `Use short division, digit by digit.`,
        `Each run carries ${formatThousands(quotient)} kg.`,
      ],
      hints: [
        "Set it out as a short division.",
        `Work from the biggest digit of ${formatThousands(total)} down.`,
      ],
      visual: {
        widget: "payloadSplit",
        config: { total, groups: divisor, groupSize: quotient },
      },
      rocketEffect: {
        property: "payloadPerPod",
        correctValue: 60,
        incorrectValue: 45,
        unit: "kg",
      },
    });
  },
};