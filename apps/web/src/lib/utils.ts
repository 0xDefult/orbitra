/**
 * General utility functions used across the application.
 */

/** Simple classname merge utility — combines class strings, filtering falsy values */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Linear interpolation */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Map a value from one range to another */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

/** Convert degrees to radians */
export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/** Convert radians to degrees */
export function radToDeg(radians: number): number {
  return radians * (180 / Math.PI);
}

/** Normalize an angle to [0, 360) degrees */
export function normalizeAngle(degrees: number): number {
  return ((degrees % 360) + 360) % 360;
}

/** Normalize a value to [0, 2π) radians */
export function normalizeAngleRad(radians: number): number {
  return ((radians % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
}

/** Generate a random float between min and max */
export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/** Format a number with thousands separators */
export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

/** Format a speed in km/s with one decimal */
export function formatSpeed(kmPerSec: number): string {
  return `${kmPerSec.toFixed(1)} km/s`;
}

/** Format altitude in km */
export function formatAltitude(km: number): string {
  return `${km.toLocaleString("en-US", { maximumFractionDigits: 0 })} km`;
}

/** Format a date as a readable string */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Generate a CSS color based on satellite type */
export function getSatelliteTypeColor(type: string): string {
  switch (type) {
    case "PAYLOAD":
      return "#00f0ff";
    case "ROCKET_BODY":
      return "#ff6633";
    case "DEBRIS":
      return "#884444";
    case "SPACE_STATION":
    case "STATION":
      return "#ffaa00";
    default:
      return "#888888";
  }
}

/** Sleep for a given duration in ms */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Debounce a function */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/** Throttle a function */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
}

/** Get country name from ISO code (basic mapping — extend from DB if needed) */
export function getCountryName(code: string): string {
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  try {
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
}
