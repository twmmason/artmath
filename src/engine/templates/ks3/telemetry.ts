import type { TemplateMap } from "../../types";
import { makeTask } from "../helpers";
import { pick, randInt, shuffle } from "../../rng";

/**
 * TELEMETRY CENTRE — KS3 Statistics (KS3S-1 … KS3S-3), station "telemetryCentre".
 */
export const telemetryTemplates: TemplateMap = {
  "KS3S-1": (tier, rng) => {
    const base = randInt(rng, 120, 150);
    const flights = [
      base,
      base + randInt(rng, 5, 15),
      base - randInt(rng, 2, 8),
      base + randInt(rng, 150, 200), // the outlier
      base + randInt(rng, 3, 12),
    ];
    const shuffled = shuffle(rng, flights);
    const outlier = Math.max(...flights);
    const asking = pick(rng, ["median", "outlier"] as const);
    const sorted = [...flights].sort((a, b) => a - b);
    const median = sorted[2];
    return makeTask({
      criterionCode: "KS3S-1",
      rocketPart: "hull",
      station: "telemetryCentre",
      tier,
      briefing: `Your last 5 flights reached apogees of ${shuffled.join(", ")} km. ${
        asking === "median"
          ? "The review board wants the MEDIAN apogee (the middle value once sorted). What is it, in km?"
          : "One flight is a clear OUTLIER the review board should investigate. Which apogee is the outlier, in km?"
      }`,
      engineeringContext:
        "Telemetry statistics turn a season of flights into one honest summary.",
      answer: asking === "median" ? median : outlier,
      workedSteps: [
        `Sort the apogees: ${sorted.join(", ")}.`,
        asking === "median"
          ? `The middle (third) value is ${median} km.`
          : `${outlier} km sits far above the rest — that's the outlier.`,
      ],
      hints: [
        "Sort the values from smallest to largest first.",
        asking === "median"
          ? "The median is the middle value of the sorted list."
          : "The outlier is the value that sits far away from the others.",
      ],
      visual: {
        widget: "dataChart",
        config: { mode: "bar", values: shuffled.join(","), highlight: outlier },
      },
      rocketEffect: { property: "hullPanels", correctValue: 60, incorrectValue: 57, unit: "" },
    });
  },

  "KS3S-2": (tier, rng) => {
    const engines = 40;
    const fuel = 35;
    const payload = 15;
    const avionics = 10;
    const asking = pick(rng, [
      { name: "engines", pct: engines },
      { name: "fuel", pct: fuel },
      { name: "payload", pct: payload },
      { name: "avionics", pct: avionics },
    ] as const);
    const degrees = (asking.pct / 100) * 360;
    return makeTask({
      criterionCode: "KS3S-2",
      rocketPart: "hull",
      station: "telemetryCentre",
      tier,
      briefing: `The mass budget for the readiness review is: engines ${engines}%, fuel ${fuel}%, payload ${payload}%, avionics ${avionics}%. You're building the pie chart. How many degrees of the circle should the ${asking.name} slice take?`,
      engineeringContext:
        "Pie charts turn the mass budget into a picture the whole review board reads at once.",
      answer: degrees,
      workedSteps: [
        "The full circle of 360 degrees represents 100%.",
        `${asking.pct}% of 360 degrees is ${degrees} degrees.`,
      ],
      hints: [
        "The whole pie is 360 degrees for 100%.",
        `Find ${asking.pct} hundredths of 360.`,
      ],
      visual: {
        widget: "dataChart",
        config: { mode: "pie", engines, fuel, payload, avionics, highlight: asking.name },
      },
      rocketEffect: { property: "hullPanels", correctValue: 60, incorrectValue: 58, unit: "" },
    });
  },

  "KS3S-3": (tier, rng) => {
    void rng;
    return makeTask({
      criterionCode: "KS3S-3",
      rocketPart: "fins",
      station: "telemetryCentre",
      tier,
      briefing: `You plotted fin area against stability margin for your last 10 designs on the scatter board. The points climb steadily from bottom-left to top-right: bigger fins, bigger stability margin. What relationship should the aerodynamics memo report?`,
      engineeringContext:
        "Scatter graphs reveal whether two design numbers move together.",
      answer: "positive correlation",
      choices: ["positive correlation", "negative correlation", "no correlation"],
      workedSteps: [
        "As fin area increases, stability margin also increases.",
        "Points climbing together show positive correlation.",
      ],
      hints: [
        "Do the two quantities rise together, move oppositely, or ignore each other?",
        "Rising together has a special name.",
      ],
      visual: { widget: "dataChart", config: { mode: "scatter", trend: "positive" } },
      rocketEffect: { property: "finCount", correctValue: 4, incorrectValue: 3, unit: "" },
    });
  },
};