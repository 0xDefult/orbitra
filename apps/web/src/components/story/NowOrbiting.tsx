"use client";

import { motion, AnimatePresence } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { NarrationText } from "./NarrationText";
import { JourneyTimeline } from "./JourneyTimeline";
import { StatRing } from "./StatRing";
import { FunFacts } from "./FunFacts";
import { useUIStore } from "@/stores/ui";
import { useGlobeStore } from "@/stores/globe";
import { useStoryStore } from "@/stores/story";

/**
 * NowOrbiting — the main Story Mode panel.
 *
 * Inspired by Spotify's Now Playing screen, this glass-panel overlay
 * shows everything about the currently "playing" satellite:
 * name, origin, stats, journey chapters, AI narration, and fun facts.
 */
export function NowOrbiting() {
  const activeMode = useUIStore((s) => s.activeMode);
  const selectedSatelliteId = useGlobeStore((s) => s.selectedSatelliteId);
  const setMode = useUIStore((s) => s.setMode);
  const selectSatellite = useGlobeStore((s) => s.selectSatellite);

  const isVisible = activeMode === "story" && !!selectedSatelliteId;

  const handleClose = () => {
    selectSatellite(null);
    setMode("globe");
  };

  // Sample data — in production, fetched from API
  const satelliteData = {
    name: "Landsat 9",
    noradId: 49260,
    country: "United States",
    countryCode: "US",
    flagEmoji: "🇺🇸",
    operator: "NASA / USGS",
    manufacturer: "Northrop Grumman",
    missionType: "Earth Observation",
    launchDate: "2021-09-27",
    launchVehicle: "Atlas V 401",
    launchSite: "Vandenberg SLC-3E",
    orbitalClass: "LEO (SSO)",
    altitude: 705,
    speed: 7.5,
    orbitNumber: 22541,
    inclination: 98.2,
    period: 98.8,
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Bottom panel — Spotify Now Playing style */}
          <div className="absolute bottom-0 inset-x-0 pointer-events-auto">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
            >
              <GlassPanel
                variant="heavy"
                glow="cyan"
                padding="lg"
                className="mx-4 mb-6 rounded-glass-lg max-w-2xl mx-auto"
              >
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left column — Satellite identity & stats */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="mb-4">
                      <span className="inline-block px-2 py-0.5 mb-2 text-2xs font-mono uppercase tracking-widest text-neon-cyan/80 bg-neon-cyan/5 rounded-full border border-neon-cyan/20">
                        Now Orbiting
                      </span>
                      <h2 className="text-2xl lg:text-3xl font-display font-bold text-white tracking-tight neon-text">
                        {satelliteData.name}
                      </h2>
                      <div className="flex items-center gap-2 mt-2 text-sm text-white/60">
                        <span>{satelliteData.flagEmoji}</span>
                        <span>{satelliteData.country}</span>
                        <span className="text-white/20">·</span>
                        <span>{satelliteData.operator}</span>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                      <StatRing
                        label="Altitude"
                        value={satelliteData.altitude}
                        suffix="km"
                        max={1000}
                        color="#00f0ff"
                      />
                      <StatRing
                        label="Speed"
                        value={satelliteData.speed}
                        suffix=" km/s"
                        max={10}
                        decimals={1}
                        color="#ffaa00"
                      />
                      <StatRing
                        label="Orbit #"
                        value={satelliteData.orbitNumber}
                        suffix=""
                        max={50000}
                        color="#a855f7"
                      />
                    </div>

                    {/* Journey Timeline */}
                    <div className="mb-3">
                      <p className="text-2xs font-mono uppercase tracking-wider text-white/30 mb-2">
                        Journey
                      </p>
                      <JourneyTimeline />
                    </div>

                    {/* AI Narration */}
                    <NarrationText />
                  </div>

                  {/* Right column — Details & Fun Facts */}
                  <div className="w-full lg:w-64 shrink-0">
                    {/* Quick details */}
                    <div className="space-y-2 mb-4">
                      <DetailRow label="Manufacturer" value={satelliteData.manufacturer} />
                      <DetailRow label="Mission" value={satelliteData.missionType} />
                      <DetailRow label="Launch" value={satelliteData.launchDate} />
                      <DetailRow label="Vehicle" value={satelliteData.launchVehicle} />
                      <DetailRow label="Orbit" value={`${satelliteData.orbitalClass} · ${satelliteData.inclination}°`} />
                    </div>

                    {/* Fun Facts */}
                    <FunFacts satelliteName={satelliteData.name} />
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Small detail row for the side panel */
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline gap-2">
      <span className="text-xs text-white/40 whitespace-nowrap">{label}</span>
      <span className="text-xs text-white/70 text-right truncate">{value}</span>
    </div>
  );
}
