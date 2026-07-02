import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/tle
 * Proxies TLE data from CelesTrak.
 * Cached for 1 hour on the server.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const group = searchParams.get("group") || "active";

  const groupUrls: Record<string, string> = {
    active: "https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle",
    stations: "https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle",
    visual: "https://celestrak.org/NORAD/elements/gp.php?GROUP=visual&FORMAT=tle",
    debris: "https://celestrak.org/NORAD/elements/gp.php?GROUP=debris&FORMAT=tle",
  };

  const url = groupUrls[group] || groupUrls.active;

  try {
    const response = await fetch(url, {
      headers: { Accept: "text/plain" },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: { code: "TLE_FETCH_FAILED", message: `CelesTrak returned ${response.status}` } },
        { status: 502 },
      );
    }

    const raw = await response.text();
    const lineCount = raw.split("\n").filter((l) => l.trim()).length;

    return NextResponse.json({
      data: {
        raw,
        lineCount,
        estimatedSatellites: Math.floor(lineCount / 3),
        fetchedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: { code: "TLE_FETCH_FAILED", message: "Failed to fetch TLE data" } },
      { status: 500 },
    );
  }
}
