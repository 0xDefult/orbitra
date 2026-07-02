/**
 * CelesTrak API fetcher.
 * Fetches and caches TLE data from CelesTrak.
 */

import { parseTLE } from "./parser";
import {
  CELESTRAK_ACTIVE_URL,
  CELESTRAK_STATIONS_URL,
  CELESTRAK_VISUAL_URL,
  CELESTRAK_DEBRIS_URL,
} from "../constants";

export type TLEFetchSource = "active" | "stations" | "visual" | "debris";

const TLE_URLS: Record<TLEFetchSource, string> = {
  active: CELESTRAK_ACTIVE_URL,
  stations: CELESTRAK_STATIONS_URL,
  visual: CELESTRAK_VISUAL_URL,
  debris: CELESTRAK_DEBRIS_URL,
};

/**
 * Fetch TLE data from CelesTrak for a given source.
 */
export async function fetchTLE(source: TLEFetchSource = "active"): Promise<string> {
  const url = TLE_URLS[source];
  const response = await fetch(url, {
    headers: {
      Accept: "text/plain",
    },
    next: {
      revalidate: 3600, // Cache for 1 hour on the server
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch TLE data: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

/**
 * Fetch and parse TLE data from CelesTrak.
 */
export async function fetchAndParseTLE(source: TLEFetchSource = "active") {
  const raw = await fetchTLE(source);
  return parseTLE(raw);
}

/**
 * Fetch all satellite categories from CelesTrak.
 */
export async function fetchAllTLE() {
  const [active, stations, visual] = await Promise.all([
    fetchAndParseTLE("active"),
    fetchAndParseTLE("stations"),
    fetchAndParseTLE("visual"),
  ]);

  return {
    active,
    stations,
    visual,
    total: active.length + stations.length + visual.length,
  };
}
