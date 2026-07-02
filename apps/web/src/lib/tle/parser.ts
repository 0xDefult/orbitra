/**
 * Two-Line Element (TLE) parser.
 * Parses raw TLE text from CelesTrak into structured data.
 */

import type { TLESet } from "@/types";

/** Regex to match TLE lines — name line followed by two 69-character element lines */
const TLE_REGEX = /^(.+)\r?\n(1 .{68})\r?\n(2 .{68})/gm;

/** Parse a NORAD catalog ID from a TLE line 1 */
function parseNoradId(line1: string): number {
  return parseInt(line1.substring(2, 7).trim(), 10);
}

/** Parse a single TLE block */
function parseTleBlock(name: string, line1: string, line2: string): TLESet | null {
  const noradId = parseNoradId(line1);
  if (isNaN(noradId)) return null;

  return {
    name: name.trim(),
    line1: line1.trim(),
    line2: line2.trim(),
    noradId,
  };
}

/**
 * Parse raw TLE text into an array of TLE sets.
 * Handles the standard 3-line format: name, line1, line2.
 */
export function parseTLE(raw: string): TLESet[] {
  const results: TLESet[] = [];
  const lines = raw.split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    // Skip empty lines
    while (i < lines.length && lines[i].trim() === "") i++;
    if (i >= lines.length) break;

    const nameLine = lines[i].trim();

    // Peek at next line — if it starts with "1 ", this is a TLE
    if (i + 1 < lines.length && lines[i + 1].startsWith("1 ")) {
      const line1 = lines[i + 1];
      const line2 = i + 2 < lines.length ? lines[i + 2] : "";
      if (line2.startsWith("2 ")) {
        const tle = parseTleBlock(nameLine, line1, line2);
        if (tle) results.push(tle);
        i += 3;
        continue;
      }
    }

    i++;
  }

  return results;
}

/**
 * Parse raw TLE using regex-based approach for large files.
 * More memory efficient for multi-megabyte TLE dumps.
 */
export function parseTLERegex(raw: string): TLESet[] {
  const results: TLESet[] = [];
  let match;

  // Reset regex state
  TLE_REGEX.lastIndex = 0;

  while ((match = TLE_REGEX.exec(raw)) !== null) {
    const [, name, line1, line2] = match;
    const tle = parseTleBlock(name, line1, line2);
    if (tle) results.push(tle);
  }

  return results;
}

/**
 * Validate a TLE set for basic correctness.
 */
export function validateTLE(tle: TLESet): boolean {
  if (!tle.name || !tle.line1 || !tle.line2) return false;
  // Line 1 must start with "1 " and be 69 chars
  if (!tle.line1.startsWith("1 ") || tle.line1.length !== 69) return false;
  // Line 2 must start with "2 " and be 69 chars
  if (!tle.line2.startsWith("2 ") || tle.line2.length !== 69) return false;
  // Valid NORAD ID
  if (isNaN(tle.noradId) || tle.noradId <= 0) return false;

  return true;
}

/**
 * Extract epoch year and day from TLE line 1.
 */
export function getEpochFromTLE(line1: string): { year: number; dayOfYear: number } {
  const epochStr = line1.substring(18, 32).trim();
  const year = parseInt(epochStr.substring(0, 2), 10);
  const dayOfYear = parseFloat(epochStr.substring(2));

  // Two-digit year: 57+ → 1900s, else 2000s
  const fullYear = year >= 57 ? 1900 + year : 2000 + year;

  return { year: fullYear, dayOfYear };
}

/**
 * Filter TLEs to include only payloads (satellites), excluding debris and rocket bodies.
 */
export function filterActivePayloads(tles: TLESet[]): TLESet[] {
  return tles.filter((tle) => {
    // Classification is character 8 of line 1 (0-indexed: position 7)
    // 'U' = unclassified (most payloads), 'C' = classified, 'S' = secret
    const classification = tle.line1[7];
    return classification === "U" || classification === "C" || classification === "S";
  });
}
