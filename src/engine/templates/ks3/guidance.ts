import type { TemplateMap } from "../../types";
import { makeTask } from "../helpers";
import { pick, randInt } from "../../rng";

/**
 * GUIDANCE COMPUTER — KS3 Algebra (KS3A-1 … KS3A-16), station "guidanceComputer".
 * Operation symbols are permitted ONLY inside the `notation` field.
 */
export const guidanceTemplates: TemplateMap = {
  "KS3A-1": (tier, rng) => {
    const a = randInt(rng, 2, 5);
    const b = randInt(rng, 2, 5);
    return makeTask({
      criterionCode: "KS3A-1",
      rocketPart: "engine",
      station: "guidanceComputer",
      tier,
      briefing: `The burn program on screen contains the expression shown. The compiler rejects long forms — rewrite it in its shortest form (like 7t) before upload.`,
      notation: `${a}t + ${b}t`,
      engineeringContext:
        "Shorter programs upload faster and leave less room for bugs.",
      answer: `${a + b}t`,
      workedSteps: [
        `Both terms count lots of t: ${a} of them and ${b} of them.`,
        `Together that is ${a + b} lots of t, written ${a + b}t.`,
      ],
      hints: [
        "Both terms are counting the same thing (t).",
        `How many t's are there altogether?`,
      ],
      visual: { widget: "equation", config: { formula: `${a}t + ${b}t` } },
      rocketEffect: { property: "thrustPerEngine", correctValue: 300, incorrectValue: 280, unit: "kN" },
    });
  },

  "KS3A-2": (tier, rng) => {
    const rate = pick(rng, [12, 15, 18, 20] as const);
    const fuel = rate * randInt(rng, 30, 80);
    return makeTask({
      criterionCode: "KS3A-2",
      rocketPart: "fuelTank",
      station: "guidanceComputer",
      tier,
      briefing: `The burn-time program is shown on the console. With fuel f loaded at ${fuel} kg and burn rate r at ${rate} kg per second, how long will the engine fire, in seconds?`,
      notation: `t = f ÷ r`,
      engineeringContext:
        "Substituting real values into the flight formula gives the actual burn time.",
      answer: fuel / rate,
      workedSteps: [
        `Substitute: f is ${fuel} and r is ${rate}.`,
        `${fuel} shared by ${rate} gives ${fuel / rate} seconds.`,
      ],
      hints: [
        "Replace each letter with its value.",
        "Then carry out the sharing the formula describes.",
      ],
      visual: { widget: "equation", config: { formula: `t = f ÷ r`, f: fuel, r: rate } },
      rocketEffect: { property: "tankFill", correctValue: 0.85, incorrectValue: 0.6, unit: "" },
    });
  },

  "KS3A-3": (tier, rng) => {
    const a = randInt(rng, 2, 6);
    const b = randInt(rng, 20, 80);
    const c = b + a * randInt(rng, 10, 40);
    return makeTask({
      criterionCode: "KS3A-3",
      rocketPart: "electronics",
      station: "guidanceComputer",
      tier,
      briefing: `The console readout shows two lines of flight code. Only one of them is an EQUATION the autopilot can solve — the other is just an expression. Which line is the equation — 1 or 2?`,
      notation: `line 1: ${a}t + ${b} = ${c}   |   line 2: ${a}t + ${b}`,
      engineeringContext:
        "The autopilot can only solve statements that set two things equal.",
      answer: "1",
      choices: ["1", "2"],
      workedSteps: [
        "An equation has an equals sign linking two sides.",
        "Line 1 has one; line 2 is just an expression with no equals sign.",
      ],
      hints: [
        "Look for the equals sign.",
        "An expression on its own has nothing to solve.",
      ],
      visual: { widget: "equation", config: { formula: `${a}t + ${b} = ${c}` } },
      rocketEffect: { property: "circuitsWired", correctValue: 5, incorrectValue: 4, unit: "" },
    });
  },

  "KS3A-4": (tier, rng) => {
    const k = randInt(rng, 2, 4);
    const add = pick(rng, [20, 30, 40, 50] as const);
    return makeTask({
      criterionCode: "KS3A-4",
      rocketPart: "electronics",
      station: "guidanceComputer",
      tier,
      briefing: `Each of the ${k} avionics boards draws the bracketed amount of watts shown on screen. Expand the brackets so the fuse calculator can read the total draw as a single expression with no brackets.`,
      notation: `${k}(p + ${add})`,
      engineeringContext:
        "The fuse calculator only accepts fully expanded expressions.",
      answer: `${k}p + ${k * add}`,
      workedSteps: [
        `Every board contributes p watts and ${add} watts.`,
        `${k} boards contribute ${k}p and ${k * add} — expanded: ${k}p + ${k * add}.`,
      ],
      hints: [
        "Scale each thing inside the brackets by the number outside.",
        `Both p AND ${add} get scaled by ${k}.`,
      ],
      visual: { widget: "equation", config: { formula: `${k}(p + ${add})` } },
      rocketEffect: { property: "powerBalanced", correctValue: 1, incorrectValue: 0, unit: "" },
    });
  },

  "KS3A-5": (tier, rng) => {
    void rng;
    return makeTask({
      criterionCode: "KS3A-5",
      rocketPart: "hull",
      station: "guidanceComputer",
      tier,
      briefing: `The velocity program is shown on the console. Mission Control already knows v and d, and needs the program rearranged so it outputs t. Which rearrangement should be uploaded?`,
      notation: `v = d ÷ t`,
      engineeringContext:
        "Rearranging a formula lets one program answer three different questions.",
      answer: "t = d ÷ v",
      choices: ["t = d ÷ v", "t = v ÷ d", "t = d × v"],
      workedSteps: [
        "Multiply both sides by t, then share both sides by v.",
        "That isolates t: t equals d shared by v.",
      ],
      hints: [
        "Undo the operations around t one at a time.",
        "Whatever you do to one side, do to the other.",
      ],
      visual: { widget: "equation", config: { formula: `v = d ÷ t` } },
      rocketEffect: { property: "hullHeight", correctValue: 8, incorrectValue: 7.5, unit: "m" },
    });
  },

  "KS3A-6": (tier, rng) => {
    const callout = pick(rng, [50, 60, 80] as const);
    const perHour = pick(rng, [20, 25, 30] as const);
    return makeTask({
      criterionCode: "KS3A-6",
      rocketPart: "hull",
      station: "guidanceComputer",
      tier,
      briefing: `Ground crew charge a £${callout} callout fee plus £${perHour} for every hour h they work. The budget computer needs the cost program C written as a formula. Which formula models the cost?`,
      engineeringContext:
        "Turning real charges into a formula lets the computer forecast any job's cost.",
      answer: `C = ${perHour}h + ${callout}`,
      choices: [
        `C = ${perHour}h + ${callout}`,
        `C = ${callout}h + ${perHour}`,
        `C = ${perHour + callout}h`,
      ],
      workedSteps: [
        `The £${callout} is paid once — it stands alone.`,
        `The £${perHour} repeats each hour — it multiplies h. Model: C = ${perHour}h + ${callout}.`,
      ],
      hints: [
        "Which charge happens once and which repeats per hour?",
        "The repeating charge is the one attached to h.",
      ],
      visual: { widget: "equation", config: { formula: `C = ${perHour}h + ${callout}` } },
      rocketEffect: { property: "hullPanels", correctValue: 60, incorrectValue: 56, unit: "" },
    });
  },

  "KS3A-7": (tier, rng) => {
    const coeff = randInt(rng, 3, 6);
    const t = randInt(rng, 20, 90);
    const add = pick(rng, [40, 60, 80] as const);
    const rhs = coeff * t + add;
    return makeTask({
      criterionCode: "KS3A-7",
      rocketPart: "engine",
      station: "guidanceComputer",
      tier,
      briefing: `The throttle equation on the console is shown. Solve it for t to set the throttle position.`,
      notation: `${coeff}t + ${add} = ${rhs}`,
      engineeringContext:
        "The solved value of t goes straight into the throttle servo.",
      answer: t,
      workedSteps: [
        `Remove ${add} from both sides: ${coeff}t is ${rhs - add}.`,
        `Share by ${coeff}: t is ${t}.`,
      ],
      hints: [
        `First undo the ${add} on the left side.`,
        `Then undo the ${coeff} lots of t.`,
      ],
      visual: { widget: "equation", config: { formula: `${coeff}t + ${add} = ${rhs}` } },
      rocketEffect: { property: "thrustPerEngine", correctValue: 320, incorrectValue: 280, unit: "kN" },
    });
  },

  "KS3A-8": (tier, rng) => {
    const x = randInt(rng, -6, -1);
    const y = randInt(rng, -6, -1);
    return makeTask({
      criterionCode: "KS3A-8",
      rocketPart: "fins",
      station: "guidanceComputer",
      tier,
      briefing: `The recovery ship is holding station at (${x}, ${y}) on the ocean grid — the splashdown zone spans all four quadrants. Click that position on the grid to log the ship's location.`,
      engineeringContext:
        "The capsule aims for wherever the recovery ship waits — even in negative grid space.",
      answer: `(${x}, ${y})`,
      workedSteps: [
        `The first number (${x}) is negative: move LEFT from the origin.`,
        `The second (${y}) is negative: move DOWN. That lands in the third quadrant.`,
      ],
      hints: [
        "Negative across means left of the origin.",
        "Negative up means below the origin.",
      ],
      visual: { widget: "grid", config: { mode: "plot4", targetX: x, targetY: y, size: 14 } },
      rocketEffect: { property: "finCount", correctValue: 4, incorrectValue: 3, unit: "" },
    });
  },

  "KS3A-9": (tier, rng) => {
    void rng;
    return makeTask({
      criterionCode: "KS3A-9",
      rocketPart: "hull",
      station: "guidanceComputer",
      tier,
      briefing: `The hop-test height program is drawn on the trajectory screen (h in metres, t in seconds). What shape does the flight path make?`,
      notation: `h = 100t − 5t²`,
      engineeringContext:
        "Quadratic programs make curved flight paths; linear ones make straight climbs.",
      answer: "parabola",
      choices: ["parabola", "straight line", "circle"],
      workedSteps: [
        "The program contains a squared term, so its graph curves.",
        "Up, over, and back down — a parabola (an upside-down U).",
      ],
      hints: [
        "Look for the squared term in the program.",
        "Squared terms bend graphs into a U shape.",
      ],
      visual: { widget: "graph", config: { mode: "quadratic", a: -5, b: 100 } },
      rocketEffect: { property: "hullHeight", correctValue: 8, incorrectValue: 7.6, unit: "m" },
    });
  },

  "KS3A-10": (tier, rng) => {
    const m = pick(rng, [20, 40, 60] as const);
    const c = pick(rng, [100, 200, 300] as const);
    return makeTask({
      criterionCode: "KS3A-10",
      rocketPart: "hull",
      station: "guidanceComputer",
      tier,
      briefing: `Two ascent programs are drawn on the screen: line A climbs gently, line B climbs steeply. The program shown has a climb rate of ${m} metres per second. Steeper always means faster climbing. Which line belongs to it — A (gentle) or B (steep)? The other program climbs at ${m * 3} metres per second.`,
      notation: `h = ${m}t + ${c}`,
      engineeringContext:
        "Reading steepness off a graph tells you the climb rate without any numbers.",
      answer: "A",
      choices: ["A", "B"],
      workedSteps: [
        `This program's climb rate is ${m} per second; the other is ${m * 3}.`,
        `${m} is the slower rate, so it draws the gentler line: A.`,
      ],
      hints: [
        "Steeper line = faster climb rate.",
        "Compare the two climb rates first.",
      ],
      visual: { widget: "graph", config: { mode: "compareLines", m1: m, m2: m * 3, c } },
      rocketEffect: { property: "hullHeight", correctValue: 8, incorrectValue: 7.7, unit: "m" },
    });
  },

  "KS3A-11": (tier, rng) => {
    const m = pick(rng, [30, 40, 50] as const);
    const c = pick(rng, [100, 200, 250] as const);
    const asking = pick(rng, ["gradient", "intercept"] as const);
    return makeTask({
      criterionCode: "KS3A-11",
      rocketPart: "hull",
      station: "guidanceComputer",
      tier,
      briefing: `The ascent profile on screen follows the program shown (h in metres, t in seconds). Read off the ${asking === "gradient" ? "climb rate (metres gained per second — the gradient)" : "starting height (where the line meets the height axis — the intercept)"}. What is it?`,
      notation: `h = ${m}t + ${c}`,
      engineeringContext:
        "Gradient and intercept are the two numbers that define any straight-line ascent.",
      answer: asking === "gradient" ? m : c,
      workedSteps: [
        `In the form shown, the number multiplying t is the gradient (${m}).`,
        `The lone number is the intercept (${c}). You need the ${asking}: ${asking === "gradient" ? m : c}.`,
      ],
      hints: [
        "The gradient is the number attached to t.",
        "The intercept is the number standing alone.",
      ],
      visual: { widget: "graph", config: { mode: "line", m, c } },
      rocketEffect: { property: "hullHeight", correctValue: 8, incorrectValue: 7.5, unit: "m" },
    });
  },

  "KS3A-12": (tier, rng) => {
    const t = randInt(rng, 2, 6);
    const m1 = pick(rng, [40, 50] as const);
    const c2 = m1 * t; // balloon starts at c2, stays level; rocket h = m1 * t
    return makeTask({
      criterionCode: "KS3A-12",
      rocketPart: "hull",
      station: "guidanceComputer",
      tier,
      briefing: `On the trajectory screen, our rocket climbs along the line shown on the console while a weather balloon hovers level at ${c2} metres. Use the graph: after how many seconds do the two lines cross?`,
      notation: `h = ${m1}t`,
      engineeringContext:
        "The crossing point of two graphs is where the rocket passes the balloon.",
      answer: t,
      workedSteps: [
        `The lines cross where both heights match: ${m1} lots of t equals ${c2}.`,
        `That happens at t equal to ${t} seconds.`,
      ],
      hints: [
        "Find where the climbing line meets the level line on the screen.",
        `At the crossing, the rocket's height equals ${c2}.`,
      ],
      visual: { widget: "graph", config: { mode: "intersection", m1, c2 } },
      rocketEffect: { property: "hullHeight", correctValue: 8, incorrectValue: 7.6, unit: "m" },
    });
  },

  "KS3A-13": (tier, rng) => {
    const start = 100;
    const dropPerHour = pick(rng, [10, 16, 20] as const);
    const limit = 20;
    const answer = (start - limit) / dropPerHour;
    return makeTask({
      criterionCode: "KS3A-13",
      rocketPart: "electronics",
      station: "guidanceComputer",
      tier,
      briefing: `The battery-drain curve on screen starts at ${start}% and falls steadily by ${dropPerHour} percentage points every hour. The flight must end before power drops below ${limit}%. Use the graph to estimate: after how many hours does power reach ${limit}%?`,
      engineeringContext:
        "Reading limits off a drain curve sets the maximum mission length.",
      answer,
      workedSteps: [
        `The battery must fall ${start - limit} points to reach ${limit}%.`,
        `Falling ${dropPerHour} points per hour, that takes ${answer} hours.`,
      ],
      hints: [
        `How far must the curve fall from ${start}% to ${limit}%?`,
        "Follow the curve until it meets the limit line.",
      ],
      visual: { widget: "graph", config: { mode: "drain", start, rate: dropPerHour, limit } },
      tolerance: 0.5,
      rocketEffect: { property: "powerBalanced", correctValue: 1, incorrectValue: 0, unit: "" },
    });
  },

  "KS3A-14": (tier, rng) => {
    const start = randInt(rng, 3, 8);
    const step = randInt(rng, 3, 6);
    const seq = [start, start + step, start + step * 2, start + step * 3];
    const next3 = [start + step * 4, start + step * 5, start + step * 6];
    return makeTask({
      criterionCode: "KS3A-14",
      rocketPart: "electronics",
      station: "guidanceComputer",
      tier,
      briefing: `The tracking beacon flashes at ${seq.join(" s, ")} s… following a steady pattern. Program the next three flash times into the computer, separated by commas.`,
      engineeringContext:
        "The tracker predicts every future flash from the pattern's rule.",
      answer: next3.join(", "),
      workedSteps: [
        `Each flash comes ${step} seconds after the last.`,
        `Continuing: ${next3.join(", ")}.`,
      ],
      hints: [
        "How much does the time grow between flashes?",
        "Keep adding that same step.",
      ],
      visual: { widget: "numberLine", config: { min: 0, max: next3[2] + step, target: next3[0], step } },
      rocketEffect: { property: "circuitsWired", correctValue: 5, incorrectValue: 4, unit: "" },
    });
  },

  "KS3A-15": (tier, rng) => {
    const start = randInt(rng, 3, 8);
    const step = randInt(rng, 3, 6);
    const seq = [start, start + step, start + step * 2, start + step * 3];
    return makeTask({
      criterionCode: "KS3A-15",
      rocketPart: "electronics",
      station: "guidanceComputer",
      tier,
      briefing: `Staging pings follow the pattern ${seq.join(", ")}… The computer must predict ping n without counting up. Which nth-term rule should be programmed?`,
      engineeringContext:
        "An nth-term rule jumps straight to any ping — even the millionth.",
      answer: `${step}n + ${start - step}`,
      choices: [
        `${step}n + ${start - step}`,
        `${start}n + ${step}`,
        `${step}n + ${start}`,
      ],
      workedSteps: [
        `The gap between pings is ${step}, so the rule contains ${step}n.`,
        `Checking n as 1: ${step}n gives ${step}, and we need ${start} — adjust by ${start - step}. Rule: ${step}n + ${start - step}.`,
      ],
      hints: [
        "The common difference becomes the multiplier of n.",
        "Test your rule with the first term to find the adjustment.",
      ],
      visual: { widget: "equation", config: { formula: `${step}n + ${start - step}` } },
      rocketEffect: { property: "circuitsWired", correctValue: 5, incorrectValue: 4, unit: "" },
    });
  },

  "KS3A-16": (tier, rng) => {
    const start = pick(rng, [640, 800, 960] as const);
    const hops = [start, start / 2, start / 4];
    return makeTask({
      criterionCode: "KS3A-16",
      rocketPart: "electronics",
      station: "guidanceComputer",
      tier,
      briefing: `The relay signal strength halves with every hop: ${hops.join(", ")}… What kind of sequence is this?`,
      engineeringContext:
        "Halving sequences shrink fast — engineers plan relay chains around them.",
      answer: "geometric",
      choices: ["geometric", "arithmetic", "random"],
      workedSteps: [
        "Each term is found by scaling the previous one by the same factor (a half).",
        "Scaling by a constant factor makes a geometric sequence.",
      ],
      hints: [
        "Is each term found by ADDING the same amount or SCALING by the same factor?",
        "Halving is a scaling, not an adding.",
      ],
      visual: { widget: "graph", config: { mode: "geometric", start, ratio: 0.5 } },
      rocketEffect: { property: "circuitsWired", correctValue: 5, incorrectValue: 4, unit: "" },
    });
  },
};