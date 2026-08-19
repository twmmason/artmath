import type { TemplateMap } from "../../types";
import { makeTask, simplifyFraction, formatThousands } from "../helpers";
import { pick, randInt } from "../../rng";

/**
 * PROPULSION LAB — KS3 Ratio, Proportion & Rates of Change
 * (KS3R-1 … KS3R-10), station "propulsionLab".
 */
export const propulsionLabTemplates: TemplateMap = {
  "KS3R-1": (tier, rng) => {
    const m3 = randInt(rng, 2, 9) / 10 + randInt(rng, 0, 2) / 100;
    const litres = Math.round(m3 * 1000);
    return makeTask({
      criterionCode: "KS3R-1",
      rocketPart: "fuelTank",
      station: "propulsionLab",
      tier,
      briefing: `The transfer pump has moved ${m3} m³ of oxidiser into the vat, but the vat's gauge reads in litres. What should the gauge show?`,
      engineeringContext:
        "Pumps and gauges use different units — converting between them is daily lab work.",
      answer: litres,
      workedSteps: [
        "One cubic metre holds 1,000 litres.",
        `${m3} m³ is ${formatThousands(litres)} litres.`,
      ],
      hints: [
        "A cubic metre is a 1 m box — it holds 1,000 litres.",
        `Scale ${m3} up by a thousand.`,
      ],
      visual: { widget: "fuelGauge", config: { capacity: 1000, level: Math.min(litres, 1000), mode: "quantity" } },
      rocketEffect: { property: "tankFill", correctValue: 0.8, incorrectValue: 0.6, unit: "" },
    });
  },

  "KS3R-2": (tier, rng) => {
    const scale = pick(rng, [100, 200, 50] as const);
    const paperCm = randInt(rng, 20, 60) / 10;
    const realM = (paperCm * scale) / 100;
    return makeTask({
      criterionCode: "KS3R-2",
      rocketPart: "hull",
      station: "propulsionLab",
      tier,
      briefing: `The blueprint on the table is drawn at a scale of 1 to ${scale}. The hull measures ${paperCm} cm on the paper. How tall is the real rocket hull, in metres?`,
      engineeringContext:
        "Scale drawings let a 60-metre rocket fit on a workbench.",
      answer: realM,
      workedSteps: [
        `Every 1 cm on paper is ${scale} cm in real life.`,
        `${paperCm} cm on paper is ${paperCm * scale} cm — that's ${realM} m.`,
      ],
      hints: [
        `Scale the paper measurement up ${scale} times.`,
        "Then convert centimetres to metres.",
      ],
      visual: { widget: "scaleDiagram", config: { scale, paperCm } },
      tolerance: 0.02,
      rocketEffect: { property: "hullHeight", correctValue: Math.min(12, realM), incorrectValue: 7, unit: "m" },
    });
  },

  "KS3R-3": (tier, rng) => {
    const oldCap = pick(rng, [600, 400, 800] as const);
    const newCap = oldCap * pick(rng, [1.5, 1.25, 0.75] as const);
    const [n, d] = simplifyFraction(newCap, oldCap);
    return makeTask({
      criterionCode: "KS3R-3",
      rocketPart: "fuelTank",
      station: "propulsionLab",
      tier,
      briefing: `The upgraded tank holds ${newCap} litres; the old one held ${oldCap} litres. The upgrade report expresses the new capacity as a fraction of the old, in simplest form. What fraction is that?`,
      engineeringContext:
        "Comparing capacities as a fraction shows the true size of the upgrade.",
      answer: `${n}/${d}`,
      workedSteps: [
        `Write the comparison as ${newCap} over ${oldCap}.`,
        `Cancel common factors to reach ${n}/${d}.`,
      ],
      hints: [
        "Put the new capacity over the old capacity.",
        "Then simplify the fraction fully.",
      ],
      visual: { widget: "ratioMixer", config: { ratioA: n, ratioB: d, totalA: newCap } },
      rocketEffect: { property: "tankFill", correctValue: 0.85, incorrectValue: 0.7, unit: "" },
    });
  },

  "KS3R-4": (tier, rng) => {
    const g = pick(rng, [40, 60, 80] as const);
    const a = pick(rng, [2, 3] as const);
    const b = pick(rng, [1, 2] as const);
    const fuelL = a * g;
    const oxL = b * g;
    const [sa, sb] = simplifyFraction(fuelL, oxL);
    return makeTask({
      criterionCode: "KS3R-4",
      rocketPart: "fuelTank",
      station: "propulsionLab",
      tier,
      briefing: `The mixing vat combined ${fuelL} litres of fuel with ${oxL} litres of oxidiser. The propellant label must show the mix ratio in simplest form (like 3:2). What ratio goes on the label?`,
      engineeringContext:
        "Labels use simplest-form ratios so any batch size can copy the mix.",
      answer: `${sa}:${sb}`,
      workedSteps: [
        `Start with the ratio ${fuelL} to ${oxL}.`,
        `Divide both sides by their common factor to get ${sa}:${sb}.`,
      ],
      hints: [
        "Find the biggest number that divides both amounts.",
        "Divide both sides of the ratio by it.",
      ],
      visual: { widget: "ratioMixer", config: { ratioA: sa, ratioB: sb, totalA: fuelL } },
      rocketEffect: { property: "fuelRatio", correctValue: sa / sb, incorrectValue: 2, unit: "" },
    });
  },

  "KS3R-5": (tier, rng) => {
    const [a, b] = pick(rng, [
      [7, 3],
      [3, 2],
      [4, 1],
      [5, 3],
    ] as const);
    const total = (a + b) * randInt(rng, 20, 60);
    const fuelPart = (total / (a + b)) * a;
    return makeTask({
      criterionCode: "KS3R-5",
      rocketPart: "fuelTank",
      station: "propulsionLab",
      tier,
      briefing: `Mix ${total} litres of propellant at a fuel to oxidiser ratio of ${a} to ${b}. How many litres of FUEL go into the vat?`,
      engineeringContext:
        "Dividing the batch in the right ratio keeps the burn stable.",
      answer: fuelPart,
      workedSteps: [
        `The ratio has ${a + b} equal parts in total.`,
        `Each part is ${total / (a + b)} litres, and fuel takes ${a} parts: ${fuelPart} litres.`,
      ],
      hints: [
        `How many parts does the whole mix split into?`,
        "Work out one part first, then scale up to the fuel's share.",
      ],
      visual: { widget: "ratioMixer", config: { ratioA: a, ratioB: b, total } },
      rocketEffect: { property: "fuelRatio", correctValue: a / b, incorrectValue: 2, unit: "" },
    });
  },

  "KS3R-6": (tier, rng) => {
    const [f, o] = pick(rng, [
      [2, 5],
      [4, 10],
      [2, 3],
      [5, 8],
    ] as const);
    const answer = o / f;
    return makeTask({
      criterionCode: "KS3R-6",
      rocketPart: "fuelTank",
      station: "propulsionLab",
      tier,
      briefing: `Every ${f} kg of fuel needs ${o} kg of oxidiser. The loading computer wants this relationship as a single multiplier: fuel mass, scaled by what number, gives oxidiser mass?`,
      engineeringContext:
        "One multiplier lets the computer handle any fuel load instantly.",
      answer,
      workedSteps: [
        `The multiplier is oxidiser per unit of fuel: ${o} shared by ${f}.`,
        `That gives ${answer}.`,
      ],
      hints: [
        "Find the oxidiser needed for just 1 kg of fuel.",
        `Share ${o} between the ${f} kilograms of fuel.`,
      ],
      visual: { widget: "ratioMixer", config: { ratioA: f, ratioB: o, mode: "multiplier" } },
      tolerance: 0.02,
      rocketEffect: { property: "fuelRatio", correctValue: answer, incorrectValue: 2, unit: "" },
    });
  },

  "KS3R-7": (tier, rng) => {
    const [x1, y1] = [2, 5];
    void rng;
    return makeTask({
      criterionCode: "KS3R-7",
      rocketPart: "fuelTank",
      station: "propulsionLab",
      tier,
      briefing: `The mix line on the lab graph passes through the points (${x1}, ${y1}) and (${x1 * 2}, ${y1 * 2}) — fuel litres across, oxidiser litres up. Its steepness tells you the oxidiser needed per litre of fuel. What is that steepness, as a decimal?`,
      engineeringContext:
        "A straight line through the origin is a ratio drawn as a picture.",
      answer: y1 / x1,
      workedSteps: [
        `Steepness is the up-step for each across-step: ${y1} up for ${x1} across.`,
        `That is ${y1 / x1} litres of oxidiser per litre of fuel.`,
      ],
      hints: [
        "Steepness is rise shared by run.",
        `How much does the line climb for ONE litre of fuel?`,
      ],
      visual: { widget: "graph", config: { mode: "ratioLine", x1, y1 } },
      tolerance: 0.02,
      rocketEffect: { property: "fuelRatio", correctValue: y1 / x1, incorrectValue: 2, unit: "" },
    });
  },

  "KS3R-8": (tier, rng) => {
    const pct = pick(rng, [20, 25, 40] as const);
    const original = pick(rng, [120, 160, 200, 240] as const);
    const after = original * (1 - pct / 100);
    return makeTask({
      criterionCode: "KS3R-8",
      rocketPart: "fins",
      station: "propulsionLab",
      tier,
      briefing: `After a ${pct}% mass-saving redesign, the fin assembly now weighs ${after} kg. The certification file needs the ORIGINAL weight before the redesign. What was it, in kg?`,
      engineeringContext:
        "Reverse percentage problems recover lost paperwork from current measurements.",
      answer: original,
      workedSteps: [
        `After saving ${pct}%, the assembly keeps ${100 - pct}% of its original mass.`,
        `${after} kg is ${100 - pct}% — so 1% is ${after / (100 - pct)} kg and 100% is ${original} kg.`,
      ],
      hints: [
        `The current weight is only ${100 - pct}% of the original.`,
        "Find 1% first, then scale to 100%.",
      ],
      visual: { widget: "dataChart", config: { mode: "percentBar", total: original, pct } },
      rocketEffect: { property: "finCount", correctValue: 4, incorrectValue: 3, unit: "" },
    });
  },

  "KS3R-9": (tier, rng) => {
    const pumps = 2;
    const [mins, target] = pick(rng, [
      [30, 12],
      [24, 8],
      [36, 6],
      [30, 6],
    ] as const);
    const answer = (pumps * mins) / target;
    return makeTask({
      criterionCode: "KS3R-9",
      rocketPart: "fuelTank",
      station: "propulsionLab",
      tier,
      briefing: `With ${pumps} pumps running, the tank fills in ${mins} minutes. The launch window closes in just ${target} minutes. How many pumps does the pad crew need to fill the tank in time?`,
      engineeringContext:
        "More pumps, less time — an inverse proportion the pad crew lives by.",
      answer,
      workedSteps: [
        `The whole job takes ${pumps * mins} pump-minutes.`,
        `To finish in ${target} minutes needs ${answer} pumps.`,
      ],
      hints: [
        "Doubling the pumps halves the time.",
        `How much total pump effort does the job take?`,
      ],
      visual: { widget: "graph", config: { mode: "inverse", k: pumps * mins } },
      rocketEffect: { property: "tankFill", correctValue: 0.9, incorrectValue: 0.6, unit: "" },
    });
  },

  "KS3R-10": (tier, rng) => {
    const dist = 384000;
    const hours = pick(rng, [80, 96, 120] as const);
    const answer = dist / hours;
    void rng;
    return makeTask({
      criterionCode: "KS3R-10",
      rocketPart: "engine",
      station: "propulsionLab",
      tier,
      briefing: `The probe must cover the ${formatThousands(dist)} km to the Moon in ${hours} hours. What average speed must the guidance computer hold, in km per hour?`,
      engineeringContext:
        "Average speed is the compound unit every trajectory is planned around.",
      answer,
      workedSteps: [
        "Average speed is distance shared over time.",
        `${formatThousands(dist)} km over ${hours} hours gives ${formatThousands(answer)} km per hour.`,
      ],
      hints: [
        "Speed is how far you go in ONE hour.",
        `Share the full distance across the ${hours} hours.`,
      ],
      visual: { widget: "equation", config: { formula: `speed = distance ÷ time` } },
      rocketEffect: { property: "thrustPerEngine", correctValue: 350, incorrectValue: 300, unit: "kN" },
    });
  },
};