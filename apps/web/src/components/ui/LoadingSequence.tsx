"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/stores/ui";

/**
 * LoadingSequence — a cinematic movie-intro style loading screen.
 * Shows an orbital ring animation with the Orbitra logo reveal.
 */
export function LoadingSequence() {
  const [phase, setPhase] = useState<"loading" | "reveal" | "exit">("loading");
  const [progress, setProgress] = useState(0);
  const setLoadingProgress = useUIStore((s) => s.setLoadingProgress);
  const completeLoading = useUIStore((s) => s.completeLoading);

  useEffect(() => {
    // Simulate loading progress
    const duration = 2500; // 2.5 second loading sequence
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);
      setLoadingProgress(p);

      if (p >= 1) {
        clearInterval(interval);
        setPhase("reveal");

        // Exit the loading sequence
        setTimeout(() => {
          setPhase("exit");
          setTimeout(completeLoading, 600); // After exit animation
        }, 800);
      }
    }, 16); // 60fps

    return () => clearInterval(interval);
  }, [setLoadingProgress, completeLoading]);

  return (
    <motion.div
      className="cinematic-loading"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* Orbital Ring Animation */}
        <div className="relative w-48 h-48 mb-12">
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-neon-cyan/30"
            initial={{ scale: 0, rotate: 0 }}
            animate={{
              scale: [0, 1.1, 1],
              rotate: 360,
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            }}
          />

          {/* Inner ring — counter-rotating */}
          <motion.div
            className="absolute inset-4 rounded-full border border-neon-blue/20"
            initial={{ scale: 0, rotate: 0 }}
            animate={{
              scale: [0, 1.1, 1],
              rotate: -360,
            }}
            transition={{
              duration: 2.5,
              ease: "easeInOut",
              rotate: { duration: 4, repeat: Infinity, ease: "linear" },
            }}
          />

          {/* Center dot — satellite */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-cyan shadow-glow"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 1] }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />

          {/* Orbiting dot */}
          <motion.div
            className="absolute top-0 left-1/2 w-2 h-2 -translate-x-1/2 rounded-full bg-neon-gold"
            animate={{
              rotate: 360,
            }}
            style={{
              transformOrigin: "24px 96px",
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        {/* Logo Text */}
        <AnimatePresence>
          {(phase === "loading" || phase === "reveal") && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.h1
                className="font-display text-cinematic neon-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                ORBITRA
              </motion.h1>
              <motion.p
                className="mt-2 text-white/40 text-sm tracking-[0.3em] uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Every Satellite Has a Story
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress bar — styled as orbital path */}
        <motion.div
          className="mt-8 w-64 h-[1px] bg-white/10 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-neon-cyan/50 via-neon-cyan to-neon-blue"
            style={{ width: `${progress * 100}%` }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
