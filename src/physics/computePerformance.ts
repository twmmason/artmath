import type { RocketDesign } from "../three/rocketDesign";
import type { RocketPerformance } from "./types";

/**
 * Deterministic performance model (per §5 spec). Simplified but consistent:
 * design choices have visible, monotonic consequences.
 */
export function computePerformance(design: RocketDesign): RocketPerformance {
  const dryMass =
    design.hullHeight * 80 +
    design.engineCount * 120 +
    design.finCount * 35 +
    design.payloadPods * design.payloadPerPod * 25 +
    design.boosterCount * 150;
  const fuelMass = design.tankFill * design.hullHeight * 200;
  const totalMass = dryMass + fuelMass;
  const totalThrust =
    design.engineCount * design.thrustPerEngine + design.boosterCount * 400;
  const twr = totalThrust / (totalMass * 0.0098);
  const exhaustVelocity = 2500; // m/s (simplified)
  const deltaV =
    exhaustVelocity * Math.log((dryMass + fuelMass) / Math.max(dryMass, 1));
  // sharper nose (smaller tip angle) => less drag
  const dragCoeff = 0.2 + (design.noseAngle / 360) * 0.3;
  const stability =
    design.finCount >= 3 && design.finSymmetry
      ? 1.0 + design.finCount * 0.1
      : 0.3;
  const burnTime =
    fuelMass /
    Math.max(design.engineCount * design.thrustPerEngine * 0.4, 1) *
    100;
  const maxAltitude = (deltaV * burnTime * 0.5 * (1 - dragCoeff)) / 1000;

  const warnings: string[] = [];
  if (twr <= 1.2) warnings.push("TWR too low — add engines or shed mass");
  if (stability <= 0.8) warnings.push("UNSTABLE — add more fins (3+) with symmetry");
  if (design.tankFill <= 0.2) warnings.push("Fuel load too low for a full burn");

  return {
    totalMass,
    dryMass,
    fuelMass,
    totalThrust,
    twr,
    deltaV,
    dragCoeff,
    stability,
    burnTime,
    maxAltitude,
    flightReady: twr > 1.2 && stability > 0.8 && design.tankFill > 0.2,
    warnings,
  };
}