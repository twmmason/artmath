import { describe, expect, it } from "vitest";
import { validateOutput } from "../ai/flightDirector";
import { getClient } from "../ai/gemini";
import { adaptiveHint } from "../ai/hints";
import { paraphraseBriefing } from "../ai/paraphrase";
import { narrateDebrief } from "../ai/debrief";
import { generateTask } from "../engine";

describe("AI validators & offline fallbacks (no key set in tests)", () => {
  it("rejects hints that leak the answer", () => {
    expect(validateOutput("The answer is 56", "56")).toBe(false);
    expect(validateOutput("Count the bolts on each side first", "56")).toBe(true);
  });
  it("rejects operation symbols", () => {
    expect(validateOutput("Try 7 × 8 to get there", "99")).toBe(false);
    expect(validateOutput("Think about equal groups of bolts", "99")).toBe(true);
  });
  it("rejects banned negative words and over-long text", () => {
    expect(validateOutput("That is wrong, try harder", "5")).toBe(false);
    expect(validateOutput("x".repeat(900), "5")).toBe(false);
  });
  it("getClient returns null without keys (fallback mode)", () => {
    expect(getClient()).toBeNull();
  });
  it("hints degrade to static template hints", async () => {
    const task = generateTask("4NF-1", 2, 5);
    const hint = await adaptiveHint(task, "12", 0, "Artie");
    expect(task.hints).toContain(hint);
  });
  it("paraphrase degrades to the original briefing", async () => {
    const task = generateTask("3F-1", 1, 5);
    expect(await paraphraseBriefing(task, "Artie")).toBe(task.briefing);
  });
  it("debrief degrades to static narration mentioning the destination", async () => {
    const text = await narrateDebrief({
      profileName: "Artie",
      destinationName: "Low Orbit",
      siteName: "Cape Canaveral",
      tasksCorrect: 10,
      tasksTotal: 12,
      maxAltitudeKm: 180,
      reached: true,
      eventLabels: [],
    });
    expect(text).toContain("Low Orbit");
    expect(text).toContain("Artie");
  });
});
