/**
 * Satellite pass prediction for a given ground location.
 * Calculates when a satellite will be visible from a latitude/longitude.
 */

import { propagateSatellite } from "./propagate";
import { eciToGeodetic } from "./coordinates";
import { gstime } from "satellite.js";
import { degToRad } from "../utils";
import { EARTH_RADIUS_KM } from "../constants";
import type { GeodeticCoordinates, SatellitePass } from "@/types";

/**
 * Calculate the angular separation between two geodetic points.
 */
function angularSeparation(a: GeodeticCoordinates, b: GeodeticCoordinates): number {
  const lat1 = degToRad(a.latitude);
  const lat2 = degToRad(b.latitude);
  const dLon = degToRad(b.longitude - a.longitude);

  return Math.acos(
    Math.sin(lat1) * Math.sin(lat2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.cos(dLon),
  );
}

/**
 * Check if a satellite at `satPos` is above the horizon for an observer at `observerPos`.
 * Considers Earth curvature and satellite altitude.
 */
export function isAboveHorizon(
  satPos: GeodeticCoordinates,
  observerPos: GeodeticCoordinates,
  minElevationDeg: number = 10,
): boolean {
  const R = EARTH_RADIUS_KM;
  const satR = R + satPos.altitude;
  const obsR = R;

  const angle = angularSeparation(satPos, observerPos);

  // Elevation angle using geometry
  const cosEl =
    (satR * satR - obsR * obsR - (satR * satR + obsR * obsR - 2 * satR * obsR * Math.cos(angle))) /
    (2 * obsR * Math.sqrt(satR * satR + obsR * obsR - 2 * satR * obsR * Math.cos(angle)));

  const elevation = 90 - Math.acos(cosEl) * (180 / Math.PI);
  return elevation > minElevationDeg;
}

/**
 * Predict next pass of a satellite over a given location.
 */
export function predictPass(
  tleLine1: string,
  tleLine2: string,
  noradId: number,
  satelliteName: string,
  observerPos: GeodeticCoordinates,
  lookAheadHours: number = 24,
  stepMinutes: number = 1,
): SatellitePass | null {
  const now = new Date();
  const endTime = new Date(now.getTime() + lookAheadHours * 3600 * 1000);
  let current = new Date(now);

  let passStart: Date | null = null;
  let maxElevation = 0;

  while (current < endTime) {
    const result = propagateSatellite(tleLine1, tleLine2, current);
    if (!result) {
      current = new Date(current.getTime() + stepMinutes * 60 * 1000);
      continue;
    }

    const gmst = gstime(current);
    const satPos = eciToGeodetic(result.position, gmst);

    const above = isAboveHorizon(satPos, observerPos, 0);

    if (above && !passStart) {
      passStart = new Date(current);
    }

    if (above && passStart) {
      const elevation = getElevation(satPos, observerPos);
      if (elevation > maxElevation) {
        maxElevation = elevation;
      }
    }

    if (!above && passStart) {
      // Pass ends
      return {
        satelliteId: "",
        satelliteName,
        noradId,
        startTime: passStart.toISOString(),
        endTime: current.toISOString(),
        maxElevation,
        direction: getDirection(satPos, observerPos),
        magnitude: estimateMagnitude(satPos, observerPos),
        visible: maxElevation > 10,
      };
    }

    current = new Date(current.getTime() + stepMinutes * 60 * 1000);
  }

  // If pass is still ongoing at the end of the window
  if (passStart) {
    return {
      satelliteId: "",
      satelliteName,
      noradId,
      startTime: passStart.toISOString(),
      endTime: endTime.toISOString(),
      maxElevation,
      direction: "unknown",
      magnitude: null,
      visible: maxElevation > 10,
    };
  }

  return null;
}

/**
 * Calculate elevation angle from observer to satellite.
 */
function getElevation(
  satPos: GeodeticCoordinates,
  observerPos: GeodeticCoordinates,
): number {
  const R = EARTH_RADIUS_KM;
  const angle = angularSeparation(satPos, observerPos);
  const satR = R + satPos.altitude;

  // Elevation from Law of Cosines
  const cosEl = Math.sin(angle) * (satR / R);
  const elevation = Math.asin(
    (satR * satR - R * R - R * R * Math.cos(angle) * Math.cos(angle)) /
      (2 * R * R * Math.cos(angle)),
  );

  return Math.max(0, Math.min(90, elevation * (180 / Math.PI)));
}

/**
 * Get approximate pass direction (N/S/E/W).
 */
function getDirection(
  satPos: GeodeticCoordinates,
  observerPos: GeodeticCoordinates,
): string {
  const dLon = satPos.longitude - observerPos.longitude;
  const dLat = satPos.latitude - observerPos.latitude;

  if (Math.abs(dLat) > Math.abs(dLon)) {
    return dLat > 0 ? "North" : "South";
  }
  return dLon > 0 ? "East" : "West";
}

/**
 * Rough visual magnitude estimate based on satellite altitude and size.
 * Very approximate — real magnitude depends on size, shape, and sun angle.
 */
function estimateMagnitude(
  satPos: GeodeticCoordinates,
  observerPos: GeodeticCoordinates,
): number | null {
  const distance = angularSeparation(satPos, observerPos) * (EARTH_RADIUS_KM + satPos.altitude);
  // Rough model: fainter with distance, brighter at lower altitudes
  const baseMag = 5.0;
  const rangeFactor = Math.log10(Math.max(distance, 100)) * 2.5;
  return Math.round((baseMag + rangeFactor) * 10) / 10;
}
