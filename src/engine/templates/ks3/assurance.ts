import type { TemplateMap } from "../../types";
import { makeTask } from "../helpers";
import { pick, randInt } from "../../rng";

/**
 * MISSION ASSURANCE — KS3 Probability (KS3P-1 … KS3P-4), station "missionAssurance".
 */
export const assuranceTemplates: TemplateMap = {
  "KS3P-1": (tier, rng) => {
    const total = pick(rng, [20, 25, 50] as const);
    const clear = Math.round(total * pick(rng, [0.6, 0.7, 0.8] as const));
    const answer = clear / total;
    return makeTask({
      criterionCode: "KS3P-1",
      rocketPart: "hull",
      station: "missionAssurance",
      tier,
      briefing: `The weather team flew ${total} balloon tests this month: ${clear} came back clear and the rest stormy. Set the launch-weather dial to the experimental probability of clear skies, as a decimal between 0 and 1.`,
      engineeringContext:
        "The launch decision dial runs from 0 (impossible) to 1 (certain).",
      answer,
      workedSteps: [
        `${clear} clear results out of ${total} tests.`,
        `As a decimal on the 0 to 1 dial: ${answer}.`,
      ],
      hints: [
        "Experimental probability is successes out of total trials.",
        `Write ${clear} out of ${total} as a decimal.`,
      ],
      visual: { widget: "riskDial", config: { mode: "set", target: answer } },
      tolerance: 0.02,
      rocketEffect: { property: "hullPanels", correctValue: 60, incorrectValue: 57, unit: "" },
    });
  },

  "KS3P-2": (tier, rng) => {
    const perfect = pick(rng, [0.8, 0.85, 0.9] as const);
    const wobble = pick(rng, [0.05, 0.1] as const);
    const answer = Math.round((1 - perfect - wobble) * 100) / 100;
    return makeTask({
      criterionCode: "KS3P-2",
      rocketPart: "hull",
      station: "missionAssurance",
      tier,
      briefing: `The flight review board lists three possible outcomes for the ascent: perfect ascent at ${perfect}, minor wobble at ${wobble}, and abort. The board insists every possible outcome is covered — the three probabilities must together make exactly 1. What probability must be assigned to abort?`,
      engineeringContext:
        "If the probabilities don't total 1, an outcome has been forgotten.",
      answer,
      workedSteps: [
        `The listed outcomes account for ${perfect} and ${wobble}, totalling ${Math.round((perfect + wobble) * 100) / 100}.`,
        `The rest of the way to 1 is ${answer} — that's the abort probability.`,
      ],
      hints: [
        "All the probabilities together must reach exactly 1.",
        `How far short of 1 do the two known outcomes fall?`,
      ],
      visual: { widget: "riskDial", config: { mode: "sumToOne", known: perfect + wobble } },
      tolerance: 0.005,
      rocketEffect: { property: "powerBalanced", correctValue: 1, incorrectValue: 0, unit: "" },
    });
  },

  "KS3P-3": (tier, rng) => {
    const total = 40;
    const pressure = randInt(rng, 26, 30);
    const cold = randInt(rng, 23, 27);
    const both = randInt(rng, 16, 20);
    const neither = total - (pressure + cold - both);
    return makeTask({
      criterionCode: "KS3P-3",
      rocketPart: "fuelTank",
      station: "missionAssurance",
      tier,
      briefing: `${total} valves were tested: ${pressure} passed the pressure test, ${cold} passed the cold-soak test, and ${both} passed BOTH. Sort them on the Venn board — how many valves failed both tests?`,
      engineeringContext:
        "Valves that failed both tests go straight back to the supplier.",
      answer: neither,
      workedSteps: [
        `Only-pressure: ${pressure - both}. Only-cold: ${cold - both}. Both: ${both}.`,
        `Those cover ${pressure + cold - both} valves, leaving ${neither} outside both circles.`,
      ],
      hints: [
        "Fill in the overlap of the Venn diagram first.",
        "Whatever isn't inside either circle failed both tests.",
      ],
      visual: {
        widget: "venn",
        config: { total, setA: pressure, setB: cold, both },
      },
      rocketEffect: { property: "fuelRatio", correctValue: 2.5, incorrectValue: 2.3, unit: "" },
    });
  },

  "KS3P-4": (tier, rng) => {
    void rng;
    return makeTask({
      criterionCode: "KS3P-4",
      rocketPart: "payloadBay",
      station: "missionAssurance",
      tier,
      briefing: `The capsule has two independent parachute switches, and after re-entry shaking each is equally likely to be ON or OFF. List the sample space (ON-ON, ON-OFF, OFF-ON, OFF-OFF). What is the probability that AT LEAST ONE switch is ON? Answer as a fraction.`,
      engineeringContext:
        "Redundant switches survive shaking — the sample space proves how well.",
      answer: "3/4",
      acceptEquivalentFractions: true,
      workedSteps: [
        "The sample space has four equally likely outcomes.",
        "Three of them include at least one ON — probability 3/4.",
      ],
      hints: [
        "Write out all four switch combinations.",
        "Count the combinations with at least one ON.",
      ],
      visual: { widget: "venn", config: { mode: "sampleSpace", outcomes: 4 } },
      rocketEffect: { property: "payloadPods", correctValue: 4, incorrectValue: 3, unit: "" },
    });
  },
};