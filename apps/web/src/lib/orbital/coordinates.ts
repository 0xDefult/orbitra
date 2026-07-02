/**
 * Coordinate transformation utilities.
 * Converts between ECI (Earth-Centered Inertial), ECEF (Earth-Centered Earth-Fixed),
 * and geodetic (latitude/longitude/altitude) coordinate systems.
 */

import { degToRad, radToDeg } from "../utils";
import {
  EARTH_RADIUS_KM,
  EARTH_EQUATORIAL_RADIUS_KM,
  EARTH_FLATTENING,
  EARTH_ROTATION_RATE,
} from "../constants";
import type { ECICoordinates, GeodeticCoordinates } from "@/types";

// WGS-84 ellipsoid parameters
const A = EARTH_EQUATORIAL_RADIUS_KM;
const F = EARTH_FLATTENING;
const E2 = 2 * F - F * F; // First eccentricity squared

/**
 * Convert geodetic coordinates (lat/lng/alt) to ECEF (Earth-Centered Earth-Fixed).
 */
export function geodeticToECEF(geo: GeodeticCoordinates): ECICoordinates {
  const lat = degToRad(geo.latitude);
  const lng = degToRad(geo.longitude);

  const sinLat = Math.sin(lat);
  const cosLat = Math.cos(lat);
  const N = A / Math.sqrt(1 - E2 * sinLat * sinLat); // Prime vertical radius of curvature

  const x = (N + geo.altitude) * cosLat * Math.cos(lng);
  const y = (N + geo.altitude) * cosLat * Math.sin(lng);
  const z = (N * (1 - E2) + geo.altitude) * sinLat;

  return { x, y, z };
}

/**
 * Convert ECEF to geodetic coordinates.
 * Uses iterative method for accuracy.
 */
export function ecefToGeodetic(ecef: ECICoordinates): GeodeticCoordinates {
  const { x, y, z } = ecef;
  const p = Math.sqrt(x * x + y * y);
  const B = A * (1 - F);

  // Initial guess
  let lat = Math.atan2(z, p * (1 - E2));
  let N: number;

  // Iterate to converge (usually 3-4 iterations is enough)
  for (let i = 0; i < 5; i++) {
    const sinLat = Math.sin(lat);
    N = A / Math.sqrt(1 - E2 * sinLat * sinLat);
    const prevLat = lat;
    lat = Math.atan2(z + E2 * N * sinLat, p);
    if (Math.abs(lat - prevLat) < 1e-12) break;
  }

  const sinLat = Math.sin(lat);
  N = A / Math.sqrt(1 - E2 * sinLat * sinLat);
  const altitude = p / Math.cos(lat) - N;

  return {
    latitude: radToDeg(lat),
    longitude: radToDeg(Math.atan2(y, x)),
    altitude,
  };
}

/**
 * Convert ECI to ECEF at a given time.
 * Accounts for Earth's rotation (GMST — Greenwich Mean Sidereal Time).
 *
 * @param eci — Position in ECI frame
 * @param gmstRad — Greenwich Mean Sidereal Time in radians
 */
export function eciToECEF(eci: ECICoordinates, gmstRad: number): ECICoordinates {
  const cosG = Math.cos(gmstRad);
  const sinG = Math.sin(gmstRad);

  return {
    x: eci.x * cosG + eci.y * sinG,
    y: -eci.x * sinG + eci.y * cosG,
    z: eci.z,
  };
}

/**
 * Convert ECI directly to geodetic coordinates.
 */
export function eciToGeodetic(
  eci: ECICoordinates,
  gmstRad: number,
): GeodeticCoordinates {
  const ecef = eciToECEF(eci, gmstRad);
  return ecefToGeodetic(ecef);
}

/**
 * Calculate Julian Date from a JavaScript Date object.
 */
export function getJulianDate(date: Date = new Date()): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;

  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const JD =
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    hours / 24 +
    B -
    1524.5;

  return JD;
}

/**
 * Calculate GMST (Greenwich Mean Sidereal Time) in radians.
 */
export function getGMST(date: Date = new Date()): number {
  const jd = getJulianDate(date);
  const T = (jd - 2451545.0) / 36525.0;
  let gmst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000.0;

  // Normalize to [0, 360) and convert to radians
  gmst = ((gmst % 360) + 360) % 360;
  return degToRad(gmst);
}

/**
 * Convert ECI position to 3D scene coordinates.
 * Scales from km to scene units and applies coordinate system rotation
 * (Z-up in Three.js vs Z-to-North in orbital mechanics).
 */
export function eciToScene(eci: ECICoordinates, sceneScale: number): [number, number, number] {
  // In Three.js: X-right, Y-up, Z-towards viewer
  // In orbital mechanics: X-vernal equinox, Y-90° east, Z-north
  // Convert: orbital X → scene X, orbital Z → scene Y, orbital Y → scene -Z
  return [eci.x * sceneScale, eci.z * sceneScale, -eci.y * sceneScale];
}

/**
 * Convert geodetic to 3D scene coordinates.
 */
export function geodeticToScene(
  geo: GeodeticCoordinates,
  sceneScale: number,
): [number, number, number] {
  const lat = degToRad(geo.latitude);
  const lng = degToRad(geo.longitude);
  const r = (EARTH_RADIUS_KM + geo.altitude) * sceneScale;

  // Standard spherical to Cartesian with Y-up
  const x = r * Math.cos(lat) * Math.cos(lng);
  const y = r * Math.sin(lat);
  const z = -r * Math.cos(lat) * Math.sin(lng);

  return [x, y, z];
}
