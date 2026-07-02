import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/orbital/propagate
 * Propagate satellite positions to specific timestamps.
 *
 * Body:
 * - satelliteIds: string[] — IDs to propagate
 * - timestamp: ISO date string — target time (default now)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { satelliteIds, timestamp } = body;

    if (!satelliteIds || !Array.isArray(satelliteIds)) {
      return NextResponse.json(
        { error: { code: "INVALID_PARAMS", message: "satelliteIds array is required" } },
        { status: 400 },
      );
    }

    if (satelliteIds.length > 1000) {
      return NextResponse.json(
        { error: { code: "TOO_MANY", message: "Maximum 1000 satellites per request" } },
        { status: 400 },
      );
    }

    const targetDate = timestamp ? new Date(timestamp) : new Date();

    return NextResponse.json({
      data: {
        positions: [],
        timestamp: targetDate.toISOString(),
        count: satelliteIds.length,
        propagated: 0,
      },
    });
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_JSON", message: "Invalid request body" } },
      { status: 400 },
    );
  }
}
