/**
 * Satellite ground footprint calculation.
 * Computes the polygon on Earth's surface that a satellite can "see" at any moment.
 */

import { EARTH_RADIUS_KM } from "../constants";
import { degToRad, radToDeg } from "../utils";
import type { GeodeticCoordinates } from "@/types";

/**
 * Calculate the ground footprint of a satellite.
 * Returns a polygon of geodetic points representing the area visible to the satellite.
 *
 * @param satPos — Satellite geodetic position
 * @param numPoints — Number of polygon points (default 64 for smooth circle)
 */
export function calculateFootprint(
  satPos: GeodeticCoordinates,
  numPoints: number = 64,
): GeodeticCoordinates[] {
  const R = EARTH_RADIUS_KM;
  const satR = R + satPos.altitude;

  // Angular radius of the footprint (half angle)
  const alpha = Math.acos(R / satR);

  // Satellite subpoint
  const satLat = degToRad(satPos.latitude);
  const satLon = degToRad(satPos.longitude);

  const points: GeodeticCoordinates[] = [];

  for (let i = 0; i < numPoints; i++) {
    const azimuth = (2 * Math.PI * i) / numPoints;

    // Spherical trigonometry to find footprint boundary points
    const lat = Math.asin(
      Math.sin(satLat) * Math.cos(alpha) +
        Math.cos(satLat) * Math.sin(alpha) * Math.cos(azimuth),
    );

    const dLon = Math.atan2(
      Math.sin(azimuth) * Math.sin(alpha) * Math.cos(satLat),
      Math.cos(alpha) - Math.sin(satLat) * Math.sin(lat),
    );

    const lon = satLon + dLon;

    points.push({
      latitude: radToDeg(lat),
      longitude: radToDeg(lon),
      altitude: 0,
    });
  }

  return points;
}

/**
 * Calculate the diameter of the ground footprint in km.
 */
export function footprintDiameter(altitudeKm: number): number {
  const R = EARTH_RADIUS_KM;
  const satR = R + altitudeKm;
  const alpha = Math.acos(R / satR);
  return 2 * R * alpha;
}

/**
 * Calculate ground sample distance (resolution) at nadir.
 * Approximate based on satellite altitude and sensor parameters.
 */
export function groundSampleDistance(
  altitudeKm: number,
  sensorResolutionRad: number = 0.00001,
): number {
  return altitudeKm * sensorResolutionRad;
}
