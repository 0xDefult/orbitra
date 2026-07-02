import type { JourneyChapter, SatellitePass, UserLocation } from "./orbital";

/** Story Mode UI state */
export interface StoryState {
  isActive: boolean;
  selectedSatelliteId: string | null;
  currentChapter: JourneyChapter | null;
  chapters: JourneyChapter[];
  narration: string;
  isNarrationLoading: boolean;
}

/** Timeline mode state */
export interface TimelineState {
  isActive: boolean;
  currentDate: string; // ISO date string
  startDate: string;
  endDate: string;
  playbackSpeed: number; // 1, 10, 100, 1000
  isPlaying: boolean;
}

/** Explore mode filter state */
export interface ExploreFilters {
  countries: string[];
  organizations: string[];
  missionTypes: string[];
  orbitalClasses: string[];
  launchYearRange: [number, number] | null;
  constellations: string[];
  activeOnly: boolean;
  searchQuery: string;
}

/** Personal mode state */
export interface PersonalState {
  location: UserLocation | null;
  locationPermission: "prompt" | "granted" | "denied";
  overheadSatellites: SatellitePass[];
  issNextPass: SatellitePass | null;
  isLoading: boolean;
}

/** App-level UI state */
export interface UIState {
  activeMode: "globe" | "story" | "timeline" | "explore" | "personal";
  isMenuOpen: boolean;
  isAudioEnabled: boolean;
  isLoading: boolean;
  loadingProgress: number; // 0-1
}
