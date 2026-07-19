import type { TemplateMap } from "../types";
import { makeTask } from "./helpers";
import { pick, randInt, shuffle } from "../rng";

/**
 * NOSE CONE — Geometry strand.
 * Covers: 1G-1, 1G-2, 2G-1, 3G-1, 4G-1, 4G-2, 5G-1, 6G-1
 */
export const noseconeTemplates: TemplateMap = {
  "1G-1": (tier, rng) => {
    const decoys = shuffle(rng, ["cube", "sphere", "cylinder"]).slice(
      0,
      tier === 1 ? 2 : 3,
    );
    const choices = shuffle(rng, ["cone", ...decoys]);
    return makeTask({
      criterionCode: "1G-1",
      rocketPart: "noseCone",
      tier,
      briefing:
        "The parts tray has arrived from the workshop. The rocket's nose must slice through the air, so we need the pointed part. Which of these parts is the cone we need for the nose?",
      engineeringContext:
        "A cone-shaped nose lets the rocket cut through the atmosphere smoothly.",
      answer: "cone",
      choices,
      workedSteps: [
        "Look for the part with a circular base that narrows to a single point.",
        "The cube has flat square faces, the sphere is round all over, and the cylinder has two flat circular ends.",
        "The cone is the one with the pointed tip — that's our nose part.",
      ],
      hints: [
        "The nose part needs a sharp point at the top to cut through the air.",
        "It has a round bottom so it sits perfectly on the circular hull.",
      ],
      visual: { widget: "protractor", config: { mode: "identify" } },
      rocketEffect: {
        property: "noseAngle",
        correctValue: 40,
        incorrectValue: 70,
        unit: "°",
      },
    });
  },

  "1G-2": (tier, rng) => {
    const stackOrder = ["cone", "cylinder"];
    const choices = shuffle(rng, [
      "cone on top of the cylinder",
      "cylinder on top of the cone",
      "cone next to the cylinder",
    ]);
    void stackOrder;
    return makeTask({
      criterionCode: "1G-2",
      rocketPart: "noseCone",
      tier,
      briefing:
        "Time to build the nose section. The workshop sent a cone and a cylinder, and they must fit together so the pointed end faces the sky. How should we stack them?",
      engineeringContext:
        "The nose section is built from two simple shapes joined together — real rockets are too.",
      answer: "cone on top of the cylinder",
      choices,
      workedSteps: [
        "The rocket flies point-first, so the pointed shape must be at the very top.",
        "The cylinder is the body piece, so it sits underneath.",
        "Stack the cone on top of the cylinder — a perfect nose section.",
      ],
      hints: [
        "Which end of the rocket meets the air first when it flies upward?",
        "The flat circular base of the cone matches the flat top of the cylinder.",
      ],
      visual: { widget: "protractor", config: { mode: "compose" } },
      rocketEffect: {
        property: "noseHeight",
        correctValue: 2,
        incorrectValue: 1.2,
        unit: "m",
      },
    });
  },

  "2G-1": (tier, rng) => {
    const asking = pick(rng, ["sides", "corners"] as const);
    return makeTask({
      criterionCode: "2G-1",
      rocketPart: "noseCone",
      tier,
      briefing: `The blueprint shows the nose cone sliced straight down the middle — its cross-section is a triangle. The certification form asks about that triangle. How many ${asking} does it have?`,
      engineeringContext:
        "Engineers describe parts by their cross-sections — knowing the triangle's properties helps the workshop cut it correctly.",
      answer: 3,
      choices: tier === 1 ? shuffle(rng, [3, 4, 5]) : undefined,
      workedSteps: [
        "Picture cutting the cone straight down through the tip.",
        "The flat shape you see is a triangle.",
        `A triangle always has 3 sides and 3 corners, so it has 3 ${asking}.`,
      ],
      hints: [
        "Trace the outline of the cross-section shape with your finger.",
        "Count each straight edge (or each point where two edges meet).",
      ],
      visual: { widget: "protractor", config: { mode: "crossSection" } },
      rocketEffect: {
        property: "noseAngle",
        correctValue: 40,
        incorrectValue: 60,
        unit: "°",
      },
    });
  },

  "3G-1": (tier, rng) => {
    void rng;
    return makeTask({
      criterionCode: "3G-1",
      rocketPart: "noseCone",
      tier,
      briefing:
        "The nose cone must meet the hull at a perfect right angle or air will leak into the joint. Use the protractor to set the joint angle to exactly a right angle. How many degrees is that?",
      engineeringContext:
        "A square joint keeps the airflow smooth where the nose meets the body.",
      answer: 90,
      choices: tier === 1 ? [45, 90, 180] : undefined,
      workedSteps: [
        "A right angle is the angle in a perfect square corner.",
        "On the protractor, the square corner lines up with the 90 mark.",
        "Set the joint to 90 degrees.",
      ],
      hints: [
        "Think of the corner of a book or a window frame — that's a right angle.",
        "It's exactly halfway between flat (180) and closed (0) on the protractor.",
      ],
      visual: {
        widget: "protractor",
        config: { targetAngle: 90, mode: "set" },
      },
      tolerance: 3,
      rocketEffect: {
        property: "noseAngle",
        correctValue: 40,
        incorrectValue: 55,
        unit: "°",
      },
    });
  },

  "4G-1": (tier, rng) => {
    const kind = pick(rng, ["acute", "right", "obtuse"] as const);
    const angle =
      kind === "acute"
        ? randInt(rng, 20, 70)
        : kind === "right"
          ? 90
          : randInt(rng, 100, 160);
    return makeTask({
      criterionCode: "4G-1",
      rocketPart: "noseCone",
      tier,
      briefing: `The wind-tunnel team measured this nose cone's tip angle at ${angle} degrees and need it classified for the drag report. Is a ${angle} degree tip angle acute, right, or obtuse?`,
      engineeringContext:
        "Sharper (acute) tips slice the air better; blunt (obtuse) tips create more drag.",
      answer: kind,
      choices: ["acute", "right", "obtuse"],
      workedSteps: [
        "An acute angle is smaller than 90 degrees.",
        "A right angle is exactly 90 degrees.",
        `An obtuse angle is bigger than 90 degrees. ${angle} degrees is ${kind}.`,
      ],
      hints: [
        "Compare the angle with a square corner (90 degrees).",
        `Is ${angle} smaller than, equal to, or bigger than 90?`,
      ],
      visual: {
        widget: "protractor",
        config: { showAngle: angle, mode: "classify" },
      },
      rocketEffect: {
        property: "noseAngle",
        correctValue: Math.min(angle, 60),
        incorrectValue: 70,
        unit: "°",
      },
    });
  },

  "4G-2": (tier, rng) => {
    const a = randInt(rng, 20, 35);
    const b = a + randInt(rng, 10, 20);
    const c = b + randInt(rng, 10, 25);
    const designs = shuffle(rng, [
      { name: "Falcon tip", angle: a },
      { name: "Hawk tip", angle: b },
      { name: "Owl tip", angle: c },
    ]);
    const smallest = designs.reduce((m, d) => (d.angle < m.angle ? d : m));
    return makeTask({
      criterionCode: "4G-2",
      rocketPart: "noseCone",
      tier,
      briefing: `Three nose cone designs are on the bench: ${designs
        .map((d) => `${d.name} with a ${d.angle} degree tip`)
        .join(", ")}. The sharpest tip gives the least drag. Which design should we fit?`,
      engineeringContext:
        "Comparing tip angles tells us which cone will fly fastest.",
      answer: smallest.name,
      choices: designs.map((d) => d.name),
      workedSteps: [
        `List the tip angles: ${designs.map((d) => d.angle).join(", ")} degrees.`,
        "The smallest angle means the sharpest, lowest-drag tip.",
        `${smallest.name} has the smallest angle at ${smallest.angle} degrees.`,
      ],
      hints: [
        "Sharper means a SMALLER tip angle.",
        "Put the three angles in order from smallest to largest first.",
      ],
      visual: {
        widget: "protractor",
        config: { mode: "order", angles: designs.map((d) => d.angle).join(",") },
      },
      rocketEffect: {
        property: "noseAngle",
        correctValue: smallest.angle,
        incorrectValue: designs[0].angle,
        unit: "°",
      },
    });
  },

  "5G-1": (tier, rng) => {
    const step = tier >= 3 ? 1 : 5;
    const angle =
      tier === 1 ? pick(rng, [30, 45, 60]) : randInt(rng, 20 / step, 140 / step) * step;
    return makeTask({
      criterionCode: "5G-1",
      rocketPart: "noseCone",
      tier,
      briefing:
        "Quality control wants an exact reading of this nose cone's tip angle before it can be certified. Line up the protractor with the two edges of the tip and type your reading in degrees.",
      engineeringContext:
        "The tip angle goes on the certification plate — it sets the cone's drag rating.",
      answer: angle,
      workedSteps: [
        "Place the protractor's centre point exactly on the tip of the cone.",
        "Line the zero line up with one edge of the cone.",
        `Read where the other edge crosses the scale: ${angle} degrees.`,
      ],
      hints: [
        "Make sure the protractor's cross-hair sits right on the tip point.",
        "Follow the second edge out to the numbered scale and read the mark it crosses.",
      ],
      visual: {
        widget: "protractor",
        config: { showAngle: angle, mode: "measure" },
      },
      tolerance: 3,
      rocketEffect: {
        property: "noseAngle",
        correctValue: Math.min(angle, 60),
        incorrectValue: 70,
        unit: "°",
      },
    });
  },

  "6G-1": (tier, rng) => {
    const shape = pick(
      rng,
      tier === 1
        ? ([{ name: "an isosceles triangle", lines: 1 }] as const)
        : ([
            { name: "an isosceles triangle", lines: 1 },
            { name: "an equilateral triangle", lines: 3 },
            { name: "a square", lines: 4 },
          ] as const),
    );
    return makeTask({
      criterionCode: "6G-1",
      rocketPart: "noseCone",
      tier,
      briefing: `The nose cone's cross-section on the blueprint is ${shape.name}. A symmetrical cross-section keeps the rocket balanced in flight. How many lines of symmetry does this cross-section have?`,
      engineeringContext:
        "Symmetry means the air pushes evenly on both sides — no wobble.",
      answer: shape.lines,
      choices: tier === 1 ? shuffle(rng, [0, 1, 2]) : undefined,
      workedSteps: [
        "A line of symmetry folds the shape exactly onto itself.",
        `Try folding ${shape.name} in different directions.`,
        `It folds perfectly along ${shape.lines} line${shape.lines === 1 ? "" : "s"}.`,
      ],
      hints: [
        "Imagine folding the paper blueprint — where do the two halves match exactly?",
        "Check folds through each corner and through the middle of each side.",
      ],
      visual: {
        widget: "grid",
        config: { mode: "symmetry", shape: shape.name },
      },
      rocketEffect: {
        property: "noseAngle",
        correctValue: 40,
        incorrectValue: 50,
        unit: "°",
      },
    });
  },
};