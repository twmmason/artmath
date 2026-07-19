import type { TemplateMap } from "../types";
import { makeTask } from "./helpers";
import { pick, randInt } from "../rng";

/**
 * ELECTRONICS BAY — Addition/Subtraction + Y6 AS/MD strands.
 * Covers: 1AS-2, 2AS-2, 2AS-3, 3AS-2, 3AS-3, 6AS/MD-1, 6AS/MD-2, 6AS/MD-4
 */
export const electronicsTemplates: TemplateMap = {
  "1AS-2": (tier, rng) => {
    const total = 8;
    const lit = randInt(rng, 2, 6);
    const answer = total - lit;
    return makeTask({
      criterionCode: "1AS-2",
      rocketPart: "electronics",
      tier,
      briefing: `The status board on the electronics bay has ${total} LEDs in a row. Right now ${lit} of them are lit green and the rest are dark. The fault checker needs to know: how many LEDs are still dark?`,
      engineeringContext:
        "Every dark LED is a system still waiting to come online.",
      answer,
      workedSteps: [
        `The board holds ${total} LEDs and ${lit} are lit.`,
        `The lit ones and the dark ones together make ${total}.`,
        `So ${answer} LEDs are dark.`,
      ],
      hints: [
        `Picture the row of ${total}: how many are NOT glowing?`,
        `What joins with ${lit} to make ${total}?`,
      ],
      visual: {
        widget: "circuit",
        config: { mode: "leds", total, done: lit },
      },
      rocketEffect: {
        property: "circuitsWired",
        correctValue: 1,
        incorrectValue: 0,
        unit: "",
      },
    });
  },

  "2AS-2": (tier, rng) => {
    const a = randInt(rng, 38, 55);
    const b = randInt(rng, 25, a - 4);
    return makeTask({
      criterionCode: "2AS-2",
      rocketPart: "electronics",
      tier,
      briefing: `Sensor A on the engine bay reads ${a}°C and Sensor B near the fuel line reads ${b}°C. The thermal team logs the temperature difference between the two sensors every hour. What difference should go in the log?`,
      engineeringContext:
        "A growing temperature difference warns of a cooling problem early.",
      answer: a - b,
      workedSteps: [
        `Sensor A: ${a}°C. Sensor B: ${b}°C.`,
        `The difference is the gap between the two readings.`,
        `Count up from ${b} to ${a}: the gap is ${a - b}°C.`,
      ],
      hints: [
        "Difference means the gap between the two numbers.",
        `Count up from the smaller reading (${b}) to the bigger one.`,
      ],
      visual: {
        widget: "numberLine",
        config: { min: 0, max: 60, target: a - b, step: 1 },
      },
      rocketEffect: {
        property: "circuitsWired",
        correctValue: 2,
        incorrectValue: 1,
        unit: "",
      },
    });
  },

  "2AS-3": (tier, rng) => {
    const used = randInt(rng, 35, 85);
    const answer = 100 - used;
    return makeTask({
      criterionCode: "2AS-3",
      rocketPart: "electronics",
      tier,
      briefing: `The power bus supplies exactly 100 watts. The engine pre-heaters are drawing ${used} watts of it. The comms officer wants to know the spare capacity left for the communications array. How many watts are spare?`,
      engineeringContext:
        "Overloading the bus trips the breakers and blacks out the rocket.",
      answer,
      workedSteps: [
        `The bus gives 100 watts and ${used} are in use.`,
        `Find what joins with ${used} to make 100.`,
        `Spare capacity: ${answer} watts.`,
      ],
      hints: [
        `Get from ${used} to the next ten first, then on to 100.`,
        "Bonds to 100 work for watts too.",
      ],
      visual: {
        widget: "barModel",
        config: { whole: 100, partA: used, mode: "complement" },
      },
      rocketEffect: {
        property: "powerBalanced",
        correctValue: 1,
        incorrectValue: 0,
        unit: "",
      },
    });
  },

  "3AS-2": (tier, rng) => {
    const a = randInt(rng, 120, 260);
    const b = randInt(rng, 110, 250);
    const c = randInt(rng, 100, 240);
    const total = a + b + c;
    return makeTask({
      criterionCode: "3AS-2",
      rocketPart: "electronics",
      tier,
      briefing: `Three circuit boards draw ${a} watts, ${b} watts and ${c} watts. The main fuse is rated for 800 watts, and the electrician needs the combined draw before switching on. What is the total draw of the three boards?`,
      engineeringContext:
        "If the total tops the fuse rating, the fuse blows at switch-on.",
      answer: total,
      workedSteps: [
        `Stack the three readings in a column: ${a}, ${b}, ${c}.`,
        "Work up the columns: ones, tens, hundreds — carrying where needed.",
        `The combined draw is ${total} watts.`,
      ],
      hints: [
        "Line the three numbers up by place value first.",
        "Work right to left, carrying any extra tens.",
      ],
      visual: {
        widget: "circuit",
        config: { mode: "power", boardA: a, boardB: b, boardC: c },
      },
      rocketEffect: {
        property: "circuitsWired",
        correctValue: 3,
        incorrectValue: 2,
        unit: "",
      },
    });
  },

  "3AS-3": (tier, rng) => {
    const partA = randInt(rng, 120, 260);
    const partB = randInt(rng, 110, 250);
    const total = partA + partB;
    return makeTask({
      criterionCode: "3AS-3",
      rocketPart: "electronics",
      tier,
      briefing: `You calculated a total power draw of ${total} watts for two boards, and you know board A uses ${partA} watts. To check your work backwards, work out what board B must use. What reading should board B show?`,
      engineeringContext:
        "Engineers always check totals by working back — it catches slips before launch.",
      answer: partB,
      workedSteps: [
        `The total is ${total} watts and board A accounts for ${partA}.`,
        `Take board A's share away from the total.`,
        `Board B must draw ${partB} watts.`,
      ],
      hints: [
        "Working backwards undoes the joining you did before.",
        `What is left of ${total} once ${partA} is removed?`,
      ],
      visual: {
        widget: "barModel",
        config: { whole: total, partA, mode: "missing" },
      },
      rocketEffect: {
        property: "circuitsWired",
        correctValue: 4,
        incorrectValue: 3,
        unit: "",
      },
    });
  },

  "6AS/MD-1": (tier, rng) => {
    const panel = pick(rng, [40, 50, 60] as const);
    const mult = pick(rng, [3, 4] as const);
    const addTwo = panel * 2;
    const multiplied = panel * mult;
    return makeTask({
      criterionCode: "6AS/MD-1",
      rocketPart: "electronics",
      tier,
      briefing: `The solar panel produces ${panel} watts. Option 1: bolt on a second identical panel, doubling the supply. Option 2: fit the booster module that makes the panel's output ${mult} times bigger. Which option delivers more watts to the guidance computer — option 1 or option 2?`,
      engineeringContext:
        "Adding gives a fixed extra amount; multiplying scales the whole supply — engineers must know which wins.",
      answer: "option 2",
      choices: ["option 1", "option 2"],
      workedSteps: [
        `Option 1 joins two panels: ${panel} and ${panel} make ${addTwo} watts.`,
        `Option 2 scales the panel ${mult} times: ${multiplied} watts.`,
        `${multiplied} beats ${addTwo}, so option 2 wins.`,
      ],
      hints: [
        "Work out each option's total watts separately.",
        "One option ADDS a fixed amount; the other SCALES the output.",
      ],
      visual: {
        widget: "barModel",
        config: { partA: panel, factor: mult, mode: "additiveVsMultiplicative" },
      },
      rocketEffect: {
        property: "powerBalanced",
        correctValue: 1,
        incorrectValue: 0,
        unit: "",
      },
    });
  },

  "6AS/MD-2": (tier, rng) => {
    const factor = pick(rng, [6, 7, 8, 9] as const);
    const missing = randInt(rng, 6, 14);
    const product = factor * missing;
    return makeTask({
      criterionCode: "6AS/MD-2",
      rocketPart: "electronics",
      tier,
      briefing: `The power grid readout shows a battery feeding ${factor} identical heater circuits, and the total delivered is ${product} watts. The flight computer needs the missing figure: each circuit's share. Use the inverse to find how many watts each heater circuit receives.`,
      engineeringContext:
        "Working backwards from a total is how engineers recover a missing sensor reading.",
      answer: missing,
      workedSteps: [
        `${factor} equal circuits together take ${product} watts.`,
        "Undo the scaling: share the total back into the circuits.",
        `Each circuit receives ${missing} watts.`,
      ],
      hints: [
        "The inverse of scaling up into groups is sharing back out.",
        `What number, taken ${factor} times, makes ${product}?`,
      ],
      visual: {
        widget: "circuit",
        config: { mode: "inverse", groups: factor, total: product },
      },
      rocketEffect: {
        property: "circuitsWired",
        correctValue: 5,
        incorrectValue: 4,
        unit: "",
      },
    });
  },

  "6AS/MD-4": (tier, rng) => {
    const small = randInt(rng, 3, 8);
    const mult = pick(rng, [3, 4] as const);
    const big = small * mult;
    const total = small + big;
    return makeTask({
      criterionCode: "6AS/MD-4",
      rocketPart: "electronics",
      tier,
      briefing: `Two resistors control the thruster heating. Together they measure ${total} ohms, and Resistor A is ${mult} times the size of Resistor B. Use the bar model on the breadboard to find Resistor B's value. How many ohms is Resistor B?`,
      engineeringContext:
        "Two unknown parts, two clues — the bar model turns the circuit into a picture.",
      answer: small,
      workedSteps: [
        `Draw Resistor B as one bar; Resistor A is ${mult} bars the same size.`,
        `Together that is ${mult + 1} equal bars making ${total} ohms.`,
        `One bar is ${small} ohms — that's Resistor B. (Resistor A is ${big}.)`,
      ],
      hints: [
        `If B is one bar, A is ${mult} of the same bar — how many bars in total?`,
        `Share ${total} ohms equally among those bars.`,
      ],
      visual: {
        widget: "barModel",
        config: { whole: total, factor: mult, mode: "twoUnknowns" },
      },
      rocketEffect: {
        property: "powerBalanced",
        correctValue: 1,
        incorrectValue: 0,
        unit: "",
      },
    });
  },
};