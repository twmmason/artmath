export interface RocketPerformance {
  totalMass: number; // kg
  dryMass: number; // kg
  fuelMass: number; // kg
  totalThrust: number; // kN
  twr: number; // thrust-to-weight ratio
  deltaV: number; // m/s
  dragCoeff: number;
  stability: number;
  burnTime: number; // s
  maxAltitude: number; // km
  flightReady: boolean;
  warnings: string[];
}

export interface FlightSample {
  t: number; // seconds
  altitudeKm: number;
  velocity: number; // m/s
  phase: FlightPhase;
}

export type FlightPhase =
  | "pad"
  | "liftoff"
  | "maxq"
  | "staging"
  | "coast"
  | "arrival"
  | "falling";

export interface FlightResult {
  samples: FlightSample[];
  maxAltitudeKm: number;
  reached: boolean;
  events: { t: number; label: string }[];
}