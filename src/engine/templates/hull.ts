import type { TemplateMap } from "../types";
import { makeTask, numberInWords, formatThousands } from "./helpers";
import { pick, randInt, shuffle } from "../rng";

/**
 * HULL — Number & Place Value strand.
 * Covers: 1NPV-1, 2NPV-1, 3NPV-1, 3NPV-2, 3NPV-3, 4NPV-1, 4NPV-2, 4NPV-3,
 *         4NPV-4, 5NPV-1, 6NPV-1, 6NPV-2, 6NPV-3
 */
export const hullTemplates: TemplateMap = {
  "1NPV-1": (tier, rng) => {
    const n = tier === 1 ? randInt(rng, 4, 9) : randInt(rng, 11, 20);
    return makeTask({
      criterionCode: "1NPV-1",
      rocketPart: "hull",
      tier,
      briefing: `The welding robot has just finished this hull section and the inspection sheet needs a panel count. Count the highlighted hull panels. How many are there?`,
      engineeringContext:
        "Every panel must be counted so the inspector knows none are missing.",
      answer: n,
      choices: tier === 1 ? shuffle(rng, [n, n + 1, n - 1]) : undefined,
      workedSteps: [
        "Point at each glowing panel one at a time.",
        "Say the next counting number for each panel you touch.",
        `The last number you say is the total: ${n} panels.`,
      ],
      hints: [
        "Touch each panel once as you count so you don't miss any.",
        "Count slowly and carefully — the last number is your answer.",
      ],
      visual: { widget: "ruler", config: { mode: "countPanels", count: n } },
      rocketEffect: {
        property: "hullPanels",
        correctValue: n,
        incorrectValue: Math.max(1, n - 2),
        unit: "panels",
      },
    });
  },

  "2NPV-1": (tier, rng) => {
    const tensDigit = randInt(rng, 2, 9);
    const onesDigit = randInt(rng, 1, 9);
    const n = tensDigit * 10 + onesDigit;
    const askTens = pick(rng, [true, false]);
    return makeTask({
      criterionCode: "2NPV-1",
      rocketPart: "hull",
      tier,
      briefing: `The hull section is ${n} cm across, says the workshop tape measure. For the parts label we need the digits understood properly. In the measurement ${n}, what is the value of the ${askTens ? "tens" : "ones"} digit?`,
      engineeringContext:
        "Reading each digit correctly stops the workshop cutting the hull to the wrong size.",
      answer: askTens ? tensDigit * 10 : onesDigit,
      choices:
        tier === 1
          ? shuffle(rng, [
              askTens ? tensDigit * 10 : onesDigit,
              askTens ? tensDigit : onesDigit * 10,
              n,
            ])
          : undefined,
      workedSteps: [
        `The number ${n} has two digits.`,
        `The digit ${tensDigit} sits in the tens place, so it is worth ${tensDigit * 10}.`,
        `The digit ${onesDigit} sits in the ones place, so it is worth ${onesDigit}.`,
      ],
      hints: [
        "The left digit of a two-digit number counts tens, the right digit counts ones.",
        "A digit in the tens place is worth ten times its face value.",
      ],
      visual: { widget: "ruler", config: { mode: "placeValue", value: n } },
      rocketEffect: {
        property: "hullRadius",
        correctValue: 1,
        incorrectValue: 0.85,
        unit: "m",
      },
    });
  },

  "3NPV-1": (tier, rng) => {
    const rings = randInt(rng, 3, tier === 1 ? 5 : 9);
    return makeTask({
      criterionCode: "3NPV-1",
      rocketPart: "hull",
      tier,
      briefing: `Each hull ring is welded from exactly 10 panels, and this rocket's hull uses ${rings} full rings. The parts store needs the total panel order. How many panels should we order?`,
      engineeringContext:
        "Ordering the exact panel count keeps the rocket light and the budget on track.",
      answer: rings * 10,
      workedSteps: [
        `One ring uses 10 panels.`,
        `${rings} rings means ${rings} groups of ten.`,
        `${rings} tens make ${rings * 10} panels.`,
      ],
      hints: [
        "Count up in tens, once for each ring.",
        `How much is ${rings} tens altogether?`,
      ],
      visual: { widget: "ruler", config: { mode: "rings", rings } },
      rocketEffect: {
        property: "hullPanels",
        correctValue: rings * 10,
        incorrectValue: rings * 10 - 10,
        unit: "panels",
      },
    });
  },

  "3NPV-2": (tier, rng) => {
    const n = randInt(rng, 111, 987);
    const digits = String(n).split("").map(Number);
    const placeIdx = randInt(rng, 0, 2); // 0=hundreds,1=tens,2=ones
    const placeName = ["hundreds", "tens", "ones"][placeIdx];
    const digit = digits[placeIdx];
    return makeTask({
      criterionCode: "3NPV-2",
      rocketPart: "hull",
      tier,
      briefing: `The laser scanner reports the hull is ${n} cm long. The certification plate records each digit's meaning. In the measurement ${n}, what digit is in the ${placeName} place?`,
      engineeringContext:
        "Mixing up hundreds and tens would make the hull ten times the wrong size.",
      answer: digit,
      choices: tier === 1 ? shuffle(rng, digits) : undefined,
      workedSteps: [
        `Split ${n} into hundreds, tens and ones.`,
        `${n} is ${digits[0]} hundreds, ${digits[1]} tens and ${digits[2]} ones.`,
        `So the ${placeName} digit is ${digit}.`,
      ],
      hints: [
        "In a three-digit number the places from left to right are hundreds, tens, ones.",
        `Which position is the ${placeName} place in ${n}?`,
      ],
      visual: { widget: "ruler", config: { mode: "placeValue", value: n } },
      rocketEffect: {
        property: "hullHeight",
        correctValue: 8,
        incorrectValue: 7,
        unit: "m",
      },
    });
  },

  "3NPV-3": (tier, rng) => {
    const n = randInt(rng, 120, 480);
    return makeTask({
      criterionCode: "3NPV-3",
      rocketPart: "hull",
      tier,
      briefing: `The crane operator lifts hull sections onto a 0 to 500 cm loading rail. This section measures ${n} cm. Slide the marker to where ${n} sits on the rail.`,
      engineeringContext:
        "Placing the section at the right rail position lines the weld seams up perfectly.",
      answer: n,
      workedSteps: [
        "The rail runs from 0 at one end to 500 at the other.",
        `Find the labelled hundreds either side of ${n}.`,
        `${n} sits between them — closer to ${Math.round(n / 100) * 100}.`,
      ],
      hints: [
        "Find which two hundred-marks the number sits between.",
        "Then judge how far between them it belongs.",
      ],
      visual: {
        widget: "numberLine",
        config: { min: 0, max: 500, target: n, step: 10 },
      },
      tolerance: 10,
      rocketEffect: {
        property: "hullHeight",
        correctValue: 8,
        incorrectValue: 7.5,
        unit: "m",
      },
    });
  },

  "4NPV-1": (tier, rng) => {
    const th = randInt(rng, 2, 9);
    return makeTask({
      criterionCode: "4NPV-1",
      rocketPart: "hull",
      tier,
      briefing: `Hull plating arrives in crates of 100 panels, and the depot has stacked ${th * 10} crates for this build. The manifest wants the total panel count. How many panels is that?`,
      engineeringContext:
        "Big rockets need thousands of panels — engineers count them in crates of 100.",
      answer: th * 1000,
      workedSteps: [
        "Each crate holds 100 panels.",
        `${th * 10} crates means ${th * 10} hundreds.`,
        `10 hundreds make 1 thousand, so ${th * 10} hundreds make ${formatThousands(th * 1000)}.`,
      ],
      hints: [
        "How many hundreds are stacked altogether?",
        "Remember: 10 hundreds are the same as 1 thousand.",
      ],
      visual: { widget: "ruler", config: { mode: "crates", crates: th * 10 } },
      rocketEffect: {
        property: "hullPanels",
        correctValue: 60,
        incorrectValue: 50,
        unit: "panels",
      },
    });
  },

  "4NPV-2": (tier, rng) => {
    const n = randInt(rng, 1111, 9876);
    const digits = String(n).split("").map(Number);
    const placeIdx = randInt(rng, 0, 3);
    const placeName = ["thousands", "hundreds", "tens", "ones"][placeIdx];
    const value = digits[placeIdx] * [1000, 100, 10, 1][placeIdx];
    return makeTask({
      criterionCode: "4NPV-2",
      rocketPart: "hull",
      tier,
      briefing: `The weighbridge shows this hull assembly at ${formatThousands(n)} kg. The mass report breaks the reading into place values. What is the VALUE of the digit ${digits[placeIdx]} (the ${placeName} digit)?`,
      engineeringContext:
        "The mass report feeds straight into the fuel calculation — every digit matters.",
      answer: value,
      workedSteps: [
        `${formatThousands(n)} has digits in the thousands, hundreds, tens and ones places.`,
        `The digit ${digits[placeIdx]} sits in the ${placeName} place.`,
        `So it is worth ${formatThousands(value)}.`,
      ],
      hints: [
        "Find which place the digit sits in first.",
        "Then multiply the digit by that place's size.",
      ],
      visual: {
        widget: "ruler",
        config: { mode: "placeValue", value: n },
      },
      rocketEffect: {
        property: "hullHeight",
        correctValue: 8,
        incorrectValue: 7,
        unit: "m",
      },
    });
  },

  "4NPV-3": (tier, rng) => {
    const n = randInt(rng, 1200, 8800);
    return makeTask({
      criterionCode: "4NPV-3",
      rocketPart: "hull",
      tier,
      briefing: `Mission Control tracks hull mass on a big wall scale running 0 to 10,000 kg. Today's build weighs ${formatThousands(n)} kg. Slide the pointer to where that reading belongs on the scale.`,
      engineeringContext:
        "Reading the wall scale at a glance lets the whole team see how heavy the build is.",
      answer: n,
      workedSteps: [
        "The wall scale is marked every 1,000 kg.",
        `${formatThousands(n)} sits between ${formatThousands(Math.floor(n / 1000) * 1000)} and ${formatThousands(Math.ceil(n / 1000) * 1000)}.`,
        "Judge how far between those marks it belongs.",
      ],
      hints: [
        "Find the two thousand-marks either side of the reading.",
        "Then place it the right fraction of the way between them.",
      ],
      visual: {
        widget: "numberLine",
        config: { min: 0, max: 10000, target: n, step: 100 },
      },
      tolerance: 200,
      rocketEffect: {
        property: "hullHeight",
        correctValue: 8,
        incorrectValue: 7.6,
        unit: "m",
      },
    });
  },

  "4NPV-4": (tier, rng) => {
    const roundTo = tier === 1 ? 100 : pick(rng, [10, 100, 1000]);
    const n = randInt(rng, 1050, 8950);
    const rounded = Math.round(n / roundTo) * roundTo;
    return makeTask({
      criterionCode: "4NPV-4",
      rocketPart: "hull",
      tier,
      briefing: `The precise weighbridge reading for the hull is ${formatThousands(n)} kg, but the launch summary board only shows figures to the nearest ${roundTo}. What rounded mass should the board display?`,
      engineeringContext:
        "Summary boards use rounded figures so the crew can read them at a glance.",
      answer: rounded,
      workedSteps: [
        `Look at the digit to the right of the ${roundTo === 10 ? "tens" : roundTo === 100 ? "hundreds" : "thousands"} place.`,
        "If it is 5 or more, round up; otherwise round down.",
        `${formatThousands(n)} rounds to ${formatThousands(rounded)}.`,
      ],
      hints: [
        `Which two multiples of ${roundTo} is ${formatThousands(n)} between?`,
        "Which of those two is it closer to?",
      ],
      visual: {
        widget: "numberLine",
        config: {
          min: rounded - roundTo * 2,
          max: rounded + roundTo * 2,
          target: rounded,
          step: roundTo,
        },
      },
      rocketEffect: {
        property: "hullHeight",
        correctValue: 8,
        incorrectValue: 7.8,
        unit: "m",
      },
    });
  },

  "5NPV-1": (tier, rng) => {
    const factor = tier === 1 ? 10 : pick(rng, [10, 100, 1000]);
    const base = randInt(rng, 12, 89) / 10; // e.g. 3.5
    const answer = base * factor;
    return makeTask({
      criterionCode: "5NPV-1",
      rocketPart: "hull",
      tier,
      briefing: `The blueprint drawing of the hull is ${base} m tall, but the real rocket is built ${factor} times bigger than the drawing. How tall will the real hull be, in metres?`,
      engineeringContext:
        "Blueprints are scale models — engineers scale them up to full size.",
      answer,
      workedSteps: [
        `Scaling by ${factor} moves every digit ${factor === 10 ? "one place" : factor === 100 ? "two places" : "three places"} to the left.`,
        `${base} scaled up ${factor} times is ${answer}.`,
      ],
      hints: [
        `Making a number ${factor} times bigger shifts its digits toward the thousands.`,
        "The digits stay the same — only their places change.",
      ],
      visual: {
        widget: "ruler",
        config: { mode: "scale", from: base, factor },
      },
      rocketEffect: {
        property: "hullHeight",
        correctValue: Math.min(12, answer / 4),
        incorrectValue: 7,
        unit: "m",
      },
    });
  },

  "6NPV-1": (tier, rng) => {
    const pow = randInt(rng, 1, 3);
    const from = pick(rng, [10, 100, 1000, 10000]);
    const to = from * Math.pow(10, pow);
    return makeTask({
      criterionCode: "6NPV-1",
      rocketPart: "hull",
      tier,
      briefing: `The hull rivet counter shows ${formatThousands(from)} rivets fitted so far. The finished super-heavy hull needs ${formatThousands(to)} rivets. How many times more rivets does the finished hull need than are fitted now?`,
      engineeringContext:
        "Understanding powers of ten lets engineers talk about huge rivet counts easily.",
      answer: Math.pow(10, pow),
      workedSteps: [
        `Compare ${formatThousands(from)} with ${formatThousands(to)}.`,
        `Each step of ten makes the number ten times bigger.`,
        `It takes ${pow} step${pow === 1 ? "" : "s"} of ten, so ${formatThousands(to)} is ${formatThousands(Math.pow(10, pow))} times more.`,
      ],
      hints: [
        "Count how many zeros were added.",
        "Every extra zero means ten times more.",
      ],
      visual: { widget: "numberLine", config: { min: 0, max: to, target: from, step: from } },
      rocketEffect: {
        property: "hullPanels",
        correctValue: 60,
        incorrectValue: 52,
        unit: "panels",
      },
    });
  },

  "6NPV-2": (tier, rng) => {
    const millions = randInt(rng, 1, 9);
    const rest = randInt(rng, 100000, 999999);
    const cost = millions * 1000000 + rest;
    return makeTask({
      criterionCode: "6NPV-2",
      rocketPart: "hull",
      tier,
      briefing: `The finance office says this hull cost £${formatThousands(cost)} to build. For the budget presentation they need it written out in words. Write the cost in words.`,
      engineeringContext:
        "Budget documents spell out big figures in words so nobody misreads a digit.",
      answer: numberInWords(cost),
      workedSteps: [
        `Split ${formatThousands(cost)} into millions, thousands and the rest.`,
        `${millions} million, then ${formatThousands(Math.floor(rest / 1000))} thousand, then ${rest % 1000}.`,
        `Written out: ${numberInWords(cost)}.`,
      ],
      hints: [
        "Read the number in groups of three digits, starting from the left.",
        "Say the millions first, then the thousands, then the last three digits.",
      ],
      visual: { widget: "ruler", config: { mode: "placeValue", value: cost } },
      rocketEffect: {
        property: "hullPanels",
        correctValue: 60,
        incorrectValue: 55,
        unit: "panels",
      },
    });
  },

  "6NPV-3": (tier, rng) => {
    const n = randInt(rng, 12, 88) * 100000;
    return makeTask({
      criterionCode: "6NPV-3",
      rocketPart: "hull",
      tier,
      briefing: `Mission Control's big status wall tracks total programme spending on a line from £0 to £10,000,000. The hull programme has spent £${formatThousands(n)} so far. Slide the marker to that spending level.`,
      engineeringContext:
        "Everyone in the control room reads the spending line at a glance.",
      answer: n,
      workedSteps: [
        "The line runs from 0 to 10 million, marked every million.",
        `£${formatThousands(n)} sits between £${formatThousands(Math.floor(n / 1000000) * 1000000)} and £${formatThousands(Math.ceil(n / 1000000) * 1000000)}.`,
        "Place it the right fraction of the way between those marks.",
      ],
      hints: [
        "Find the two million-marks either side first.",
        "Then judge tenths of the way between them.",
      ],
      visual: {
        widget: "numberLine",
        config: { min: 0, max: 10000000, target: n, step: 100000 },
      },
      tolerance: 200000,
      rocketEffect: {
        property: "hullPanels",
        correctValue: 60,
        incorrectValue: 56,
        unit: "panels",
      },
    });
  },
};