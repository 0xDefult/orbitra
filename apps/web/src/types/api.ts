import type { SatelliteDTO, SatellitePositionDTO } from "./satellite";
import type { StoryData, JourneyChapter } from "./orbital";

/** Standard API response envelope */
export interface ApiResponse<T> {
  data: T;
  meta?: ApiMeta;
  error?: ApiError;
}

export interface ApiMeta {
  total: number;
  page?: number;
  pageSize?: number;
  hasMore?: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

/** Satellite list query parameters */
export interface SatelliteListParams {
  countries?: string[];
  organizations?: string[];
  missionTypes?: string[];
  orbitalClasses?: string[];
  launchYearMin?: number;
  launchYearMax?: number;
  constellations?: string[];
  activeOnly?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: "name" | "launchDate" | "altitude" | "speed";
  sortDir?: "asc" | "desc";
}

/** Satellite list response */
export type SatelliteListResponse = ApiResponse<SatelliteDTO[]>;

/** Single satellite detail response */
export type SatelliteDetailResponse = ApiResponse<SatelliteDTO>;

/** Story response */
export interface StoryResponse {
  story: StoryData;
  chapters: JourneyChapter[];
}

/** Orbital positions response */
export interface PositionsResponse {
  positions: SatellitePositionDTO[];
  timestamp: string;
}

/** TLE data response */
export interface TleResponse {
  raw: string;
  parsed: Array<{
    name: string;
    noradId: number;
    line1: string;
    line2: string;
  }>;
  fetchedAt: string;
}

/** Explore aggregation response */
export interface ExploreResponse {
  satellites: SatelliteDTO[];
  aggregation: {
    byCountry: Record<string, number>;
    byOrbitalClass: Record<string, number>;
    byMissionType: Record<string, number>;
    byLaunchYear: Record<string, number>;
    totalActive: number;
    totalDecayed: number;
  };
}
