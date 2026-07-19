import type { TemplateMap } from "../types";
import { makeTask } from "./helpers";
import { pick, randInt } from "../rng";

/**
 * FINS & AERODYNAMICS — Geometry + Addition/Subtraction strands.
 * Covers: 3G-2, 4G-3, 5G-2, 1AS-1, 2AS-1, 2AS-4, 3AS-1
 */
export const finsTemplates: TemplateMap = {
  "3G-2": (tier, rng) => {
    const orientation = pick(rng, ["horizontal", "vertical"] as const);
    return makeTask({
      criterionCode: "3G-2",
      rocketPart: "fins",
      tier,
      briefing: `On the blueprint, one fin edge runs ${orientation === "horizontal" ? "flat, level with the ground line, like the horizon" : "straight up and down, like the launch tower"}. The drawing office needs it labelled. Is that edge horizontal or vertical?`,
      engineeringContext:
        "Labelled edges tell the workshop which way each fin bolts on.",
      answer: orientation,
      choices: ["horizontal", "vertical"],
      workedSteps: [
        "Horizontal lines run level, like the horizon.",
        "Vertical lines run straight up and down, like a launch tower.",
        `This edge is ${orientation}.`,
      ],
      hints: [
        "Horizon and horizontal start the same way for a reason.",
        "A vertical line stands upright like the rocket on the pad.",
      ],
      visual: {
        widget: "grid",
        config: { mode: "lines", orientation },
      },
      rocketEffect: {
        property: "finAngle",
        correctValue: 0,
        incorrectValue: 10,
        unit: "°",
      },
    });
  },

  "4G-3": (tier, rng) => {
    const x = randInt(rng, 1, tier === 1 ? 5 : 9);
    const y = randInt(rng, 1, tier === 1 ? 5 : 9);
    return makeTask({
      criterionCode: "4G-3",
      rocketPart: "fins",
      tier,
      briefing: `The blueprint grid marks where each fin bracket bolts to the hull. The design calls for a bracket at position (${x}, ${y}) — that's ${x} along and ${y} up. Click that point on the grid to place the bracket.`,
      engineeringContext:
        "Brackets bolted at exact grid points keep every fin perfectly lined up.",
      answer: `(${x}, ${y})`,
      workedSteps: [
        "Coordinates read along the bottom first, then up.",
        `Go ${x} squares along from the corner.`,
        `Then ${y} squares up. Mark the bracket there.`,
      ],
      hints: [
        "Along the corridor, then up the stairs.",
        `The first number (${x}) is the across step; the second (${y}) is the up step.`,
      ],
      visual: {
        widget: "grid",
        config: { mode: "plot", targetX: x, targetY: y, size: 10 },
      },
      rocketEffect: {
        property: "finCount",
        correctValue: 3,
        incorrectValue: 2,
        unit: "",
      },
    });
  },

  "5G-2": (tier, rng) => {
    const x = randInt(rng, 1, 4);
    const y = randInt(rng, 1, 4);
    const dx = randInt(rng, 1, 4);
    const dy = randInt(rng, 1, 4);
    return makeTask({
      criterionCode: "5G-2",
      rocketPart: "fins",
      tier,
      briefing: `The wind-tunnel report says the fin at grid point (${x}, ${y}) sits too close to the exhaust. The fix: slide it ${dx} squares to the right and ${dy} squares up. Where does the fin end up? Give the new grid point.`,
      engineeringContext:
        "Translating a part on the grid moves it without turning it — the shape stays identical.",
      answer: `(${x + dx}, ${y + dy})`,
      workedSteps: [
        `Start at (${x}, ${y}).`,
        `Moving right changes the first number: ${x} becomes ${x + dx}.`,
        `Moving up changes the second: ${y} becomes ${y + dy}. New point: (${x + dx}, ${y + dy}).`,
      ],
      hints: [
        "Sliding right only changes the across number.",
        "Sliding up only changes the up number.",
      ],
      visual: {
        widget: "grid",
        config: {
          mode: "translate",
          startX: x,
          startY: y,
          dx,
          dy,
          size: 10,
        },
      },
      rocketEffect: {
        property: "finSymmetry",
        correctValue: 1,
        incorrectValue: 0,
        unit: "",
      },
    });
  },

  "1AS-1": (tier, rng) => {
    const done = randInt(rng, 2, 8);
    const answer = 10 - done;
    return makeTask({
      criterionCode: "1AS-1",
      rocketPart: "fins",
      tier,
      briefing: `Each fin pair is held on by 10 rivets. The workshop has already fitted ${done} rivets on the left fin. How many more rivets do you need for the right fin to finish the pair?`,
      engineeringContext:
        "A fin pair shares its 10 rivets — both sides must be complete before flight.",
      answer,
      workedSteps: [
        "The pair needs 10 rivets in total.",
        `${done} are already fitted.`,
        `${done} and ${answer} together make 10, so ${answer} more are needed.`,
      ],
      hints: [
        `What goes with ${done} to make 10?`,
        "Use your fingers: put down the fitted rivets, count what's left up to ten.",
      ],
      visual: {
        widget: "circuit",
        config: { mode: "bolts", total: 10, done },
      },
      rocketEffect: {
        property: "finCount",
        correctValue: 4,
        incorrectValue: 3,
        unit: "",
      },
    });
  },

  "2AS-1": (tier, rng) => {
    const a = randInt(rng, 24, 48);
    const b = randInt(rng, 15, 39);
    return makeTask({
      criterionCode: "2AS-1",
      rocketPart: "fins",
      tier,
      briefing: `Fin A weighs ${a} kg and Fin B weighs ${b} kg. The launch rail team needs their combined weight to check the rail can hold them during transport. What is the total weight of the two fins?`,
      engineeringContext:
        "The rail has a strict weight limit — the crew always checks totals first.",
      answer: a + b,
      workedSteps: [
        `Fin A: ${a} kg. Fin B: ${b} kg.`,
        `Join the tens first, then the ones.`,
        `Together they weigh ${a + b} kg.`,
      ],
      hints: [
        "Break each weight into tens and ones before joining them.",
        `Start with ${a} and count on ${b} in easy jumps.`,
      ],
      visual: {
        widget: "barModel",
        config: { partA: a, partB: b, mode: "join" },
      },
      rocketEffect: {
        property: "finCount",
        correctValue: 3,
        incorrectValue: 2,
        unit: "",
      },
    });
  },

  "2AS-4": (tier, rng) => {
    const a = randInt(rng, 26, 58);
    const b = randInt(rng, 14, 37);
    return makeTask({
      criterionCode: "2AS-4",
      rocketPart: "fins",
      tier,
      briefing: `The crane has lifted a ${a} kg fin onto the rocket, and a ${b} kg fin is next on the hook. The crane display must show the combined load once both are rigged. What combined weight should the display show?`,
      engineeringContext:
        "Crane operators track the total load so they never exceed the lifting limit.",
      answer: a + b,
      workedSteps: [
        `First fin: ${a} kg. Second fin: ${b} kg.`,
        "Join the tens, then the ones — watch for the ones crossing a ten.",
        `The display should read ${a + b} kg.`,
      ],
      hints: [
        "Join the tens first, then deal with the ones.",
        "If the ones make more than ten, pass the extra ten across.",
      ],
      visual: {
        widget: "barModel",
        config: { partA: a, partB: b, mode: "join" },
      },
      rocketEffect: {
        property: "finCount",
        correctValue: 4,
        incorrectValue: 3,
        unit: "",
      },
    });
  },

  "3AS-1": (tier, rng) => {
    const used = randInt(rng, 23, 88);
    const answer = 100 - used;
    return makeTask({
      criterionCode: "3AS-1",
      rocketPart: "fins",
      tier,
      briefing: `The aerodynamics team set a total fin mass budget of 100 kg. The lower fins have already used ${used} kg of it on the workshop scales. How much of the budget is left for the upper fins?`,
      engineeringContext:
        "Blowing the mass budget makes the whole rocket too heavy to reach orbit.",
      answer,
      workedSteps: [
        `The budget is 100 kg and ${used} kg is used.`,
        `Find the number that joins with ${used} to make 100.`,
        `That complement is ${answer} kg.`,
      ],
      hints: [
        `First get from ${used} to the next ten, then on to 100.`,
        "Think of 100 as ten tens — how many are spoken for?",
      ],
      visual: {
        widget: "barModel",
        config: { whole: 100, partA: used, mode: "complement" },
      },
      rocketEffect: {
        property: "finCount",
        correctValue: 4,
        incorrectValue: 3,
        unit: "",
      },
    });
  },
};