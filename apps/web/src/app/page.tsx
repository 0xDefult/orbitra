"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Globe } from "@/components/globe/Globe";
import { LoadingSequence } from "@/components/ui/LoadingSequence";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { AudioToggle } from "@/components/ui/AudioToggle";
import { NowOrbiting } from "@/components/story/NowOrbiting";
import { useUIStore } from "@/stores/ui";
import { useGlobeStore } from "@/stores/globe";

export default function HomePage() {
  const isLoading = useUIStore((s) => s.isLoading);
  const activeMode = useUIStore((s) => s.activeMode);
  const isGlobeReady = useGlobeStore((s) => s.isGlobeReady);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-void-900">
      {/* Cinematic Loading Screen */}
      <AnimatePresence>
        {isLoading && <LoadingSequence />}
      </AnimatePresence>

      {/* 3D Globe — always rendered, layered behind UI */}
      <div className="absolute inset-0 z-0">
        <Globe />
      </div>

      {/* UI Overlay — fades in after globe is ready */}
      <AnimatePresence>
        {!isLoading && isGlobeReady && (
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {/* Mode Toggle */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-auto">
              <ModeToggle />
            </div>

            {/* Audio Toggle */}
            <div className="absolute top-6 right-6 pointer-events-auto">
              <AudioToggle />
            </div>

            {/* Tagline */}
            <div className="absolute bottom-8 left-8 pointer-events-none">
              <motion.p
                className="text-white/40 text-sm font-mono tracking-widest uppercase"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                Every Satellite Has a Story
              </motion.p>
            </div>

            {/* Satellite count */}
            <div className="absolute bottom-8 right-8 pointer-events-none">
              <motion.p
                className="text-white/30 text-xs font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 0.8 }}
              >
                Tracking thousands of satellites in real time
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Story Mode Panel */}
      <AnimatePresence>
        {activeMode === "story" && <NowOrbiting />}
      </AnimatePresence>
    </main>
  );
}
