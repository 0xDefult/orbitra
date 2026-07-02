import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/orbital/positions
 * Get current positions for visible satellites.
 *
 * Query params:
 * - ids: comma-separated satellite IDs (optional, returns all visible if omitted)
 * - limit: max number to return (default 1000)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids")?.split(",").filter(Boolean);
  const limit = Math.min(Number(searchParams.get("limit") || "1000"), 5000);

  // In production, this propagates TLEs to current time
  // using the Python orbital engine or satellite.js

  return NextResponse.json({
    data: {
      positions: [],
      timestamp: new Date().toISOString(),
      count: 0,
    },
    meta: {
      limit,
      filtered: !!ids,
    },
  });
}
