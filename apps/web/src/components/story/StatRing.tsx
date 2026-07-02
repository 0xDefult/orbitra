"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface StatRingProps {
  label: string;
  value: number;
  suffix: string;
  max: number;
  color: string;
  decimals?: number;
}

/**
 * StatRing — an animated ring/circle showing a stat value with progress fill.
 * Used in Story Mode for altitude, speed, and orbit count.
 */
export function StatRing({ label, value, suffix, max, color, decimals = 0 }: StatRingProps) {
  const progress = Math.min(value / max, 1);
  const circumference = 2 * Math.PI * 22; // r=22
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <motion.div
      className="flex flex-col items-center gap-1 p-2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div className="relative w-14 h-14">
        {/* Background circle */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-white/8"
          />
          {/* Progress arc */}
          <motion.circle
            cx="24"
            cy="24"
            r="22"
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        {/* Center value */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-xs font-mono font-bold"
            style={{ color }}
          >
            {value.toFixed(decimals)}
          </motion.span>
        </div>
      </div>
      <span className="text-3xs text-white/40 font-mono uppercase tracking-wider">
        {label}
        {suffix && <span className="text-white/20">{suffix}</span>}
      </span>
    </motion.div>
  );
}
