export interface Destination {
  id: string;
  name: string;
  emoji: string;
  targetAltitudeKm: number;
  tierRange: [number, number];
  ks3: boolean;
  description: string;
  unlockHint: string;
}

export const DESTINATIONS: Destination[] = [
  { id: "orbit", name: "Low Orbit", emoji: "🛸", targetAltitudeKm: 150, tierRange: [1, 1], ks3: false, description: "Skim the edge of space and circle the Earth", unlockHint: "Always available" },
  { id: "moon", name: "The Moon", emoji: "🌙", targetAltitudeKm: 300, tierRange: [1, 2], ks3: false, description: "Follow in the bootprints of Apollo", unlockHint: "Master 10% of KS2 systems" },
  { id: "mars", name: "Mars", emoji: "🔴", targetAltitudeKm: 500, tierRange: [2, 3], ks3: false, description: "The red planet awaits its first rocket", unlockHint: "Master 30% of KS2 systems" },
  { id: "deep", name: "Deep Space", emoji: "✨", targetAltitudeKm: 800, tierRange: [3, 3], ks3: false, description: "Beyond the planets, into the dark", unlockHint: "Master 50% of KS2 systems" },
  { id: "jupiter", name: "Jupiter", emoji: "🪐", targetAltitudeKm: 1200, tierRange: [1, 2], ks3: true, description: "The giant of the solar system — an Advanced Programme mission", unlockHint: "Power up your first Mission Control station" },
  { id: "saturn", name: "Saturn", emoji: "💫", targetAltitudeKm: 1600, tierRange: [2, 3], ks3: true, description: "Thread the rings — advanced navigation required", unlockHint: "Master 25% of KS3 systems + 4 stations open" },
  { id: "interstellar", name: "Interstellar", emoji: "🌌", targetAltitudeKm: 2500, tierRange: [3, 3], ks3: true, description: "Leave the Sun behind. The ultimate mission.", unlockHint: "Master 50% of KS3 systems + all 6 stations open" },
];

export function destinationById(id: string): Destination {
  return DESTINATIONS.find((d) => d.id === id) ?? DESTINATIONS[0];
}
