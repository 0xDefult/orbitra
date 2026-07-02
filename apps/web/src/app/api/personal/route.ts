import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/personal
 * Get user-specific space summary for a location.
 *
 * Query params:
 * - lat: user latitude
 * - lng: user longitude
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") || "");
  const lng = parseFloat(searchParams.get("lng") || "");

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { error: { code: "INVALID_PARAMS", message: "lat and lng are required" } },
      { status: 400 },
    );
  }

  return NextResponse.json({
    data: {
      overheadCount: 0,
      visiblePasses: [],
      issNextPass: null,
      dailySummary: {
        totalPasses: 0,
        visibleToNakedEye: 0,
        issPasses: 0,
      },
      location: { lat, lng },
    },
  });
}
