"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";

// Key space events for timeline markers
const timelineEvents = [
  { year: 1957, event: "Sputnik 1 — First artificial satellite" },
  { year: 1961, event: "First human in space — Yuri Gagarin" },
  { year: 1969, event: "Apollo 11 — First Moon landing" },
  { year: 1971, event: "First space station — Salyut 1" },
  { year: 1981, event: "First Space Shuttle launch — Columbia" },
  { year: 1990, event: "Hubble Space Telescope deployed" },
  { year: 1998, event: "ISS construction begins" },
  { year: 2012, event: "Curiosity rover lands on Mars" },
  { year: 2019, event: "First Starlink batch deployed" },
  { year: 2021, event: "James Webb Space Telescope launched" },
  { year: 2025, event: "Present day — Over 8,000 active satellites" },
];

/**
 * Timeline Mode — scrub through space history and watch orbital traffic grow.
 */
export default function TimelinePage() {
  const [currentYear, setCurrentYear] = useState(2025);
  const [isPlaying, setIsPlaying] = useState(false);

  const yearRange = { min: 1957, max: 2025 };
  const progress = ((currentYear - yearRange.min) / (yearRange.max - yearRange.min)) * 100;

  return (
    <motion.div
      className="absolute inset-0 z-10 flex flex-col justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-5xl mx-auto w-full px-6 pb-8">
        <GlassPanel variant="heavy" padding="lg" className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-display text-2xl font-bold neon-text">Timeline</h1>
              <p className="text-white/50 text-sm mt-1">Scrub through space history</p>
            </div>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                isPlaying
                  ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40"
                  : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10"
              }`}
            >
              {isPlaying ? "⏸ Pause" : "▶ Play"}
            </button>
          </div>

          {/* Year display */}
          <div className="text-center mb-4">
            <motion.span
              className="font-display text-6xl font-bold text-white"
              key={currentYear}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {currentYear}
            </motion.span>
          </div>

          {/* Timeline scrubber */}
          <div className="relative">
            <input
              type="range"
              min={yearRange.min}
              max={yearRange.max}
              value={currentYear}
              onChange={(e) => setCurrentYear(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer
                bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5
                [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-neon-cyan [&::-webkit-slider-thumb]:shadow-glow"
            />
            {/* Event markers */}
            <div className="absolute top-1/2 -translate-y-1/2 inset-x-0 pointer-events-none">
              {timelineEvents.map((e) => {
                const left = ((e.year - yearRange.min) / (yearRange.max - yearRange.min)) * 100;
                return (
                  <div
                    key={e.year}
                    className="absolute w-2 h-2 rounded-full bg-neon-gold -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${left}%` }}
                    title={e.event}
                  />
                );
              })}
            </div>
          </div>
        </GlassPanel>

        {/* Launch events list */}
        <div className="flex gap-3 overflow-x-auto pb-4">
          {timelineEvents.map((e) => (
            <button
              key={e.year}
              onClick={() => setCurrentYear(e.year)}
              className={`flex-shrink-0 px-4 py-3 rounded-lg border text-left min-w-[200px] transition-colors
                ${e.year <= currentYear
                  ? "bg-neon-cyan/5 border-neon-cyan/20 hover:bg-neon-cyan/10"
                  : "bg-white/[0.02] border-white/5 opacity-50"
                }`}
            >
              <span className="text-xs font-mono text-neon-cyan/80">{e.year}</span>
              <p className="text-xs text-white/60 mt-1 line-clamp-2">{e.event}</p>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
