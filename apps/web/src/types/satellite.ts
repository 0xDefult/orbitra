/** Classification of space objects */
export type ObjectType = "PAYLOAD" | "ROCKET_BODY" | "DEBRIS" | "SPACE_STATION" | "UNKNOWN";

/** Orbital classification bands */
export type OrbitalClass = "LEO" | "MEO" | "GEO" | "HEO" | "SSO" | "POLAR" | "UNKNOWN";

/** Mission categories */
export type MissionType =
  | "COMMUNICATION"
  | "NAVIGATION"
  | "EARTH_OBSERVATION"
  | "SCIENCE"
  | "TECHNOLOGY"
  | "SPACE_STATION"
  | "HUMAN_SPACEFLIGHT"
  | "MILITARY"
  | "WEATHER"
  | "UNKNOWN";

/** Satellite data transfer object from API */
export interface SatelliteDTO {
  id: string;
  noradId: number;
  name: string;
  intlDesignator: string | null;

  // Classification
  objectType: ObjectType;
  orbitalClass: OrbitalClass | null;
  orbitalRegime: string | null;

  // Physical
  dryMass: number | null;
  launchMass: number | null;
  power: number | null;
  span: number | null;

  // Mission
  missionType: MissionType | null;
  missionDescription: string | null;
  purpose: string | null;

  // Origin
  countryCode: string | null;
  country: { code: string; name: string; flagEmoji: string | null } | null;
  organization: { id: string; name: string; type: string | null } | null;
  manufacturer: string | null;

  // Launch
  launchDate: string | null;
  launchVehicle: string | null;
  launchSite: string | null;

  // Orbital parameters
  period: number | null;
  inclination: number | null;
  apogee: number | null;
  perigee: number | null;
  eccentricity: number | null;
  semiMajorAxis: number | null;

  // Status
  isActive: boolean;
  decayDate: string | null;

  // Constellation
  constellation: { id: string; name: string; operator: string | null } | null;

  // Fun facts
  funFacts: string[];

  createdAt: string;
  updatedAt: string;
}

/** Satellite position at a point in time */
export interface SatellitePositionDTO {
  id: string;
  satelliteId: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  heading: number | null;
  orbitNumber: number | null;
}

/** ECI (Earth-Centered Inertial) coordinates in kilometers */
export interface ECICoordinates {
  x: number;
  y: number;
  z: number;
}

/** Geodetic coordinates */
export interface GeodeticCoordinates {
  latitude: number; // degrees
  longitude: number; // degrees
  altitude: number; // km
}

/** TLE (Two-Line Element) set */
export interface TLESet {
  name: string;
  line1: string;
  line2: string;
  noradId: number;
}

/** Satellite rendered in the 3D scene */
export interface SceneSatellite {
  id: string;
  noradId: number;
  name: string;
  objectType: ObjectType;
  position: ECICoordinates;
  geodetic: GeodeticCoordinates;
  velocity: number;
  trail: GeodeticCoordinates[];
}
