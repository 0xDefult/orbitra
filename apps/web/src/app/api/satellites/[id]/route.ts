import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/satellites/[id]
 * Get detailed information for a single satellite.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // In production, query Prisma for satellite by ID
  // For now, return placeholder data
  return NextResponse.json({
    data: {
      id,
      noradId: 49260,
      name: "Landsat 9",
      intlDesignator: "2021-083A",
      objectType: "PAYLOAD",
      orbitalClass: "LEO",
      orbitalRegime: "SSO",
      dryMass: 2711,
      launchMass: 2870,
      power: 4300,
      missionType: "EARTH_OBSERVATION",
      missionDescription: "Earth observation satellite for land monitoring",
      countryCode: "US",
      country: { code: "US", name: "United States", flagEmoji: "🇺🇸" },
      organization: { id: "nasa", name: "NASA / USGS", type: "Government" },
      manufacturer: "Northrop Grumman",
      launchDate: "2021-09-27T18:12:00Z",
      launchVehicle: "Atlas V 401",
      launchSite: "Vandenberg SLC-3E",
      period: 98.8,
      inclination: 98.2,
      apogee: 708,
      perigee: 702,
      isActive: true,
      funFacts: [
        "Landsat 9 can detect 16,384 shades of color.",
        "The Landsat program is Earth's longest-running space imaging mission.",
      ],
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
  });
}
