"use client";

import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";

// Sample data for exploration
const sampleSatellites = Array.from({ length: 24 }, (_, i) => ({
  id: `sat-${i}`,
  name: [
    "Landsat 9", "Sentinel-2A", "Hubble", "ISS", "Starlink-1001",
    "GPS III-5", "GOES-18", "Terra", "Aqua", "PlanetScope",
    "WorldView-4", "Gaia", "TESS", "JWST", "OneWeb-042",
    "Iridium NEXT", "GRACE-FO", "ICESat-2", "CYGNSS", "SMAP",
    "CloudSat", "CALIPSO", "GPM Core", "Jason-3",
  ][i],
  country: ["US", "EU", "US", "INT", "US"][i % 5],
  type: ["Earth Observation", "Communication", "Navigation", "Science", "Technology"][i % 5],
  orbit: ["LEO", "MEO", "GEO", "LEO (SSO)"][i % 4],
  launchYear: 2015 + Math.floor(i / 3),
}));

/**
 * Explore Mode — browse and discover satellites through filters and visualizations.
 */
export default function ExplorePage() {
  return (
    <motion.div
      className="absolute inset-0 z-10 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold neon-text">Explore</h1>
          <p className="text-white/50 mt-2">Discover satellites by country, mission, orbit, and more.</p>
        </div>

        {/* Quick filter chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["All", "LEO", "GEO", "Earth Observation", "Communication", "Navigation", "Active Only"].map((filter) => (
            <button
              key={filter}
              className="px-4 py-1.5 text-xs rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Satellite grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sampleSatellites.map((sat, i) => (
            <motion.div
              key={sat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.4 }}
            >
              <GlassPanel variant="light" padding="md" className="h-full hover:bg-white/[0.06] transition-colors cursor-pointer group">
                {/* Orbital ring graphic */}
                <div className="w-10 h-10 mb-3 rounded-full border border-neon-cyan/20 flex items-center justify-center group-hover:border-neon-cyan/40 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-glow" />
                </div>
                <h3 className="font-medium text-sm text-white mb-1">{sat.name}</h3>
                <div className="space-y-1">
                  <p className="text-2xs text-white/40">
                    {sat.country} · {sat.type}
                  </p>
                  <p className="text-2xs text-white/30">
                    {sat.orbit} · {sat.launchYear}
                  </p>
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
