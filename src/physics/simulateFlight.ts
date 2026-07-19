import type { RocketDesign } from "../three/rocketDesign";
import type { FlightResult, FlightSample, FlightPhase } from "./types";
import { computePerformance } from "./computePerformance";

/**
 * Step-by-step flight sim driven by the actual design's performance stats.
 * The trajectory is NOT canned: bad TWR struggles off the pad, high drag
 * bleeds speed, low fuel cuts the burn short.
 *
 * @param qualityFactor 0..1 — fraction of engineering tasks answered correctly;
 *   degrades effective thrust & drag slightly (parts at incorrectValue).
 */
export function simulateFlight(
  design: RocketDesign,
  targetAltitudeKm: number,
  qualityFactor = 1,
): FlightResult {
  const perf = computePerformance(design);
  const q = Math.max(0.3, Math.min(1, qualityFactor));

  const samples: FlightSample[] = [];
  const events: { t: number; label: string }[] = [];

  const dt = 0.5;
  let t = 0;
  let alt = 0; // metres
  let v = 0; // m/s
  let fuel = perf.fuelMass;
  const boosterBurn = design.boosterCount > 0 ? 20 : 0; // s
  let maxAlt = 0;
  let stagedAt: number | null = null;
  let maxqLogged = false;
  let arrivalLogged = false;

  const burnRate = perf.burnTime > 0 ? perf.fuelMass / perf.burnTime : 0;

  events.push({ t: 0, label: "Ignition and liftoff" });

  // safety cap of 10 minutes sim time
  while (t < 600) {
    const boostersActive = design.boosterCount > 0 && t < boosterBurn;
    const thrustkN =
      (fuel > 0 ? design.engineCount * design.thrustPerEngine * q : 0) +
      (boostersActive ? design.boosterCount * 400 : 0);
    const mass =
      perf.dryMass +
      fuel +
      (boostersActive ? 0 : 0); // boosters' dry mass dropped at staging (approx: keep in dryMass until staging)
    const weight = mass * 9.8; // N
    const thrustN = thrustkN * 1000;
    // atmospheric density falls off with altitude
    const airDensity = Math.exp(-alt / 8500);
    const dragN =
      0.5 * airDensity * (perf.dragCoeff + (1 - q) * 0.1) * v * Math.abs(v) * 3;
    const accel = (thrustN - weight - dragN) / Math.max(mass, 1);

    v += accel * dt;
    if (alt <= 0 && v < 0) v = 0;
    alt = Math.max(0, alt + v * dt);
    if (fuel > 0) fuel = Math.max(0, fuel - burnRate * dt * (thrustkN > 0 ? 1 : 0));
    maxAlt = Math.max(maxAlt, alt);

    let phase: FlightPhase = "liftoff";
    if (t < 1) phase = "pad";
    if (!maxqLogged && alt > 11000) {
      maxqLogged = true;
      events.push({ t, label: "Max-Q — maximum aerodynamic pressure" });
    }
    if (design.boosterCount > 0 && stagedAt === null && t >= boosterBurn) {
      stagedAt = t;
      events.push({ t, label: "Booster separation" });
      phase = "staging";
    }
    if (fuel <= 0 && thrustkN <= 0) {
      phase = v > 0 ? "coast" : "falling";
    }
    if (alt / 1000 >= targetAltitudeKm) {
      phase = "arrival";
      if (!arrivalLogged) {
        arrivalLogged = true;
        events.push({ t, label: "Destination altitude reached" });
      }
      // engine cutoff on arrival — coast from here
      fuel = 0;
      if (v > 50) v = 50;
    }
    samples.push({ t, altitudeKm: alt / 1000, velocity: v, phase });
    if (arrivalLogged && v <= 0) break;

    // stop once falling back near the ground with no thrust
    if (t > 5 && alt <= 0 && fuel <= 0) {
      events.push({ t, label: "Flight ended — back on the ground" });
      break;
    }
    // stop when clearly past apogee and descending in vacuum for a while
    if (v < -200 && fuel <= 0) {
      events.push({ t, label: `Apogee passed at ${(maxAlt / 1000).toFixed(0)} km` });
      break;
    }
    t += dt;
  }

  const maxAltitudeKm = maxAlt / 1000;
  const reached = maxAltitudeKm >= targetAltitudeKm;
  if (!reached) {
    if (perf.twr <= 1.2)
      events.push({ t, label: "TWR below 1.2 — the rocket struggled off the pad" });
    if (perf.dragCoeff > 0.4)
      events.push({ t, label: "High drag — a sharper nose cone would help" });
    if (design.tankFill < 0.5)
      events.push({ t, label: "Tanks ran dry early — consider a higher fuel load" });
  }

  return { samples, maxAltitudeKm, reached, events };
}