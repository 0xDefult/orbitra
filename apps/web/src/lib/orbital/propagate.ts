/**
 * Orbital propagation using the SGP4 model via satellite.js.
 * Provides position/velocity for satellites given TLE data and a timestamp.
 */

import { propagate, twoline2satrec, gstime } from "satellite.js";
import type { TLESet, ECICoordinates, GeodeticCoordinates, SceneSatellite } from "@/types";
import { eciToGeodetic, eciToScene } from "./coordinates";
import { SCENE_SCALE } from "../constants";

/**
 * Parse a TLE set and return a satellite record (satrec) for propagation.
 */
export function parseTleToSatrec(tle: TLESet) {
  return twoline2satrec(tle.line1, tle.line2);
}

/**
 * Propagate a single satellite to a specific date and return position/velocity.
 */
export function propagateSatellite(
  tleLine1: string,
  tleLine2: string,
  date: Date = new Date(),
): { position: ECICoordinates; velocity: number } | null {
  const satrec = twoline2satrec(tleLine1, tleLine2);

  const positionAndVelocity = propagate(satrec, date);

  if (!positionAndVelocity.position) return null;

  // Handle type variance — satellite.js can return EciVec or
  const pos = positionAndVelocity.position as { x: number; y: number; z: number };
  const vel = positionAndVelocity.velocity as { x: number; y: number; z: number } | undefined;

  const velocity = vel
    ? Math.sqrt(vel.x * vel.x + vel.y * vel.y + vel.z * vel.z)
    : 7.8; // Default LEO velocity (km/s)

  return {
    position: { x: pos.x, y: pos.y, z: pos.z },
    velocity,
  };
}

/**
 * Propagate a satellite and return both ECI and geodetic coordinates.
 */
export function propagateFull(
  tleLine1: string,
  tleLine2: string,
  date: Date = new Date(),
): { eci: ECICoordinates; geodetic: GeodeticCoordinates; velocity: number } | null {
  const result = propagateSatellite(tleLine1, tleLine2, date);
  if (!result) return null;

  const gmst = gstime(date); // satellite.js built-in GMST
  const geodetic = eciToGeodetic(result.position, gmst);

  return {
    eci: result.position,
    geodetic,
    velocity: result.velocity,
  };
}

/**
 * Propagate a satellite and return scene-ready coordinates.
 */
export function propagateToScene(
  tleLine1: string,
  tleLine2: string,
  date: Date = new Date(),
): { position: [number, number, number]; geodetic: GeodeticCoordinates; velocity: number } | null {
  const result = propagateSatellite(tleLine1, tleLine2, date);
  if (!result) return null;

  const gmst = gstime(date);
  const geodetic = eciToGeodetic(result.position, gmst);
  const scenePos = eciToScene(result.position, SCENE_SCALE);

  return {
    position: scenePos,
    geodetic,
    velocity: result.velocity,
  };
}

/**
 * Generate a trail of positions for a satellite over a duration.
 * Returns an array of geodetic coordinates representing the orbital trail.
 */
export function generateTrail(
  tleLine1: string,
  tleLine2: string,
  startDate: Date,
  durationMinutes: number,
  segments: number,
): GeodeticCoordinates[] {
  const trail: GeodeticCoordinates[] = [];
  const stepMs = (durationMinutes * 60 * 1000) / segments;

  for (let i = 0; i < segments; i++) {
    const date = new Date(startDate.getTime() - i * stepMs);
    const result = propagateSatellite(tleLine1, tleLine2, date);
    if (result) {
      const gmst = gstime(date);
      const geo = eciToGeodetic(result.position, gmst);
      trail.push(geo);
    }
  }

  return trail.reverse();
}

/**
 * Batch propagate multiple satellites for efficient rendering.
 */
export function batchPropagate(
  satellites: Array<{ id: string; noradId: number; name: string; tleLine1: string; tleLine2: string; objectType: string }>,
  date: Date = new Date(),
): SceneSatellite[] {
  const results: SceneSatellite[] = [];

  for (const sat of satellites) {
    const propagated = propagateSatellite(sat.tleLine1, sat.tleLine2, date);
    if (!propagated) continue;

    const gmst = gstime(date);
    const geodetic = eciToGeodetic(propagated.position, gmst);

    results.push({
      id: sat.id,
      noradId: sat.noradId,
      name: sat.name,
      objectType: sat.objectType as SceneSatellite["objectType"],
      position: propagated.position,
      geodetic,
      velocity: propagated.velocity,
      trail: [],
    });
  }

  return results;
}
