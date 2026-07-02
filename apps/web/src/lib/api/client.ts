/**
 * API client for Orbitra backend.
 * Wraps fetch with consistent error handling and response parsing.
 */

import type { ApiResponse } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        code: "UNKNOWN",
        message: `HTTP ${response.status}: ${response.statusText}`,
      }));

      return {
        data: null as unknown as T,
        error: {
          code: error.code || "HTTP_ERROR",
          message: error.message || `HTTP ${response.status}`,
          details: error.details,
        },
      };
    }

    return response.json();
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const searchParams = params ? `?${new URLSearchParams(params).toString()}` : "";
    return this.request<T>(`${endpoint}${searchParams}`);
  }

  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // ── Satellite Endpoints ─────────────────

  async getSatellites(params?: Record<string, string>) {
    return this.get("/api/satellites", params);
  }

  async getSatellite(id: string) {
    return this.get(`/api/satellites/${id}`);
  }

  async getSatelliteStory(id: string) {
    return this.get(`/api/satellites/${id}/story`);
  }

  // ── Orbital Endpoints ───────────────────

  async getPositions(satelliteIds?: string[]) {
    const params = satelliteIds ? { ids: satelliteIds.join(",") } : undefined;
    return this.get("/api/orbital/positions", params);
  }

  async propagateSatellites(satelliteIds: string[], timestamp: string) {
    return this.post("/api/orbital/propagate", {
      satelliteIds,
      timestamp,
    });
  }

  // ── TLE Endpoints ───────────────────────

  async getTLE() {
    return this.get("/api/tle");
  }

  async refreshTLE() {
    return this.post("/api/tle/refresh");
  }

  // ── Pass Endpoints ──────────────────────

  async getPasses(latitude: number, longitude: number) {
    return this.get("/api/passes", {
      lat: latitude.toString(),
      lng: longitude.toString(),
    });
  }

  // ── Explore Endpoints ───────────────────

  async getExplore(params?: Record<string, string>) {
    return this.get("/api/explore", params);
  }

  // ── Personal Endpoints ──────────────────

  async getPersonal(latitude: number, longitude: number) {
    return this.get("/api/personal", {
      lat: latitude.toString(),
      lng: longitude.toString(),
    });
  }
}

export const api = new ApiClient(BASE_URL);
export default api;
