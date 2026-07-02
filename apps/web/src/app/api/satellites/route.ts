import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/satellites
 * List satellites with optional filters and pagination.
 *
 * Query params:
 * - countries: comma-separated ISO codes
 * - organizations: comma-separated org IDs
 * - missionTypes: comma-separated
 * - orbitalClasses: comma-separated
 * - launchYearMin, launchYearMax
 * - activeOnly: boolean (default true)
 * - search: text search on name
 * - page, pageSize: pagination
 * - sort, sortDir: sorting
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const filters = {
    countries: searchParams.get("countries")?.split(",").filter(Boolean),
    organizations: searchParams.get("organizations")?.split(",").filter(Boolean),
    missionTypes: searchParams.get("missionTypes")?.split(",").filter(Boolean),
    orbitalClasses: searchParams.get("orbitalClasses")?.split(",").filter(Boolean),
    launchYearMin: searchParams.get("launchYearMin") ? Number(searchParams.get("launchYearMin")) : undefined,
    launchYearMax: searchParams.get("launchYearMax") ? Number(searchParams.get("launchYearMax")) : undefined,
    activeOnly: searchParams.get("activeOnly") !== "false",
    search: searchParams.get("search") || undefined,
    page: Number(searchParams.get("page") || "1"),
    pageSize: Math.min(Number(searchParams.get("pageSize") || "50"), 100),
    sort: (searchParams.get("sort") || "name") as string,
    sortDir: (searchParams.get("sortDir") || "asc") as "asc" | "desc",
  };

  // In production, this queries Prisma
  // For now, return a placeholder with sample structure
  return NextResponse.json({
    data: [],
    meta: {
      total: 0,
      page: filters.page,
      pageSize: filters.pageSize,
      hasMore: false,
      filters,
    },
  });
}
