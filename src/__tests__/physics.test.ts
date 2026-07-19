import { describe, expect, it } from "vitest";
import { computePerformance } from "../physics/computePerformance";
import { simulateFlight } from "../physics/simulateFlight";
import { defaultRocketDesign } from "../three/rocketDesign";

describe("computePerformance", () => {
  it("default design is flight-ready with sane numbers", () => {
    const p = computePerformance(defaultRocketDesign());
    expect(p.twr).toBeGreaterThan(1.2);
    expect(p.deltaV).toBeGreaterThan(400);
    expect(p.stability).toBeGreaterThan(0.8);
    expect(p.flightReady).toBe(true);
  });
  it("more engines raises thrust and TWR", () => {
    const d = defaultRocketDesign();
    const p1 = computePerformance(d);
    const p2 = computePerformance({ ...d, engineCount: d.engineCount + 2 });
    expect(p2.totalThrust).toBeGreaterThan(p1.totalThrust);
    expect(p2.twr).toBeGreaterThan(p1.twr);
  });
  it("sharper nose cone means less drag", () => {
    const d = defaultRocketDesign();
    const sharp = computePerformance({ ...d, noseAngle: 20 });
    const blunt = computePerformance({ ...d, noseAngle: 110 });
    expect(sharp.dragCoeff).toBeLessThan(blunt.dragCoeff);
  });
  it("too few fins is unstable", () => {
    const d = { ...defaultRocketDesign(), finCount: 1, finSymmetry: false };
    expect(computePerformance(d).stability).toBeLessThan(0.8);
  });
});

describe("simulateFlight", () => {
  it("good rocket with perfect quality reaches low orbit", () => {
    const f = simulateFlight(defaultRocketDesign(), 150, 1);
    expect(f.maxAltitudeKm).toBeGreaterThanOrEqual(150);
    expect(f.reached).toBe(true);
    expect(f.samples.length).toBeGreaterThan(10);
  });
  it("poor quality flies lower than perfect quality", () => {
    const d = defaultRocketDesign();
    // very high target so neither flight hits the arrival cutoff — compares raw apogee
    const good = simulateFlight(d, 5000, 1);
    const poor = simulateFlight(d, 5000, 0.3);
    expect(poor.maxAltitudeKm).toBeLessThan(good.maxAltitudeKm);
  });
  it("boosters create a staging event", () => {
    const d = { ...defaultRocketDesign(), boosterCount: 2 };
    const f = simulateFlight(d, 150, 1);
    expect(f.events.some((e) => e.label.toLowerCase().includes("booster"))).toBe(true);
  });
});
