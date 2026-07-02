/**
 * Orbital and Earth constants used throughout the application.
 * All values in SI units unless otherwise noted.
 */

// ── Earth Parameters ────────────────────────
export const EARTH_RADIUS_KM = 6371.0; // Mean radius (km)
export const EARTH_EQUATORIAL_RADIUS_KM = 6378.137; // WGS-84 (km)
export const EARTH_POLAR_RADIUS_KM = 6356.752; // WGS-84 (km)
export const EARTH_FLATTENING = 1 / 298.257223563;
export const EARTH_ROTATION_RATE = 7.2921159e-5; // rad/s

// ── Gravitational Parameters ───────────────
export const GM_EARTH = 398600.4418; // Earth's gravitational parameter (km³/s²)
export const J2 = 0.00108262998905; // Earth's J2 perturbation constant

// ── Orbital Bands (km altitude) ────────────
export const ORBITAL_BANDS = {
  LEO: { min: 160, max: 2000, label: "Low Earth Orbit" },
  MEO: { min: 2000, max: 35786, label: "Medium Earth Orbit" },
  GEO: { min: 35786, max: 35786, label: "Geostationary Orbit" },
  HEO: { min: 35786, max: Infinity, label: "Highly Elliptical Orbit" },
  SSO: { min: 160, max: 2000, label: "Sun-Synchronous Orbit" },
} as const;

// ── 3D Scene Constants ──────────────────────
export const SCENE_SCALE = 0.01; // 1 km → 0.01 scene units
export const EARTH_SCENE_RADIUS = EARTH_RADIUS_KM * SCENE_SCALE;
export const ATMOSPHERE_SCENE_RADIUS = EARTH_SCENE_RADIUS * 1.025;
export const STARFIELD_RADIUS = 500; // Scene units
export const SATELLITE_SCALE = 0.05; // Base satellite size in scene
export const TRAIL_SEGMENTS = 200; // Trail points per satellite
export const TRAIL_DURATION = 5; // Minutes of trail shown

// ── Camera ──────────────────────────────────
export const CAMERA_IDLE_DISTANCE = EARTH_SCENE_RADIUS * 3.5;
export const CAMERA_IDLE_HEIGHT = EARTH_SCENE_RADIUS * 1.5;
export const CAMERA_APPROACH_DISTANCE = 0.5;
export const CAMERA_AUTO_ROTATE_SPEED = 0.15;
export const CAMERA_TRANSITION_DURATION = 2.5; // seconds

// ── Rendering ───────────────────────────────
export const MAX_VISIBLE_SATELLITES = 5000;
export const SATELLITE_LOD_DISTANCES = [5, 20, 100]; // Switch distances
export const SATELLITE_COLORS = {
  PAYLOAD: "#00f0ff",
  ROCKET_BODY: "#ff6633",
  DEBRIS: "#884444",
  SPACE_STATION: "#ffaa00",
  UNKNOWN: "#888888",
} as const;

// ── API ─────────────────────────────────────
export const CELESTRAK_ACTIVE_URL =
  "https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle";
export const CELESTRAK_STATIONS_URL =
  "https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle";
export const CELESTRAK_DEBRIS_URL =
  "https://celestrak.org/NORAD/elements/gp.php?GROUP=debris&FORMAT=tle";
export const CELESTRAK_VISUAL_URL =
  "https://celestrak.org/NORAD/elements/gp.php?GROUP=visual&FORMAT=tle";

// ── Time ────────────────────────────────────
export const MINUTES_PER_DAY = 1440;
export const SECONDS_PER_DAY = 86400;
export const JULIAN_DATE_J2000 = 2451545.0;

// ── UI ──────────────────────────────────────
export const SATELLITE_CARD_FIELDS = [
  "name",
  "country",
  "missionType",
  "orbitalClass",
  "launchDate",
  "period",
  "altitude",
  "velocity",
] as const;
