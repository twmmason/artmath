import { describe, expect, it } from "vitest";
import { checkAnswer } from "../engine/types";
import type { GeneratedTask } from "../engine/types";

const base = (over: Partial<GeneratedTask>): GeneratedTask => ({
  id: "t",
  criterionCode: "4NF-1",
  rocketPart: "engine",
  tier: 1,
  briefing: "b",
  engineeringContext: "c",
  answer: "56",
  workedSteps: ["s"],
  hints: ["h"],
  visual: { widget: "ruler", config: {} },
  rocketEffect: { property: "x", correctValue: 1, incorrectValue: 0, unit: "" },
  ...over,
});

describe("answer checking (§7 rules)", () => {
  it("accepts equivalent numeric forms incl. units and thousands separators", () => {
    expect(checkAnswer(base({}), "56")).toBe(true);
    expect(checkAnswer(base({}), "56.0")).toBe(true);
    expect(checkAnswer(base({}), "56 kg")).toBe(true);
    expect(checkAnswer(base({ answer: "1250" }), "1,250")).toBe(true);
    expect(checkAnswer(base({}), "57")).toBe(false);
  });
  it("applies tolerance for measurement widgets", () => {
    const t = base({ answer: "90", tolerance: 3 });
    expect(checkAnswer(t, "92")).toBe(true);
    expect(checkAnswer(t, "94")).toBe(false);
  });
  it("accepts equivalent fractions unless exact form demanded", () => {
    const t = base({ answer: "1/2", acceptEquivalentFractions: true });
    expect(checkAnswer(t, "2/4")).toBe(true);
    const exact = base({ answer: "1/2" });
    expect(checkAnswer(exact, "2/4")).toBe(false);
    expect(checkAnswer(exact, "1/2")).toBe(true);
  });
  it("accepts listed answers", () => {
    const t = base({ answer: "cone", acceptAnswers: ["cone", "a cone"] });
    expect(checkAnswer(t, "A Cone")).toBe(true);
  });
});
