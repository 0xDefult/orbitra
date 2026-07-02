import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/passes
 * Calculate visible satellite passes for a given location.
 *
 * Query params:
 * - lat: observer latitude
 * - lng: observer longitude
 * - hours: look-ahead window in hours (default 24)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") || "");
  const lng = parseFloat(searchParams.get("lng") || "");
  const hours = Math.min(Number(searchParams.get("hours") || "24"), 72);

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { error: { code: "INVALID_PARAMS", message: "lat and lng are required" } },
      { status: 400 },
    );
  }

  return NextResponse.json({
    data: {
      passes: [],
      location: { lat, lng },
      lookAheadHours: hours,
    },
  });
}
