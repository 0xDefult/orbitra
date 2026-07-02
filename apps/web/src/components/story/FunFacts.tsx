"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FunFactsProps {
  satelliteName: string;
}

// Sample fun facts — in production, fetched from DB or AI-generated
const sampleFacts = [
  "Landsat 9 can detect 16,384 shades of color, far beyond what the human eye can perceive.",
  "The Landsat program is the longest-running space-based Earth observation mission, started in 1972.",
  "Each Landsat 9 image covers an area of 185 × 185 kilometers — about the size of Belgium.",
  "Landsat data is freely available to the public and has been used in over 100,000 scientific papers.",
  "Landsat 9 orbits in a sun-synchronous orbit, meaning it always crosses the equator at the same local time.",
];

/**
 * FunFacts — rotating fun facts about the selected satellite.
 * Cycles through facts with a fade transition.
 */
export function FunFacts({ satelliteName }: FunFactsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sampleFacts.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-4">
      <span className="text-2xs font-mono uppercase tracking-wider text-neon-gold/60">
        Did You Know?
      </span>
      <div className="relative mt-1 min-h-[3em]">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            className="text-xs text-white/60 leading-relaxed italic"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.5 }}
          >
            {sampleFacts[currentIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
      {/* Dot indicators */}
      <div className="flex gap-1 mt-2">
        {sampleFacts.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-1 h-1 rounded-full transition-colors ${
              i === currentIndex ? "bg-neon-gold" : "bg-white/15 hover:bg-white/30"
            }`}
            aria-label={`Fun fact ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
