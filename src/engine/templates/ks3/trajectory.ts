import type { TemplateMap } from "../../types";
import { makeTask } from "../helpers";
import { pick, randInt } from "../../rng";

/**
 * TRAJECTORY PLANNER — KS3 Geometry & Measures
 * (KS3G-1 … KS3G-16), station "trajectoryPlanner".
 */
export const trajectoryTemplates: TemplateMap = {
  "KS3G-1": (tier, rng) => {
    const r = pick(rng, [1, 1.5, 2] as const);
    const h = randInt(rng, 6, 10);
    const answer = Math.round(Math.PI * r * r * h * 10) / 10;
    return makeTask({
      criterionCode: "KS3G-1",
      rocketPart: "fuelTank",
      station: "trajectoryPlanner",
      tier,
      briefing: `The main fuel tank is a cylinder with radius ${r} m and height ${h} m. The loading computer needs its volume before fuelling begins. Work it out in m³, to 1 decimal place (use 3.14 for pi).`,
      notation: `V = πr²h`,
      engineeringContext:
        "The tank's volume sets exactly how much propellant the mission can carry.",
      answer: Math.round(3.14 * r * r * h * 10) / 10,
      workedSteps: [
        `Square the radius: ${r * r}.`,
        `Scale by pi (3.14) and by the height ${h}: about ${Math.round(3.14 * r * r * h * 10) / 10} m³.`,
      ],
      hints: [
        "A cylinder's volume is its circular end area, stacked up its height.",
        "Find the circle's area first, then scale by the height.",
      ],
      visual: { widget: "scaleDiagram", config: { mode: "cylinder", r, h } },
      tolerance: Math.max(0.2, answer * 0.02),
      rocketEffect: { property: "tankFill", correctValue: 0.85, incorrectValue: 0.65, unit: "" },
    });
  },

  "KS3G-2": (tier, rng) => {
    const r = pick(rng, [2, 2.2, 2.5, 3] as const);
    const answer = Math.round(3.14 * r * r * 100) / 100;
    return makeTask({
      criterionCode: "KS3G-2",
      rocketPart: "noseCone",
      station: "trajectoryPlanner",
      tier,
      briefing: `The heat-shield is a disc of radius ${r} m. The workshop sprays ablative coating by area. How much area needs coating, in m² (use 3.14 for pi, answer to 2 decimal places)?`,
      notation: `A = πr²`,
      engineeringContext:
        "The coating order is priced by the square metre — the area must be right.",
      answer,
      workedSteps: [
        `Square the radius: ${r * r}.`,
        `Scale by pi: about ${answer} m².`,
      ],
      hints: [
        "A circle's area comes from its radius squared.",
        `Work out ${r} squared first.`,
      ],
      visual: { widget: "scaleDiagram", config: { mode: "circle", r } },
      tolerance: Math.max(0.1, answer * 0.02),
      rocketEffect: { property: "noseAngle", correctValue: 40, incorrectValue: 50, unit: "°" },
    });
  },

  "KS3G-3": (tier, rng) => {
    const angle = randInt(rng, 25, 155);
    return makeTask({
      criterionCode: "KS3G-3",
      rocketPart: "hull",
      station: "trajectoryPlanner",
      tier,
      briefing: `On the 1 to 50 pad drawing, measure the gantry's lean angle with the protractor. Read the protractor carefully and type the angle in degrees.`,
      engineeringContext:
        "Scale drawings keep true angles — what you measure on paper is real.",
      answer: angle,
      workedSteps: [
        "Place the protractor's centre on the angle's point.",
        `Line up the zero with one arm and read the other: ${angle} degrees.`,
      ],
      hints: [
        "Angles survive scaling — measure them straight off the drawing.",
        "Check you're reading the correct scale on the protractor.",
      ],
      visual: { widget: "protractor", config: { showAngle: angle, mode: "measure" } },
      tolerance: 3,
      rocketEffect: { property: "hullHeight", correctValue: 8, incorrectValue: 7.7, unit: "m" },
    });
  },

  "KS3G-4": (tier, rng) => {
    const angle = pick(rng, [60, 80, 90, 100, 120] as const);
    return makeTask({
      criterionCode: "KS3G-4",
      rocketPart: "hull",
      station: "trajectoryPlanner",
      tier,
      briefing: `The abort corridor must split the ${angle} degree launch angle exactly in half — a compass-and-ruler bisection on the plotting table. What angle does each half of the corridor make, in degrees?`,
      engineeringContext:
        "Bisecting the launch angle gives the abort corridor equal clearance both sides.",
      answer: angle / 2,
      workedSteps: [
        "An angle bisector cuts an angle into two equal halves.",
        `Half of ${angle} degrees is ${angle / 2} degrees.`,
      ],
      hints: [
        "Bisect means cut exactly in half.",
        `What is half of ${angle}?`,
      ],
      visual: { widget: "construction", config: { mode: "bisect", angle } },
      rocketEffect: { property: "noseAngle", correctValue: 40, incorrectValue: 48, unit: "°" },
    });
  },

  "KS3G-5": (tier, rng) => {
    void rng;
    return makeTask({
      criterionCode: "KS3G-5",
      rocketPart: "electronics",
      station: "trajectoryPlanner",
      tier,
      briefing: `The solar array is a regular hexagon, sketched on the plotting table for its deployment check. How many lines of symmetry must the inspector mark on it?`,
      engineeringContext:
        "Symmetry lines show where the array folds evenly for launch stowage.",
      answer: 6,
      workedSteps: [
        "A regular hexagon has a line of symmetry through each pair of opposite corners and each pair of opposite side-midpoints.",
        "Three of each kind: 6 lines in total.",
      ],
      hints: [
        "Regular polygons have as many symmetry lines as sides.",
        "A hexagon has six sides.",
      ],
      visual: { widget: "construction", config: { mode: "polygon", sides: 6 } },
      rocketEffect: { property: "powerBalanced", correctValue: 1, incorrectValue: 0, unit: "" },
    });
  },

  "KS3G-6": (tier, rng) => {
    void rng;
    return makeTask({
      criterionCode: "KS3G-6",
      rocketPart: "fins",
      station: "trajectoryPlanner",
      tier,
      briefing: `Strut triangles ABC and DEF each have two matching sides with the SAME angle between those sides. The inspector wants to certify them identical (congruent). Which congruence rule applies?`,
      engineeringContext:
        "Congruence rules let inspectors certify parts without measuring everything.",
      answer: "SAS",
      choices: ["SAS", "SSS", "ASA", "RHS"],
      workedSteps: [
        "Two sides and the INCLUDED angle match.",
        "Side, Angle, Side — the SAS congruence rule.",
      ],
      hints: [
        "List what matches: side, then the angle between, then side.",
        "The rule's letters follow that order.",
      ],
      visual: { widget: "construction", config: { mode: "congruence" } },
      rocketEffect: { property: "finSymmetry", correctValue: 1, incorrectValue: 0, unit: "" },
    });
  },

  "KS3G-7": (tier, rng) => {
    void rng;
    return makeTask({
      criterionCode: "KS3G-7",
      rocketPart: "payloadBay",
      station: "trajectoryPlanner",
      tier,
      briefing: `The service door is a quadrilateral with two pairs of parallel sides. The fitter needs its name for the parts order, and that name guarantees something about its opposite sides. What shape is the door?`,
      engineeringContext:
        "Naming a shape correctly tells the workshop all its guaranteed properties.",
      answer: "parallelogram",
      choices: ["parallelogram", "trapezium", "kite"],
      workedSteps: [
        "Two pairs of parallel sides define a parallelogram.",
        "That guarantees opposite sides are equal in length.",
      ],
      hints: [
        "Which quadrilateral family has BOTH pairs of sides parallel?",
        "Its name almost says 'parallel'.",
      ],
      visual: { widget: "construction", config: { mode: "quadrilateral" } },
      rocketEffect: { property: "payloadPods", correctValue: 4, incorrectValue: 3, unit: "" },
    });
  },

  "KS3G-8": (tier, rng) => {
    const deg = pick(rng, [90, 180] as const);
    return makeTask({
      criterionCode: "KS3G-8",
      rocketPart: "payloadBay",
      station: "trajectoryPlanner",
      tier,
      briefing: `The docking port drawing must line up with the station adapter, and turning it ${deg} degrees clockwise about the hull's centre does the job perfectly without changing its size. What kind of transformation is that?`,
      engineeringContext:
        "The maintenance log records every transformation applied to a drawing.",
      answer: "rotation",
      choices: ["rotation", "reflection", "translation", "enlargement"],
      workedSteps: [
        "The drawing turned about a fixed centre point.",
        "A turn about a centre is a rotation.",
      ],
      hints: [
        "Did the shape slide, flip, turn, or grow?",
        "Turning about a point has a special name.",
      ],
      visual: { widget: "grid", config: { mode: "rotate", degrees: deg } },
      rocketEffect: { property: "payloadPods", correctValue: 4, incorrectValue: 3, unit: "" },
    });
  },

  "KS3G-9": (tier, rng) => {
    const sf = pick(rng, [2, 3] as const);
    const x = randInt(rng, 1, 3);
    const y = randInt(rng, 1, 3);
    return makeTask({
      criterionCode: "KS3G-9",
      rocketPart: "fins",
      station: "trajectoryPlanner",
      tier,
      briefing: `The fin template has a corner at grid point (${x}, ${y}). Enlarge the template by scale factor ${sf} from the origin so it fits the Mk3 booster. Where does that corner move to? Give the new grid point.`,
      engineeringContext:
        "Enlargement from the origin scales every corner's coordinates the same way.",
      answer: `(${x * sf}, ${y * sf})`,
      workedSteps: [
        `Enlarging from the origin scales both coordinates by ${sf}.`,
        `(${x}, ${y}) moves to (${x * sf}, ${y * sf}).`,
      ],
      hints: [
        "Scale each coordinate by the scale factor.",
        `Both the across and the up numbers grow ${sf} times.`,
      ],
      visual: { widget: "grid", config: { mode: "enlarge", startX: x, startY: y, sf, size: 12 } },
      rocketEffect: { property: "finCount", correctValue: 4, incorrectValue: 3, unit: "" },
    });
  },

  "KS3G-10": (tier, rng) => {
    const a = randInt(rng, 95, 135);
    const b = randInt(rng, 80, 110);
    const answer = 360 - a - b;
    return makeTask({
      criterionCode: "KS3G-10",
      rocketPart: "hull",
      station: "trajectoryPlanner",
      tier,
      briefing: `Three support struts meet at a single point on the gantry, and their angles fill the full turn around that point. Two of the angles read ${a} degrees and ${b} degrees. What must the third strut's angle be?`,
      engineeringContext:
        "Angles around a point always complete a full turn — the check catches bent struts.",
      answer,
      workedSteps: [
        "Angles around a point fill a full turn of 360 degrees.",
        `Removing ${a} and ${b} from 360 leaves ${answer} degrees.`,
      ],
      hints: [
        "How many degrees make a complete turn?",
        `The two known angles account for ${a + b} of them.`,
      ],
      visual: { widget: "protractor", config: { mode: "aroundPoint", a, b } },
      rocketEffect: { property: "hullHeight", correctValue: 8, incorrectValue: 7.8, unit: "m" },
    });
  },

  "KS3G-11": (tier, rng) => {
    const angle = randInt(rng, 30, 60);
    return makeTask({
      criterionCode: "KS3G-11",
      rocketPart: "hull",
      station: "trajectoryPlanner",
      tier,
      briefing: `The launch rail crosses two PARALLEL support beams. Where it crosses the first beam it makes an angle of ${angle} degrees. Without measuring, the planner writes down the matching (corresponding) angle where the rail crosses the second beam. What is that angle?`,
      engineeringContext:
        "Parallel-line angle rules save the survey team a second measurement.",
      answer: angle,
      workedSteps: [
        "A line crossing parallel beams makes equal corresponding angles at each crossing.",
        `So the second crossing also shows ${angle} degrees.`,
      ],
      hints: [
        "Parallel beams never change direction between crossings.",
        "Corresponding angles on parallel lines are equal.",
      ],
      visual: { widget: "construction", config: { mode: "parallel", angle } },
      rocketEffect: { property: "hullHeight", correctValue: 8, incorrectValue: 7.7, unit: "m" },
    });
  },

  "KS3G-12": (tier, rng) => {
    const sides = pick(rng, [6, 8] as const);
    const answer = ((sides - 2) * 180) / sides;
    return makeTask({
      criterionCode: "KS3G-12",
      rocketPart: "noseCone",
      station: "trajectoryPlanner",
      tier,
      briefing: `The antenna dish rim is a regular ${sides === 6 ? "hexagon" : "octagon"} (${sides} equal sides). The fabricator must bend each rim segment to the interior angle. What is each interior angle, in degrees?`,
      engineeringContext:
        "One wrong bend angle and the rim segments won't close into a ring.",
      answer,
      workedSteps: [
        `The interior angles of a ${sides}-sided polygon total ${(sides - 2) * 180} degrees.`,
        `Shared equally over ${sides} corners: ${answer} degrees each.`,
      ],
      hints: [
        "Split the polygon into triangles from one corner to find the total.",
        "Then share the total equally between the corners.",
      ],
      visual: { widget: "construction", config: { mode: "polygon", sides } },
      rocketEffect: { property: "noseAngle", correctValue: 40, incorrectValue: 47, unit: "°" },
    });
  },

  "KS3G-13": (tier, rng) => {
    void rng;
    return makeTask({
      criterionCode: "KS3G-13",
      rocketPart: "hull",
      station: "trajectoryPlanner",
      tier,
      briefing: `The access ramp forms a triangle with sides 3 m, 4 m and 5 m. To certify its right angle for the safety board, check whether the square of the longest side equals the squares of the other two sides combined. Does the check pass — yes or no?`,
      notation: `3² + 4² = 9 + 16 = 25 = 5²`,
      engineeringContext:
        "Pythagoras' check is how surveyors certify right angles without a protractor.",
      answer: "yes",
      choices: ["yes", "no"],
      workedSteps: [
        "The squares of the two shorter sides are 9 and 16, totalling 25.",
        "The square of the longest side is also 25 — the right angle is certified.",
      ],
      hints: [
        "Square each side length first.",
        "Compare the two short squares combined with the long square.",
      ],
      visual: { widget: "construction", config: { mode: "pythagoras", a: 3, b: 4, c: 5 } },
      rocketEffect: { property: "hullHeight", correctValue: 8, incorrectValue: 7.8, unit: "m" },
    });
  },

  "KS3G-14": (tier, rng) => {
    const [a, b, c] = pick(rng, [
      [300, 400, 500],
      [60, 80, 100],
      [90, 120, 150],
      [150, 200, 250],
    ] as const);
    return makeTask({
      criterionCode: "KS3G-14",
      rocketPart: "hull",
      station: "trajectoryPlanner",
      tier,
      briefing: `At engine cutoff the rocket is ${a} km straight up and ${b} km downrange. The tracking dish needs the straight-line distance to the rocket. Use the right-angled triangle on the plotting table to calculate it, in km.`,
      notation: `d² = ${a}² + ${b}²`,
      engineeringContext:
        "The dish aims along the hypotenuse — the direct line to the rocket.",
      answer: c,
      workedSteps: [
        `Square both legs: ${a * a} and ${b * b}, totalling ${a * a + b * b}.`,
        `The square root of ${a * a + b * b} is ${c} km.`,
      ],
      hints: [
        "Height and downrange distance are the two short sides of a right triangle.",
        "Pythagoras gives the long side.",
      ],
      visual: { widget: "construction", config: { mode: "pythagoras", a, b, c } },
      rocketEffect: { property: "hullHeight", correctValue: 8, incorrectValue: 7.9, unit: "m" },
    });
  },

  "KS3G-15": (tier, rng) => {
    const asking = pick(rng, ["faces", "edges", "vertices"] as const);
    const answers = { faces: 8, edges: 18, vertices: 12 } as const;
    return makeTask({
      criterionCode: "KS3G-15",
      rocketPart: "payloadBay",
      station: "trajectoryPlanner",
      tier,
      briefing: `The cargo container is a hexagonal prism (a hexagon stretched into a solid). The packing manifest asks: how many ${asking} does it have?`,
      engineeringContext:
        "Face, edge and vertex counts tell the loaders how the container stacks and straps.",
      answer: answers[asking],
      workedSteps: [
        "A hexagonal prism has 2 hexagonal ends and 6 rectangular sides (8 faces).",
        `It has 18 edges and 12 vertices. You need the ${asking}: ${answers[asking]}.`,
      ],
      hints: [
        "Count the two hexagon ends first, then what joins them.",
        "Each hexagon corner contributes a vertex at both ends.",
      ],
      visual: { widget: "construction", config: { mode: "prism", sides: 6 } },
      rocketEffect: { property: "payloadPods", correctValue: 4, incorrectValue: 3, unit: "" },
    });
  },

  "KS3G-16": (tier, rng) => {
    const m = pick(rng, [40, 30, 50] as const);
    return makeTask({
      criterionCode: "KS3G-16",
      rocketPart: "hull",
      station: "trajectoryPlanner",
      tier,
      briefing: `On the ascent plot the flight path climbs ${m} km for every 1 minute across. The planner must express the same path as an algebraic rule AND check it matches the sketch. Which rule matches the plotted line?`,
      notation: `h = ${m}t`,
      engineeringContext:
        "One relationship, two languages: the rule and the drawing must agree.",
      answer: `h = ${m}t`,
      choices: [`h = ${m}t`, `h = t + ${m}`, `t = ${m}h`],
      workedSteps: [
        `Climbing ${m} km per minute means height is ${m} scaled by the minutes.`,
        `That is the rule h = ${m}t — a straight line through the origin with steepness ${m}.`,
      ],
      hints: [
        "The climb per minute becomes the multiplier of t.",
        "The line passes through the origin — no extra number added.",
      ],
      visual: { widget: "graph", config: { mode: "line", m, c: 0 } },
      rocketEffect: { property: "hullHeight", correctValue: 8, incorrectValue: 7.8, unit: "m" },
    });
  },
};