"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGlobeStore } from "@/stores/globe";
import { useUIStore } from "@/stores/ui";

/**
 * Story Mode page for a specific satellite.
 * Activates the Now Orbiting panel on the globe view.
 * Redirects back to home since the story panel overlays the globe.
 */
export default function StoryPage() {
  const params = useParams();
  const router = useRouter();
  const selectSatellite = useGlobeStore((s) => s.selectSatellite);
  const setMode = useUIStore((s) => s.setMode);

  useEffect(() => {
    const id = params.id as string;
    if (id) {
      selectSatellite(id);
      setMode("story");
    }

    // Redirect to home — the story panel overlays the globe
    // This page is just for URL routing / deep linking
    router.replace("/");
  }, [params.id, selectSatellite, setMode, router]);

  return null;
}
