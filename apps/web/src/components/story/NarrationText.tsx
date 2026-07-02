"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * NarrationText — AI-generated narration that updates as the satellite travels.
 * Renders with a typewriter/streaming effect for a documentary feel.
 */
export function NarrationText() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Sample narration — in production, this streams from AI API
  const sampleNarration =
    "Landsat 9 orbits at an altitude of 705 kilometers, its advanced sensors silently scanning Earth's surface below. Right now, it's passing over the Pacific Ocean, capturing data that helps scientists monitor deforestation, urban growth, and the health of our planet's ecosystems. Every 16 days, it images the entire Earth — a continuous record stretching back to 1972.";

  useEffect(() => {
    setIsLoading(true);
    let index = 0;
    const interval = setInterval(() => {
      if (index < sampleNarration.length) {
        setText(sampleNarration.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsLoading(false);
      }
    }, 25); // Character-by-character reveal

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse-glow" />
        <span className="text-2xs font-mono uppercase tracking-wider text-neon-cyan/60">
          Live Narration
        </span>
      </div>
      <p className="text-sm text-white/70 leading-relaxed italic min-h-[3em]">
        {text}
        {isLoading && (
          <motion.span
            className="inline-block w-[1px] h-4 ml-0.5 bg-neon-cyan/60"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          />
        )}
      </p>
    </div>
  );
}
