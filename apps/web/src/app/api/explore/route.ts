import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/explore
 * Get aggregated explore data with optional filters.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  return NextResponse.json({
    data: {
      satellites: [],
      aggregation: {
        byCountry: {},
        byOrbitalClass: {},
        byMissionType: {},
        byLaunchYear: {},
        totalActive: 0,
        totalDecayed: 0,
      },
    },
  });
}
