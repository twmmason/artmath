import type { TemplateMap } from "../types";
import { makeTask, simplifyFraction } from "./helpers";
import { pick, randInt, shuffle } from "../rng";

/**
 * FUEL SYSTEM — NPV + Fractions strands.
 * Covers: 1NPV-2, 2NPV-2, 2NPV-3, 3NPV-4, 5NPV-2, 5NPV-3, 5NPV-4, 6NPV-4,
 *         3F-1, 4F-1, 5F-1, 5F-3, 6F-1, 6F-3, 6AS/MD-3
 */
export const fuelTemplates: TemplateMap = {
  "1NPV-2": (tier, rng) => {
    const n = randInt(rng, 3, 19);
    return makeTask({
      criterionCode: "1NPV-2",
      rocketPart: "fuelTank",
      tier,
      briefing: `The small test tank's gauge runs from 0 litres (empty) to 20 litres (full). The pump has put ${n} litres in so far. Slide the gauge needle to show ${n} litres.`,
      engineeringContext:
        "The pad crew reads this gauge to know when to stop the pump.",
      answer: n,
      workedSteps: [
        "The gauge starts at 0 and ends at 20.",
        `${n} is ${n < 10 ? "in the lower half" : "in the upper half"} of the gauge.`,
        `Slide the needle to the ${n} mark.`,
      ],
      hints: [
        "Is your number closer to empty (0), the middle (10), or full (20)?",
        "Count along the marks from 0 to find its exact spot.",
      ],
      visual: {
        widget: "numberLine",
        config: { min: 0, max: 20, target: n, step: 1 },
      },
      tolerance: 1,
      rocketEffect: {
        property: "tankFill",
        correctValue: n / 20,
        incorrectValue: 0.4,
        unit: "",
      },
    });
  },

  "2NPV-2": (tier, rng) => {
    const tens = randInt(rng, 2, 9);
    const ones = randInt(rng, 1, 9);
    const n = tens * 10 + ones;
    return makeTask({
      criterionCode: "2NPV-2",
      rocketPart: "fuelTank",
      tier,
      briefing: `The fuel tank currently holds ${n} litres. Fuel is delivered in 10-litre drums, and the depot wants to know how many FULL drums went into that amount. How many tens are in ${n}?`,
      engineeringContext:
        "Counting fuel in ten-litre drums makes loading quicker and safer.",
      answer: tens,
      choices: tier === 1 ? shuffle(rng, [tens, ones, tens + 1]) : undefined,
      workedSteps: [
        `${n} litres is made of tens and ones.`,
        `${n} is ${tens} tens and ${ones} ones.`,
        `So ${tens} full drums went in.`,
      ],
      hints: [
        "The tens digit tells you how many full ten-litre drums there are.",
        `Which digit of ${n} is in the tens place?`,
      ],
      visual: { widget: "fuelGauge", config: { capacity: 100, level: n } },
      rocketEffect: {
        property: "tankFill",
        correctValue: n / 100,
        incorrectValue: 0.4,
        unit: "",
      },
    });
  },

  "2NPV-3": (tier, rng) => {
    const stepSize = pick(rng, [2, 5, 10] as const);
    const count = randInt(rng, 3, 8);
    const total = stepSize * count;
    return makeTask({
      criterionCode: "2NPV-3",
      rocketPart: "fuelTank",
      tier,
      briefing: `Fuel hoses click through the meter ${stepSize} litres at a time. The pad crew counted ${count} clicks during loading. How many litres went into the tank?`,
      engineeringContext:
        "Counting meter clicks is how the pad crew tracks fuel without watching every drop.",
      answer: total,
      workedSteps: [
        `Each click delivers ${stepSize} litres.`,
        `Count up in ${stepSize}s, ${count} times: ${Array.from({ length: count }, (_, i) => (i + 1) * stepSize).join(", ")}.`,
        `The total is ${total} litres.`,
      ],
      hints: [
        `Count in steps of ${stepSize}, once per click.`,
        `Say the ${stepSize} times pattern out loud and stop after ${count} steps.`,
      ],
      visual: { widget: "fuelGauge", config: { capacity: 100, level: total } },
      rocketEffect: {
        property: "tankFill",
        correctValue: Math.min(1, total / 100),
        incorrectValue: 0.3,
        unit: "",
      },
    });
  },

  "3NPV-4": (tier, rng) => {
    const parts = pick(rng, [2, 4, 5, 10] as const);
    const answer = 100 / parts;
    return makeTask({
      criterionCode: "3NPV-4",
      rocketPart: "fuelTank",
      tier,
      briefing: `The 100-litre header tank feeds ${parts} engines through ${parts} identical pipes, and each pipe must carry an equal share. How many litres flow through each pipe?`,
      engineeringContext:
        "Equal fuel flow keeps all the engines burning at the same strength.",
      answer,
      workedSteps: [
        `The tank holds 100 litres, split ${parts} equal ways.`,
        `Sharing 100 into ${parts} equal parts gives ${answer} litres each.`,
      ],
      hints: [
        `Imagine pouring the 100 litres into ${parts} identical jugs.`,
        `What number, repeated ${parts} times, fills up to 100?`,
      ],
      visual: {
        widget: "fuelGauge",
        config: { capacity: 100, level: answer, parts },
      },
      rocketEffect: {
        property: "fuelRatio",
        correctValue: 2.5,
        incorrectValue: 2,
        unit: "",
      },
    });
  },

  "5NPV-2": (tier, rng) => {
    const whole = randInt(rng, 1, 9);
    const tenth = randInt(rng, 1, 9);
    const hundredth = randInt(rng, 1, 9);
    const n = whole + tenth / 10 + hundredth / 100;
    const place = pick(rng, ["tenths", "hundredths"] as const);
    const answer = place === "tenths" ? tenth : hundredth;
    return makeTask({
      criterionCode: "5NPV-2",
      rocketPart: "fuelTank",
      tier,
      briefing: `The precision flow meter reads ${n.toFixed(2)} litres per second. The calibration sheet asks for the digit in the ${place} place of that reading. What is it?`,
      engineeringContext:
        "Precision fuel flow is measured to hundredths of a litre — every decimal place matters.",
      answer,
      workedSteps: [
        `In ${n.toFixed(2)}, the digit after the decimal point is the tenths digit.`,
        "The next digit along is the hundredths digit.",
        `So the ${place} digit is ${answer}.`,
      ],
      hints: [
        "The first digit after the decimal point counts tenths.",
        "The second digit after the point counts hundredths.",
      ],
      visual: {
        widget: "numberLine",
        config: { min: Math.floor(n), max: Math.ceil(n), target: n, step: 0.01 },
      },
      rocketEffect: {
        property: "fuelRatio",
        correctValue: 2.5,
        incorrectValue: 2.2,
        unit: "",
      },
    });
  },

  "5NPV-3": (tier, rng) => {
    const n = randInt(rng, 5, 45) / 10;
    return makeTask({
      criterionCode: "5NPV-3",
      rocketPart: "fuelTank",
      tier,
      briefing: `The oxidiser gauge runs from 0 to 5 tonnes with a mark every tenth. The needle points to ${n} tonnes. Slide the marker to the needle's position to confirm the reading.`,
      engineeringContext:
        "Confirming the gauge reading is a standard two-person check before fuelling.",
      answer: n,
      workedSteps: [
        "The gauge is marked every tenth of a tonne.",
        `${n} sits between ${Math.floor(n)} and ${Math.ceil(n)}.`,
        `Count ${Math.round((n - Math.floor(n)) * 10)} small marks past ${Math.floor(n)}.`,
      ],
      hints: [
        "Find the two whole-tonne marks either side first.",
        "Each small mark between them is one tenth.",
      ],
      visual: {
        widget: "numberLine",
        config: { min: 0, max: 5, target: n, step: 0.1 },
      },
      tolerance: 0.25,
      rocketEffect: {
        property: "tankFill",
        correctValue: n / 5,
        incorrectValue: 0.5,
        unit: "",
      },
    });
  },

  "5NPV-4": (tier, rng) => {
    const n = randInt(rng, 105, 495) / 100; // e.g. 2.45
    const rounded = Math.round(n * 10) / 10;
    return makeTask({
      criterionCode: "5NPV-4",
      rocketPart: "fuelTank",
      tier,
      briefing: `The tank diameter measures ${n.toFixed(2)} m on the laser gauge, but the pipe fittings catalogue only lists sizes to 1 decimal place. What diameter should we look up, rounded to 1 decimal place?`,
      engineeringContext:
        "Catalogue sizes come in tenths of a metre — we round to find the right fitting.",
      answer: rounded.toFixed(1),
      workedSteps: [
        `Look at the hundredths digit of ${n.toFixed(2)}.`,
        "If it is 5 or more, round the tenths digit up; otherwise keep it.",
        `${n.toFixed(2)} rounds to ${rounded.toFixed(1)}.`,
      ],
      hints: [
        `Which two tenths is ${n.toFixed(2)} between?`,
        "Which of those two is it closer to?",
      ],
      visual: {
        widget: "numberLine",
        config: { min: Math.floor(n), max: Math.ceil(n), target: rounded, step: 0.1 },
      },
      rocketEffect: {
        property: "hullRadius",
        correctValue: Math.min(1.4, rounded / 2),
        incorrectValue: 0.9,
        unit: "m",
      },
    });
  },

  "6NPV-4": (tier, rng) => {
    const max = pick(rng, [1000, 10000] as const);
    const divisions = pick(rng, [4, 5, 10] as const);
    const idx = randInt(rng, 1, divisions - 1);
    const answer = (max / divisions) * idx;
    return makeTask({
      criterionCode: "6NPV-4",
      rocketPart: "fuelTank",
      tier,
      briefing: `The main tank gauge runs 0 to ${max.toLocaleString("en-GB")} litres but only the ends are labelled — there are ${divisions} equal spaces between them. The needle sits on the ${idx}${idx === 1 ? "st" : idx === 2 ? "nd" : idx === 3 ? "rd" : "th"} mark from empty. How many litres are in the tank?`,
      engineeringContext:
        "Real gauges often have unlabelled marks — engineers work out each interval's value.",
      answer,
      workedSteps: [
        `The gauge covers ${max.toLocaleString("en-GB")} litres in ${divisions} equal spaces.`,
        `Each space is worth ${max / divisions} litres.`,
        `Mark ${idx} shows ${idx} spaces: ${answer.toLocaleString("en-GB")} litres.`,
      ],
      hints: [
        "Work out what one gap between marks is worth first.",
        `Then count ${idx} gaps up from empty.`,
      ],
      visual: {
        widget: "numberLine",
        config: { min: 0, max, target: answer, step: max / divisions },
      },
      rocketEffect: {
        property: "tankFill",
        correctValue: idx / divisions,
        incorrectValue: 0.4,
        unit: "",
      },
    });
  },

  "3F-1": (tier, rng) => {
    const den = pick(rng, tier === 1 ? [2, 4] : ([2, 3, 4, 5, 10] as const));
    return makeTask({
      criterionCode: "3F-1",
      rocketPart: "fuelTank",
      tier,
      briefing: `For this hop test the flight plan calls for a light fuel load: exactly one part out of ${den} equal parts of the tank. Drag the fuel slider to fill the tank to 1/${den}.`,
      engineeringContext:
        "Test flights use small fuel loads so the rocket stays light and safe.",
      answer: `1/${den}`,
      workedSteps: [
        `Split the tank into ${den} equal sections.`,
        `Fill just one of those sections.`,
        `That fill level is 1/${den} of the tank.`,
      ],
      hints: [
        `Picture the tank divided into ${den} equal slices.`,
        "Fill exactly one slice from the bottom.",
      ],
      visual: {
        widget: "fuelGauge",
        config: { capacity: 1, targetFraction: `1/${den}`, mode: "fraction" },
      },
      acceptEquivalentFractions: true,
      rocketEffect: {
        property: "tankFill",
        correctValue: 1 / den,
        incorrectValue: 0.5,
        unit: "",
      },
    });
  },

  "4F-1": (tier, rng) => {
    const base = pick(rng, [
      [1, 4, 2, 8],
      [1, 2, 3, 6],
      [2, 3, 4, 6],
      [1, 5, 2, 10],
    ] as const);
    const [n1, d1, n2, d2] = base;
    return makeTask({
      criterionCode: "4F-1",
      rocketPart: "fuelTank",
      tier,
      briefing: `Two gauges watch the same tank. The old dial shows ${n2}/${d2} full, the new digital one shows ${n1}/${d1} full. The pad chief asks: are these the same fill level? Answer yes or no.`,
      engineeringContext:
        "If the two gauges disagree, fuelling must stop — so we check for equivalence.",
      answer: "yes",
      choices: ["yes", "no"],
      workedSteps: [
        `Scale ${n1}/${d1}: multiply top and bottom by the same amount.`,
        `${n1}/${d1} scales to ${n2}/${d2}.`,
        "Both gauges show the same fill — they agree.",
      ],
      hints: [
        "Try scaling the numerator and denominator of one fraction by the same number.",
        `Does ${n1}/${d1} turn into ${n2}/${d2} when you do?`,
      ],
      visual: {
        widget: "fuelGauge",
        config: { compareA: `${n1}/${d1}`, compareB: `${n2}/${d2}`, mode: "compare" },
      },
      rocketEffect: {
        property: "tankFill",
        correctValue: n1 / d1,
        incorrectValue: 0.5,
        unit: "",
      },
    });
  },

  "5F-1": (tier, rng) => {
    const den = pick(rng, [4, 5, 8, 10] as const);
    const num = randInt(rng, 1, den - 1);
    const capacity = den * pick(rng, [50, 100, 150] as const);
    const answer = (capacity / den) * num;
    return makeTask({
      criterionCode: "5F-1",
      rocketPart: "fuelTank",
      tier,
      briefing: `The main tank holds ${capacity} litres when full. Today's mission plan says load it to ${num}/${den}. How many litres should the pump deliver?`,
      engineeringContext:
        "Loading exactly the planned fraction keeps the rocket at its target mass.",
      answer,
      workedSteps: [
        `One ${den}th of ${capacity} litres is ${capacity / den} litres.`,
        `${num}/${den} is ${num} of those parts.`,
        `${num} lots of ${capacity / den} makes ${answer} litres.`,
      ],
      hints: [
        `Find one ${den}th of the tank first.`,
        `Then take ${num} of those equal parts.`,
      ],
      visual: {
        widget: "fuelGauge",
        config: { capacity, level: answer, mode: "quantity" },
      },
      rocketEffect: {
        property: "tankFill",
        correctValue: num / den,
        incorrectValue: 0.5,
        unit: "",
      },
    });
  },

  "5F-3": (tier, rng) => {
    const pairs = [
      { frac: "1/2", dec: "0.5" },
      { frac: "1/4", dec: "0.25" },
      { frac: "3/4", dec: "0.75" },
      { frac: "1/5", dec: "0.2" },
      { frac: "1/10", dec: "0.1" },
    ] as const;
    const p = pick(rng, pairs);
    return makeTask({
      criterionCode: "5F-3",
      rocketPart: "fuelTank",
      tier,
      briefing: `The digital readout says the tank is ${p.dec} full, but the old analogue gauge shows fractions only. What fraction should the analogue gauge show to match?`,
      engineeringContext:
        "The two gauges must agree before the fuelling log can be signed.",
      answer: p.frac,
      choices:
        tier === 1
          ? shuffle(rng, [
              p.frac,
              ...["1/2", "1/4", "3/4", "1/5", "1/10"]
                .filter((f) => f !== p.frac)
                .slice(0, 2),
            ])
          : undefined,
      workedSteps: [
        `${p.dec} means ${p.dec.replace("0.", "")} ${p.dec.length === 3 ? "tenths" : "hundredths"} of the tank.`,
        `As a fraction that is ${p.frac}.`,
      ],
      hints: [
        "Think of the decimal as tenths or hundredths of the tank.",
        "Then write those tenths or hundredths as a simple fraction.",
      ],
      visual: {
        widget: "fuelGauge",
        config: { capacity: 1, level: Number(p.dec), mode: "decimalToFraction" },
      },
      rocketEffect: {
        property: "tankFill",
        correctValue: Number(p.dec),
        incorrectValue: 0.5,
        unit: "",
      },
    });
  },

  "6F-1": (tier, rng) => {
    const g = pick(rng, [2, 3, 4] as const);
    const [sn, sd] = pick(rng, [
      [1, 2],
      [2, 3],
      [3, 4],
      [1, 4],
      [2, 5],
    ] as const);
    const num = sn * g;
    const den = sd * g;
    const [an, ad] = simplifyFraction(num, den);
    return makeTask({
      criterionCode: "6F-1",
      rocketPart: "fuelTank",
      tier,
      briefing: `The gauge reads ${num}/${den} full, but the flight log only accepts fractions in simplest form. Simplify ${num}/${den} for the log entry.`,
      engineeringContext:
        "Simplest-form fractions keep the flight log clear for the next crew.",
      answer: `${an}/${ad}`,
      workedSteps: [
        `Find a number that divides into both ${num} and ${den}.`,
        `Both divide by ${g}.`,
        `That gives ${an}/${ad} — no further common factors.`,
      ],
      hints: [
        "Look for a number that goes into the top AND the bottom exactly.",
        "Keep dividing until no shared factor is left.",
      ],
      visual: {
        widget: "fuelGauge",
        config: { capacity: 1, level: num / den, mode: "simplify" },
      },
      rocketEffect: {
        property: "tankFill",
        correctValue: num / den,
        incorrectValue: 0.5,
        unit: "",
      },
    });
  },

  "6F-3": (tier, rng) => {
    const options = [
      { frac: "3/4", dec: "0.75", pct: "75%" },
      { frac: "1/2", dec: "0.5", pct: "50%" },
      { frac: "1/4", dec: "0.25", pct: "25%" },
      { frac: "1/5", dec: "0.2", pct: "20%" },
      { frac: "3/5", dec: "0.6", pct: "60%" },
    ] as const;
    const o = pick(rng, options);
    return makeTask({
      criterionCode: "6F-3",
      rocketPart: "fuelTank",
      tier,
      briefing: `Mission Control's screen shows the tank at ${o.pct}, but the pump computer only accepts decimals. What decimal should we type into the pump to match ${o.pct}?`,
      engineeringContext:
        "Percentages, decimals and fractions are three languages for the same fill level.",
      answer: o.dec,
      workedSteps: [
        `${o.pct} means ${o.pct.replace("%", "")} parts per hundred.`,
        `Written as a decimal that is ${o.dec}.`,
      ],
      hints: [
        "Per cent means out of one hundred.",
        "Turn the hundredths into a decimal number.",
      ],
      visual: {
        widget: "fuelGauge",
        config: { capacity: 1, level: Number(o.dec), mode: "percent" },
      },
      rocketEffect: {
        property: "tankFill",
        correctValue: Number(o.dec),
        incorrectValue: 0.5,
        unit: "",
      },
    });
  },

  "6AS/MD-3": (tier, rng) => {
    const ratio = randInt(rng, 3, 6);
    const fuel = ratio * randInt(rng, 20, 80);
    const answer = fuel / ratio;
    return makeTask({
      criterionCode: "6AS/MD-3",
      rocketPart: "fuelTank",
      tier,
      briefing: `The engine burns fuel and oxidiser in the ratio ${ratio} to 1 — every ${ratio} litres of fuel needs 1 litre of oxidiser. The fuel tank has been loaded with ${fuel} litres. How many litres of oxidiser must go in the other tank?`,
      engineeringContext:
        "The wrong mix ratio makes the engine burn too hot or splutter out.",
      answer,
      workedSteps: [
        `For every ${ratio} litres of fuel we need 1 litre of oxidiser.`,
        `${fuel} litres of fuel contains ${answer} groups of ${ratio} litres.`,
        `So we need ${answer} litres of oxidiser.`,
      ],
      hints: [
        `How many groups of ${ratio} litres are in ${fuel} litres?`,
        "Each of those groups needs exactly 1 litre of oxidiser.",
      ],
      visual: {
        widget: "ratioMixer",
        config: { ratioA: ratio, ratioB: 1, totalA: fuel },
      },
      rocketEffect: {
        property: "fuelRatio",
        correctValue: ratio,
        incorrectValue: 2,
        unit: "",
      },
    });
  },
};