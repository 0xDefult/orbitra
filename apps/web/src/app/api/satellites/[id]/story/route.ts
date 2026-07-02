import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/satellites/[id]/story
 * Get the story, chapters, and AI narration for a satellite.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // In production, fetch from DB or generate new narration
  return NextResponse.json({
    data: {
      satelliteId: id,
      satelliteName: "Landsat 9",
      currentChapter: {
        id: "ch-2",
        order: 2,
        title: "Approaching Chile",
        subtitle: "South American coastline",
        narration:
          "Landsat 9 now glides over the western coast of South America. Below, the Atacama Desert stretches like a golden ribbon — one of the driest places on Earth, and a favorite calibration target for its sensors.",
        duration: 480,
        progress: 0.35,
      },
      nextChapters: [
        {
          id: "ch-3",
          order: 3,
          title: "Entering Argentina",
          subtitle: "Patagonian skies",
          narration: null,
          duration: 420,
          progress: 0,
        },
        {
          id: "ch-4",
          order: 4,
          title: "South Atlantic",
          subtitle: "Heading toward Africa",
          narration: null,
          duration: 560,
          progress: 0,
        },
      ],
      narration:
        "Landsat 9 orbits at an altitude of 705 kilometers, its advanced sensors silently scanning Earth's surface below. Right now, it's passing over the Pacific Ocean, capturing data that helps scientists monitor deforestation, urban growth, and the health of our planet's ecosystems.",
    },
  });
}
