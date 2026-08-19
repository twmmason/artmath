import { describe, expect, it } from "vitest";
import {
  masteryForCriterion,
  ks2Mastery,
  stationUnlocks,
  destinationUnlocked,
  partLevel,
  xpForAnswer,
} from "../engine/mastery";
import type { Attempt } from "../db/db";

const at = (code: string, correct: boolean, tier = 2, daysAgo = 0): Attempt => ({
  profileId: "p",
  criterionCode: code,
  tier,
  correct,
  hintsUsed: 0,
  createdAt: Date.now() - daysAgo * 86400000,
});

describe("mastery engine", () => {
  it("mastery = 2 correct in a row at any tier", () => {
    const notYet = masteryForCriterion("4NF-1", [at("4NF-1", true)]);
    expect(notYet.mastered).toBe(false);
    const done = masteryForCriterion("4NF-1", [
      at("4NF-1", true),
      at("4NF-1", true),
    ]);
    expect(done.mastered).toBe(true);
    const tier1Also = masteryForCriterion("4NF-1", [
      at("4NF-1", true, 1),
      at("4NF-1", true, 1),
    ]);
    expect(tier1Also.mastered).toBe(true);
  });
  it("a wrong answer resets the streak", () => {
    const m = masteryForCriterion("4NF-1", [
      at("4NF-1", true),
      at("4NF-1", false),
      at("4NF-1", true),
    ]);
    expect(m.streak).toBe(1);
    expect(m.mastered).toBe(false);
  });
  it("spaced repetition: mastered items become due after interval", () => {
    const m = masteryForCriterion("4NF-1", [
      at("4NF-1", true, 2, 3),
      at("4NF-1", true, 2, 3),
    ]);
    expect(m.mastered).toBe(true);
    expect(m.dueAt).not.toBeNull();
    expect(m.dueAt! <= Date.now()).toBe(true); // interval 1 day, last seen 3 days ago
  });
  it("xp scales with tier and shrinks with hints", () => {
    expect(xpForAnswer(3, 0, true)).toBeGreaterThan(xpForAnswer(1, 0, true));
    expect(xpForAnswer(2, 2, true)).toBeLessThan(xpForAnswer(2, 0, true));
    expect(xpForAnswer(2, 0, false)).toBe(0);
  });
  it("ks2Mastery is 0 with no attempts", () => {
    expect(ks2Mastery([])).toBe(0);
  });
  it("stations start locked and report progress", () => {
    const u = stationUnlocks([], 0);
    expect(u.length).toBe(6);
    expect(u.every((s) => !s.unlocked)).toBe(true);
  });
  it("part levels rise with strand mastery", () => {
    expect(partLevel("engine", [])).toBe(1);
    const atts: Attempt[] = [];
    for (const code of ["4NF-1", "4NF-2"])
      for (let i = 0; i < 3; i++) atts.push(at(code, true));
    expect(partLevel("engine", atts)).toBe(2);
  });
});

describe("Year 7+ Academy toggle", () => {
  it("unlocks all six stations with no attempts when academyUnlocked", () => {
    const u = stationUnlocks([], 0, true);
    expect(u).toHaveLength(6);
    expect(u.every((s) => s.unlocked)).toBe(true);
    expect(u.every((s) => s.progress === 1)).toBe(true);
  });
  it("stations stay locked without the toggle and no attempts", () => {
    const u = stationUnlocks([], 0, false);
    expect(u.some((s) => s.unlocked)).toBe(false);
  });
  it("academy toggle opens Jupiter (needs 1 station)", () => {
    expect(destinationUnlocked("jupiter", [], 0, true)).toBe(true);
    expect(destinationUnlocked("jupiter", [], 0, false)).toBe(false);
  });
});
