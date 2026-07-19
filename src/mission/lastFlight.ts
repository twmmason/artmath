import type { FlightResult } from "../physics/types";

/** In-memory handoff of the last flight from LaunchPage → ReportPage. */
let last: {
  flight: FlightResult;
  missionId?: number;
  destinationId: string;
  tasksCorrect: number;
  tasksTotal: number;
  newPatches: string[];
} | null = null;

export function setLastFlight(v: NonNullable<typeof last>): void {
  last = v;
}
export function getLastFlight(): typeof last {
  return last;
}
