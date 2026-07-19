import { describe, expect, it } from "vitest";
import { CRITERIA } from "../curriculum/criteria";
import { ALL_TEMPLATES, generateTask, generateChecklist } from "../engine";
import { makeRng } from "../engine/rng";
import { briefingViolatesRule4 } from "../engine/types";

describe("task templates (all 146 criteria)", () => {
  it("has a template for every criterion", () => {
    const missing = CRITERIA.filter((c) => !ALL_TEMPLATES[c.code]).map((c) => c.code);
    expect(missing).toEqual([]);
  });

  for (const c of CRITERIA) {
    it(`${c.code} generates valid tasks at every tier`, () => {
      for (const tier of [1, 2, 3]) {
        for (const seed of [1, 42, 999]) {
          const t = generateTask(c.code, tier, seed);
          expect(t.criterionCode).toBe(c.code);
          expect(t.briefing.length).toBeGreaterThan(10);
          expect(t.answer.length).toBeGreaterThan(0);
          expect(t.workedSteps.length).toBeGreaterThan(0);
          expect(t.hints.length).toBeGreaterThan(0);
          expect(t.visual.widget).toBeTruthy();
          expect(t.rocketEffect.property).toBeTruthy();
          // §10 rule 4: no operation symbols in the briefing (KS3 notation
          // is carried in the separate `notation` field, never the briefing)
          expect(
            briefingViolatesRule4(t.briefing),
            `${c.code} tier ${tier} briefing contains an operation symbol: ${t.briefing}`,
          ).toBe(false);
          if (t.choices) expect(t.choices).toContain(t.answer);
        }
      }
    });
  }

  it("same seed produces the same task (deterministic)", () => {
    const a = generateTask("4NF-1", 2, 7);
    const b = generateTask("4NF-1", 2, 7);
    expect(a.briefing).toBe(b.briefing);
    expect(a.answer).toBe(b.answer);
  });

  it("pre-flight checklist yields 5 NF tasks with situations first", () => {
    const list = generateChecklist(makeRng(3), 1);
    expect(list.length).toBe(5);
    for (const t of list) {
      expect(briefingViolatesRule4(t.briefing)).toBe(false);
      expect(t.visual.widget).toBe("checklist");
    }
  });
});
