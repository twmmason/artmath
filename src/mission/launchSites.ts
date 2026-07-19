export interface LaunchSite {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  description: string;
  terrain: "coastal" | "steppe" | "jungle" | "island";
}

export const LAUNCH_SITES: LaunchSite[] = [
  { id: "canaveral", name: "Cape Canaveral", country: "🇺🇸 USA", lat: 28.3922, lon: -80.6077, terrain: "coastal", description: "Where the Moon missions launched" },
  { id: "starbase", name: "Starbase, Texas", country: "🇺🇸 USA", lat: 25.9972, lon: -97.156, terrain: "coastal", description: "Home of the biggest rocket ever built" },
  { id: "baikonur", name: "Baikonur Cosmodrome", country: "🇰🇿 Kazakhstan", lat: 45.9646, lon: 63.3052, terrain: "steppe", description: "The world's first and busiest spaceport" },
  { id: "kourou", name: "Guiana Space Centre", country: "🇬🇫 French Guiana", lat: 5.236, lon: -52.7686, terrain: "jungle", description: "Near the equator — rockets get a free speed boost" },
  { id: "tanegashima", name: "Tanegashima", country: "🇯🇵 Japan", lat: 30.4008, lon: 130.9686, terrain: "island", description: "Called the most beautiful launch site on Earth" },
  { id: "vandenberg", name: "Vandenberg", country: "🇺🇸 USA", lat: 34.742, lon: -120.5724, terrain: "coastal", description: "Launches rockets out over the Pacific" },
  { id: "saxavord", name: "SaxaVord, Shetland", country: "🇬🇧 UK", lat: 60.8167, lon: -0.7667, terrain: "island", description: "Britain's own spaceport — closest to home!" },
];

export function siteById(id: string): LaunchSite {
  return LAUNCH_SITES.find((s) => s.id === id) ?? LAUNCH_SITES[0];
}
