export type NoiseLevel = "Quiet" | "Moderate" | "Loud";
export type CrowdLevel = "Empty" | "Some" | "Busy";

export interface StudyPlace {
  id: string;
  name: string;
  building: string;
  floor: string;
  description: string;
  tags: string[];        // e.g., ["Quiet", "Outlets", "Food nearby"]
  noiseLevel: NoiseLevel;
  crowdLevel: CrowdLevel;
  rating: number;        // average 1–5
  ratingCount: number;
  isFavorite: boolean;
  visited: boolean;
}

export interface UserPreferences {
  preferredNoise: NoiseLevel | null;
  needsOutlets: boolean;
  prefersNearFood: boolean;
}

export interface Review {
  id: string;
  placeId: string;
  rating: number;
  text: string;
  timestamp: number;
}

