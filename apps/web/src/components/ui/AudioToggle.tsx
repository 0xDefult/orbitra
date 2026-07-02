"use client";

import { motion } from "framer-motion";
import { useAudioStore } from "@/stores/audio";

/**
 * AudioToggle — ambient audio toggle button.
 * Minimal icon button with glass effect.
 */
export function AudioToggle() {
  const isEnabled = useAudioStore((s) => s.isEnabled);
  const toggle = useAudioStore((s) => s.toggle);

  return (
    <motion.button
      onClick={toggle}
      className="w-10 h-10 rounded-full bg-white/[0.06] backdrop-blur-[20px] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.12] transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isEnabled ? "Mute ambient audio" : "Enable ambient audio"}
    >
      {isEnabled ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white/80"
        >
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M19.07 4.93a10 10 0 010 14.14" />
          <path d="M15.54 8.46a5 5 0 010 7.07" />
        </svg>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white/40"
        >
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </motion.button>
  );
}
