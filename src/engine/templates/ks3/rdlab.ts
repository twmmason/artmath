import type { TemplateMap } from "../../types";
import { makeTask, formatThousands } from "../helpers";
import { pick, randInt } from "../../rng";

/**
 * R&D LAB — KS3 Number (KS3N-1 … KS3N-16), station "rdLab".
 * Operation symbols are permitted ONLY inside the `notation` field.
 */
export const rdlabTemplates: TemplateMap = {
  "KS3N-1": (tier, rng) => {
    const bodies = [
      { name: "the Moon", dist: 384400 },
      { name: "Mars at closest approach", dist: 54600000 },
      { name: "the Sun", dist: 149600000 },
    ] as const;
    const b = pick(rng, bodies);
    const s = String(b.dist);
    const idx = randInt(rng, 0, s.length - 1);
    const digit = Number(s[idx]);
    const value = digit * Math.pow(10, s.length - 1 - idx);
    return makeTask({
      criterionCode: "KS3N-1",
      rocketPart: "hull",
      station: "rdLab",
      tier,
      briefing: `The nav computer stores the distance to ${b.name} as ${formatThousands(b.dist)} km. The systems check asks for the value of the digit ${digit} in that reading (the one ${s.length - 1 - idx === 0 ? "in the ones place" : `${s.length - 1 - idx} places from the right`}). What is that digit worth?`,
      engineeringContext:
        "Navigation distances span millions of kilometres — every place value matters.",
      answer: value,
      workedSteps: [
        `Locate the digit ${digit} in ${formatThousands(b.dist)}.`,
        `Its place is worth ${formatThousands(Math.pow(10, s.length - 1 - idx))}, so the digit is worth ${formatThousands(value)}.`,
      ],
      hints: [
        "Write the number in a place-value grid first.",
        "A digit's value is its face value scaled by its column.",
      ],
      visual: { widget: "numberLine", config: { min: 0, max: b.dist, target: value, step: value || 1 } },
      rocketEffect: { property: "hullPanels", correctValue: 60, incorrectValue: 55, unit: "" },
    });
  },

  "KS3N-2": (tier, rng) => {
    const temps = [
      -randInt(rng, 2, 9),
      randInt(rng, 1, 5),
      -randInt(rng, 1, 6),
      randInt(rng, 0, 3),
    ];
    const sorted = [...temps].sort((a, b) => a - b);
    return makeTask({
      criterionCode: "KS3N-2",
      rocketPart: "fuelTank",
      station: "rdLab",
      tier,
      briefing: `Overnight pad temperatures were logged as ${temps.map((t) => `${t}°C`).join(", ")}. The cryogenics report lists them coldest first. Type them in order, coldest to warmest, separated by commas.`,
      notation: `${sorted.join(" < ")}`,
      engineeringContext:
        "Cryogenic fuel handling rules depend on the coldest overnight reading.",
      answer: sorted.join(", "),
      workedSteps: [
        "On the thermometer, negative readings sit below zero — more negative means colder.",
        `Ordered coldest first: ${sorted.join(", ")}.`,
      ],
      hints: [
        "Picture a vertical thermometer: which reading is lowest?",
        "Between two negatives, the bigger-looking number is actually colder.",
      ],
      visual: { widget: "numberLine", config: { min: -10, max: 10, target: sorted[0], step: 1 } },
      rocketEffect: { property: "tankFill", correctValue: 0.8, incorrectValue: 0.6, unit: "" },
    });
  },

  "KS3N-3": (tier, rng) => {
    const [a, b] = pick(rng, [
      [12, 18],
      [8, 12],
      [15, 20],
      [6, 10],
      [14, 21],
    ] as const);
    const lcm = (a * b) / (function g(x: number, y: number): number { return y ? g(y, x % y) : x; })(a, b);
    return makeTask({
      criterionCode: "KS3N-3",
      rocketPart: "booster",
      station: "rdLab",
      tier,
      briefing: `Booster A sends a check-pulse every ${a} seconds and Booster B every ${b} seconds. Both pulsed together at ignition, and the sync computer needs the first moment they pulse together again. After how many seconds is that?`,
      engineeringContext:
        "Synchronised pulses confirm both boosters share one clock.",
      answer: lcm,
      workedSteps: [
        `List multiples of ${a} and of ${b}.`,
        `The first number in both lists is ${lcm} — the lowest common multiple.`,
      ],
      hints: [
        `Write out the times Booster A pulses, then Booster B.`,
        "Look for the first time that appears in both lists.",
      ],
      visual: { widget: "numberLine", config: { min: 0, max: lcm * 2, target: lcm, step: a } },
      rocketEffect: { property: "boosterCount", correctValue: 2, incorrectValue: 1, unit: "" },
    });
  },

  "KS3N-4": (tier, rng) => {
    const start = -(randInt(rng, 20, 50) / 10);
    const rate = randInt(rng, 5, 12) / 10;
    const mins = randInt(rng, 3, 6);
    const answer = Math.round((start + rate * mins) * 10) / 10;
    return makeTask({
      criterionCode: "KS3N-4",
      rocketPart: "electronics",
      station: "rdLab",
      tier,
      briefing: `After the cold soak the probe's battery reads ${start} V, and the heater raises the reading by ${rate} V every minute. What will the battery read after ${mins} minutes of heating?`,
      engineeringContext:
        "The probe can't boot until its battery climbs back above zero volts.",
      answer,
      workedSteps: [
        `${mins} minutes of heating adds ${Math.round(rate * mins * 10) / 10} V.`,
        `Starting from ${start} V, the reading climbs to ${answer} V.`,
      ],
      hints: [
        "Work out the total voltage gained first.",
        `Then climb up from ${start} on a number line.`,
      ],
      visual: { widget: "numberLine", config: { min: -6, max: 6, target: answer, step: 0.1 } },
      tolerance: 0.05,
      rocketEffect: { property: "powerBalanced", correctValue: 1, incorrectValue: 0, unit: "" },
    });
  },

  "KS3N-5": (tier, rng) => {
    const a = randInt(rng, 2, 6);
    const b = randInt(rng, 2, 6);
    const k = randInt(rng, 2, 4);
    const answer = k * (a + 2 * b);
    return makeTask({
      criterionCode: "KS3N-5",
      rocketPart: "electronics",
      station: "rdLab",
      tier,
      briefing: `The rig's power formula is shown on the console. With a set to ${a} and b set to ${b}, what power does the rig deliver, in watts?`,
      notation: `P = ${k}(a + 2b)`,
      engineeringContext:
        "The brackets in the formula tell the rig which part to work out first.",
      answer,
      workedSteps: [
        `Inside the brackets first: a plus double b gives ${a + 2 * b}.`,
        `Then scale by ${k}: the rig delivers ${answer} watts.`,
      ],
      hints: [
        "Brackets first — always.",
        `Double b before joining it with a.`,
      ],
      visual: { widget: "equation", config: { formula: `P = ${k}(a + 2b)`, a, b } },
      rocketEffect: { property: "powerBalanced", correctValue: 1, incorrectValue: 0, unit: "" },
    });
  },

  "KS3N-6": (tier, rng) => {
    const factor = pick(rng, [8, 12, 16] as const);
    const original = randInt(rng, 7, 25);
    const result = factor * original;
    return makeTask({
      criterionCode: "KS3N-6",
      rocketPart: "electronics",
      station: "rdLab",
      tier,
      briefing: `The signal scaler multiplied an incoming signal by ${factor} and the output shows ${result} units. Work backwards to recover the original signal strength. What was it?`,
      engineeringContext:
        "Inverse operations let engineers reconstruct raw sensor data.",
      answer: original,
      workedSteps: [
        `The inverse of scaling by ${factor} is sharing by ${factor}.`,
        `${result} shared by ${factor} recovers ${original} units.`,
      ],
      hints: [
        "Undo the scaling with its inverse.",
        `What number, scaled ${factor} times, gives ${result}?`,
      ],
      visual: { widget: "equation", config: { formula: `? × ${factor} = ${result}` } },
      rocketEffect: { property: "circuitsWired", correctValue: 5, incorrectValue: 4, unit: "" },
    });
  },

  "KS3N-7": (tier, rng) => {
    const edge = pick(rng, [9, 11, 12, 13, 15] as const);
    const area = edge * edge;
    return makeTask({
      criterionCode: "KS3N-7",
      rocketPart: "noseCone",
      station: "rdLab",
      tier,
      briefing: `The heat-shield is a square panel with an area of ${area} dm². The workshop cuts panels by edge length. What edge length should they cut, in dm?`,
      engineeringContext:
        "Heat-shield panels are specified by area but cut by edge.",
      answer: edge,
      workedSteps: [
        `The edge length is the square root of the area.`,
        `${edge} squared makes ${area}, so the edge is ${edge} dm.`,
      ],
      hints: [
        "A square's area is its edge length used twice.",
        `Which number, squared, gives ${area}?`,
      ],
      visual: { widget: "equation", config: { formula: `edge² = ${area}` } },
      rocketEffect: { property: "noseAngle", correctValue: 40, incorrectValue: 50, unit: "°" },
    });
  },

  "KS3N-8": (tier, rng) => {
    const bodies = [
      { name: "Mars at closest approach", a: 2.25, n: 8, plain: 225000000 },
      { name: "the Sun", a: 1.5, n: 8, plain: 150000000 },
      { name: "Jupiter at closest approach", a: 5.9, n: 8, plain: 590000000 },
    ] as const;
    const b = pick(rng, bodies);
    return makeTask({
      criterionCode: "KS3N-8",
      rocketPart: "hull",
      station: "rdLab",
      tier,
      briefing: `The wall display shows the distance to ${b.name} as ${formatThousands(b.plain)} km, but the nav computer only accepts standard form. Enter the distance in the form shown, giving the value of A (n is ${b.n}).`,
      notation: `A × 10ⁿ`,
      engineeringContext:
        "Standard form keeps astronomical distances short enough for the computer's display.",
      answer: b.a,
      workedSteps: [
        `Move the decimal point until one non-zero digit sits before it: ${b.a}.`,
        `It moved ${b.n} places, so the distance is ${b.a} with n as ${b.n}.`,
      ],
      hints: [
        "Slide the decimal point until the number is between 1 and 10.",
        "Count how many places it slid — that's the power.",
      ],
      visual: { widget: "equation", config: { formula: `${formatThousands(b.plain)} = A × 10^${b.n}` } },
      tolerance: 0.001,
      rocketEffect: { property: "hullHeight", correctValue: 9, incorrectValue: 8, unit: "m" },
    });
  },

  "KS3N-9": (tier, rng) => {
    const opts = [
      { dec: "0.375", frac: "3/8" },
      { dec: "0.625", frac: "5/8" },
      { dec: "0.125", frac: "1/8" },
      { dec: "0.4", frac: "2/5" },
      { dec: "0.75", frac: "3/4" },
    ] as const;
    const o = pick(rng, opts);
    return makeTask({
      criterionCode: "KS3N-9",
      rocketPart: "fuelTank",
      station: "rdLab",
      tier,
      briefing: `The flow valve must open ${o.dec} of a full turn, but its mechanical dial is marked only in fractions. What fraction of a turn should the technician set?`,
      engineeringContext:
        "Old mechanical dials and new digital readouts must say the same thing.",
      answer: o.frac,
      acceptEquivalentFractions: false,
      workedSteps: [
        `Write ${o.dec} as thousandths (or tenths) over a power of ten.`,
        `Cancel common factors to reach ${o.frac}.`,
      ],
      hints: [
        "Turn the decimal into a fraction over 10, 100 or 1000 first.",
        "Then simplify it fully.",
      ],
      visual: { widget: "fuelGauge", config: { capacity: 1, level: Number(o.dec), mode: "decimalToFraction" } },
      rocketEffect: { property: "fuelRatio", correctValue: 2.5, incorrectValue: 2.2, unit: "" },
    });
  },

  "KS3N-10": (tier, rng) => {
    const mass = pick(rng, [240, 320, 480, 560] as const);
    const pct = pick(rng, [10, 15, 20, 25] as const);
    const answer = mass - (mass * pct) / 100;
    return makeTask({
      criterionCode: "KS3N-10",
      rocketPart: "fuelTank",
      station: "rdLab",
      tier,
      briefing: `The Mk2 tank upgrade cut the dry mass by ${pct}% from ${mass} kg. The certification plate needs the new mass. What should it say, in kg?`,
      engineeringContext:
        "Every kilogram saved on dry mass is a kilogram more payload.",
      answer,
      workedSteps: [
        `${pct}% of ${mass} kg is ${(mass * pct) / 100} kg.`,
        `Removing that saving leaves ${answer} kg.`,
      ],
      hints: [
        `Find ${pct}% of the old mass first.`,
        "Then take that saving away from the original.",
      ],
      visual: { widget: "dataChart", config: { mode: "percentBar", total: mass, pct } },
      rocketEffect: { property: "tankFill", correctValue: 0.85, incorrectValue: 0.7, unit: "" },
    });
  },

  "KS3N-11": (tier, rng) => {
    const max = pick(rng, [340, 420, 480] as const);
    const pct = pick(rng, [75, 80, 85, 90] as const);
    const answer = (max * pct) / 100;
    return makeTask({
      criterionCode: "KS3N-11",
      rocketPart: "engine",
      station: "rdLab",
      tier,
      briefing: `During ascent the thrust must be held at ${pct}% of the engine's ${max} kN maximum. What thrust should the throttle display show, in kN?`,
      engineeringContext:
        "Holding a percentage of maximum thrust protects the engine from overheating.",
      answer,
      workedSteps: [
        `${pct}% works as an operator: take ${pct} hundredths of ${max}.`,
        `That gives ${answer} kN.`,
      ],
      hints: [
        "Treat the percentage as a scaling machine on the maximum.",
        `Find 10% of ${max} first — then build up to ${pct}%.`,
      ],
      visual: { widget: "riskDial", config: { mode: "percent", target: pct } },
      rocketEffect: { property: "thrustPerEngine", correctValue: Math.min(500, answer), incorrectValue: 250, unit: "kN" },
    });
  },

  "KS3N-12": (tier, rng) => {
    const metres = randInt(rng, 15, 45) / 10;
    const cm = randInt(rng, 25, 95);
    const answer = Math.round((metres + cm / 100) * 100) / 100;
    return makeTask({
      criterionCode: "KS3N-12",
      rocketPart: "fuelTank",
      station: "rdLab",
      tier,
      briefing: `The fuel line needs ${metres} m of rigid pipe joined to ${cm} cm of flexible hose. The parts order lists everything in metres. What total length goes on the order, in metres?`,
      engineeringContext:
        "Mixed units cause wrong deliveries — the order sheet uses one unit only.",
      answer,
      workedSteps: [
        `${cm} cm is ${cm / 100} m.`,
        `Joining ${metres} m and ${cm / 100} m gives ${answer} m.`,
      ],
      hints: [
        "Convert the hose length into metres first.",
        "One hundred centimetres make a metre.",
      ],
      visual: { widget: "ruler", config: { mode: "convert", a: metres, b: cm } },
      tolerance: 0.01,
      rocketEffect: { property: "fuelRatio", correctValue: 2.5, incorrectValue: 2.3, unit: "" },
    });
  },

  "KS3N-13": (tier, rng) => {
    const apogee = randInt(rng, 123456, 987654);
    const s = String(apogee);
    const lead = Number(s.slice(0, 3));
    const roundedLead = Number(s[3]) >= 5 ? lead + 1 : lead;
    const answer = roundedLead * Math.pow(10, s.length - 3);
    return makeTask({
      criterionCode: "KS3N-13",
      rocketPart: "hull",
      station: "rdLab",
      tier,
      briefing: `Telemetry recorded apogee at exactly ${formatThousands(apogee)} m, but the mission summary board shows altitudes to 3 significant figures. What rounded altitude goes on the board, in metres?`,
      engineeringContext:
        "Summary boards trade precision for readability — three figures tell the story.",
      answer,
      workedSteps: [
        `The first three significant figures of ${formatThousands(apogee)} are ${s.slice(0, 3)}.`,
        `The next digit (${s[3]}) decides the rounding: the board shows ${formatThousands(answer)} m.`,
      ],
      hints: [
        "Keep the first three digits; the fourth tells you whether to round up.",
        "All the remaining places become zeros.",
      ],
      visual: { widget: "numberLine", config: { min: 0, max: 1000000, target: answer, step: 1000 } },
      rocketEffect: { property: "hullPanels", correctValue: 60, incorrectValue: 56, unit: "" },
    });
  },

  "KS3N-14": (tier, rng) => {
    const nominal = randInt(rng, 8, 30) / 10;
    const half = 0.05;
    const lower = Math.round((nominal - half) * 100) / 100;
    const upper = Math.round((nominal + half) * 100) / 100;
    return makeTask({
      criterionCode: "KS3N-14",
      rocketPart: "hull",
      station: "rdLab",
      tier,
      briefing: `The strut measures ${nominal} m to the nearest 0.1 m. For the tolerance sheet, give the LOWEST possible true length (the lower bound of the error interval), in metres.`,
      notation: `${lower} ≤ length < ${upper}`,
      engineeringContext:
        "Tolerance sheets record the full range a rounded measurement could hide.",
      answer: lower,
      workedSteps: [
        `Rounding to the nearest 0.1 m means the true value sits within 0.05 m either side.`,
        `The lower bound is ${lower} m and the upper bound is ${upper} m.`,
      ],
      hints: [
        "Half the rounding step either side gives the interval.",
        "Half of 0.1 is 0.05.",
      ],
      visual: { widget: "numberLine", config: { min: lower - 0.1, max: upper + 0.1, target: lower, step: 0.01 } },
      tolerance: 0.001,
      rocketEffect: { property: "hullHeight", correctValue: 8, incorrectValue: 7.8, unit: "m" },
    });
  },

  "KS3N-15": (tier, rng) => {
    const burn = pick(rng, [120, 125, 135, 150] as const);
    const perSec = randInt(rng, 200, 500);
    const impulse = burn * perSec;
    return makeTask({
      criterionCode: "KS3N-15",
      rocketPart: "engine",
      station: "rdLab",
      tier,
      briefing: `Use the console calculator: the recorded total impulse is ${formatThousands(impulse)} kNs delivered over a ${burn} second burn. What average thrust does that give, in kN? Check the readout looks sensible before you enter it.`,
      engineeringContext:
        "Engineers sanity-check every calculator answer against what the engine could really do.",
      answer: perSec,
      workedSteps: [
        `Average thrust is total impulse shared over the burn time.`,
        `${formatThousands(impulse)} over ${burn} seconds gives ${perSec} kN — a sensible engine figure.`,
      ],
      hints: [
        "Impulse spread evenly over time gives the average.",
        "Does your answer look like a realistic engine thrust (hundreds of kN)?",
      ],
      visual: { widget: "equation", config: { formula: `thrust = impulse ÷ time` } },
      rocketEffect: { property: "thrustPerEngine", correctValue: Math.min(500, perSec), incorrectValue: 250, unit: "kN" },
    });
  },

  "KS3N-16": (tier, rng) => {
    void rng;
    return makeTask({
      criterionCode: "KS3N-16",
      rocketPart: "electronics",
      station: "rdLab",
      tier,
      briefing: `The countdown clock can show any whole number of seconds — 10, 100, a million, more. The intern asks: could we ever run out of possible countdown lengths? Answer yes or no.`,
      engineeringContext:
        "Whole numbers go on forever — there's no biggest countdown.",
      answer: "no",
      choices: ["yes", "no"],
      workedSteps: [
        "Whatever countdown you pick, one second longer is still a whole number.",
        "So the set of whole numbers is infinite — we can never run out.",
      ],
      hints: [
        "Can you always name a longer countdown than the last one?",
        "Is there a biggest whole number?",
      ],
      visual: { widget: "numberLine", config: { min: 0, max: 100, target: 100, step: 10 } },
      rocketEffect: { property: "circuitsWired", correctValue: 5, incorrectValue: 4, unit: "" },
    });
  },
};