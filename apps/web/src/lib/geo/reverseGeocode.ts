/**
 * Reverse geocoding utilities.
 * Convert latitude/longitude to country names and codes.
 */

// Simplistic country bounding boxes for overland detection
// In production, use a proper geocoding service or GeoJSON country polygons
const COUNTRY_BOUNDS: Array<{
  code: string;
  name: string;
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
}> = [
  { code: "US", name: "United States", latMin: 24, latMax: 49, lngMin: -125, lngMax: -66 },
  { code: "CA", name: "Canada", latMin: 49, latMax: 83, lngMin: -141, lngMax: -52 },
  { code: "MX", name: "Mexico", latMin: 14, latMax: 33, lngMin: -118, lngMax: -86 },
  { code: "BR", name: "Brazil", latMin: -34, latMax: 5, lngMin: -74, lngMax: -34 },
  { code: "AR", name: "Argentina", latMin: -55, latMax: -22, lngMin: -73, lngMax: -53 },
  { code: "GB", name: "United Kingdom", latMin: 49, latMax: 61, lngMin: -10, lngMax: 2 },
  { code: "FR", name: "France", latMin: 42, latMax: 51, lngMin: -5, lngMax: 8 },
  { code: "DE", name: "Germany", latMin: 47, latMax: 55, lngMin: 5, lngMax: 15 },
  { code: "IT", name: "Italy", latMin: 36, latMax: 47, lngMin: 6, lngMax: 19 },
  { code: "ES", name: "Spain", latMin: 36, latMax: 44, lngMin: -10, lngMax: 4 },
  { code: "RU", name: "Russia", latMin: 41, latMax: 82, lngMin: 19, lngMax: 180 },
  { code: "CN", name: "China", latMin: 18, latMax: 54, lngMin: 73, lngMax: 135 },
  { code: "IN", name: "India", latMin: 6, latMax: 36, lngMin: 68, lngMax: 98 },
  { code: "JP", name: "Japan", latMin: 30, latMax: 46, lngMin: 129, lngMax: 146 },
  { code: "AU", name: "Australia", latMin: -44, latMax: -10, lngMin: 113, lngMax: 154 },
  { code: "PK", name: "Pakistan", latMin: 23, latMax: 37, lngMin: 60, lngMax: 78 },
  { code: "BD", name: "Bangladesh", latMin: 20, latMax: 27, lngMin: 88, lngMax: 93 },
  { code: "ID", name: "Indonesia", latMin: -11, latMax: 6, lngMin: 95, lngMax: 141 },
  { code: "NG", name: "Nigeria", latMin: 4, latMax: 14, lngMin: 2, lngMax: 15 },
  { code: "ZA", name: "South Africa", latMin: -35, latMax: -22, lngMin: 16, lngMax: 33 },
];

/**
 * Get the country at a given geodetic position.
 * Uses a simplified bounding-box approach.
 */
export function getCountryAtPosition(
  lat: number,
  lng: number,
): { code: string; name: string } | null {
  for (const country of COUNTRY_BOUNDS) {
    if (
      lat >= country.latMin &&
      lat <= country.latMax &&
      lng >= country.lngMin &&
      lng <= country.lngMax
    ) {
      return { code: country.code, name: country.name };
    }
  }
  return null;
}

/**
 * Get the ocean/sea name at a given position.
 * Very simplified — returns null over land, ocean name over water.
 */
export function getOceanAtPosition(lat: number, lng: number): string | null {
  const isOverLand = getCountryAtPosition(lat, lng) !== null;
  if (isOverLand) return null;

  // Simplified ocean regions
  if (lng > -100 && lng < -30 && lat > 0 && lat < 60) return "North Atlantic Ocean";
  if (lng > -30 && lng < 20 && lat > 0 && lat < 60) return "North Atlantic Ocean";
  if (lng > -80 && lng < 20 && lat < 0 && lat > -60) return "South Atlantic Ocean";
  if (lng > -180 && lng < -80 && lat > 0 && lat < 60) return "North Pacific Ocean";
  if (lng > 100 && lng < 180 && lat > 0 && lat < 60) return "North Pacific Ocean";
  if (lng > -180 && lng < -60 && lat < 0 && lat > -60) return "South Pacific Ocean";
  if (lng > 20 && lng < 100 && lat > -40 && lat < 30) return "Indian Ocean";
  if (lng > 100 && lng < 150 && lat < 0 && lat > -40) return "Indian Ocean";
  if (lat > 60 && lat < 90) return "Arctic Ocean";
  if (lat < -60 && lat > -90) return "Southern Ocean";

  return "International Waters";
}

/**
 * Get a human-readable location description for a given position.
 */
export function getLocationDescription(lat: number, lng: number): string {
  const country = getCountryAtPosition(lat, lng);
  if (country) {
    return `Over ${country.name}`;
  }
  const ocean = getOceanAtPosition(lat, lng);
  return ocean ? `Over the ${ocean}` : "In space";
}
