/** State machine states for the cinematic camera */
export type CameraState = "IDLE" | "APPROACH" | "FOLLOW" | "ORBIT" | "TRANSITION";

/** Camera target descriptor */
export interface CameraTarget {
  position: [number, number, number];
  lookAt: [number, number, number];
  state: CameraState;
}

/** Globe interaction mode */
export type GlobeMode = "GLOBE" | "STORY" | "TIMELINE" | "EXPLORE";

/** User's geolocation data */
export interface UserLocation {
  latitude: number;
  longitude: number;
  city: string | null;
  country: string | null;
  countryCode: string | null;
}

/** Pass prediction for a satellite over a location */
export interface SatellitePass {
  satelliteId: string;
  satelliteName: string;
  noradId: number;
  startTime: string;
  endTime: string;
  maxElevation: number;
  direction: string;
  magnitude: number | null;
  visible: boolean;
}

/** Chapter in a satellite's journey */
export interface JourneyChapter {
  id: string;
  order: number;
  title: string;
  subtitle: string | null;
  narration: string | null;
  duration: number | null;
  progress: number; // 0-1, how far through this chapter
}

/** Story mode data for a satellite */
export interface StoryData {
  satelliteId: string;
  satelliteName: string;
  currentChapter: JourneyChapter | null;
  nextChapters: JourneyChapter[];
  narration: string;
}
