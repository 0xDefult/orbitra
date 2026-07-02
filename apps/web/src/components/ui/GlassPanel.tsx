"use client";

import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassPanelProps extends HTMLMotionProps<"div"> {
  variant?: "light" | "medium" | "heavy";
  glow?: "cyan" | "gold" | "none";
  padding?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  light: "bg-white/5 backdrop-blur-[12px] border-white/5",
  medium: "bg-white/[0.07] backdrop-blur-[20px] border-white/10",
  heavy: "bg-white/[0.10] backdrop-blur-[40px] border-white/[0.12]",
};

const glowStyles = {
  cyan: "shadow-[0_0_20px_rgba(0,240,255,0.08),inset_0_0_20px_rgba(0,240,255,0.03)]",
  gold: "shadow-[0_0_20px_rgba(255,170,0,0.08),inset_0_0_20px_rgba(255,170,0,0.03)]",
  none: "",
};

const paddingStyles = {
  sm: "p-3",
  md: "p-5",
  lg: "p-8",
};

/**
 * GlassPanel — a glassmorphism container with backdrop blur, border, and optional glow.
 * Used throughout the app for cards, panels, and overlays.
 */
export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ variant = "medium", glow = "none", padding = "md", children, className, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-glass border",
          variantStyles[variant],
          glowStyles[glow],
          paddingStyles[padding],
          className,
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

GlassPanel.displayName = "GlassPanel";
