import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cinematic dark palette
        void: {
          50: "#f0f0ff",
          100: "#e0e0ff",
          200: "#c0c0ff",
          300: "#8a8aff",
          400: "#5454ff",
          500: "#1e1eff",
          600: "#0a0a2e",
          700: "#060620",
          800: "#030315",
          900: "#01010a",
          950: "#000005",
        },
        // Neon accent colors for satellites
        neon: {
          cyan: "#00f0ff",
          blue: "#0088ff",
          purple: "#a855f7",
          pink: "#ff44aa",
          gold: "#ffaa00",
          green: "#00ff88",
          red: "#ff3344",
        },
        // Glass surfaces
        glass: {
          light: "rgba(255, 255, 255, 0.08)",
          medium: "rgba(255, 255, 255, 0.05)",
          heavy: "rgba(255, 255, 255, 0.12)",
          border: "rgba(255, 255, 255, 0.1)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
        cinematic: ["clamp(2rem, 5vw, 4.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "cinematic-sub": ["clamp(1rem, 2vw, 1.5rem)", { lineHeight: "1.4", letterSpacing: "0.05em" }],
      },
      borderRadius: {
        glass: "16px",
        "glass-sm": "10px",
        "glass-lg": "24px",
        "glass-xl": "32px",
      },
      boxShadow: {
        glow: "0 0 40px rgba(0, 240, 255, 0.15)",
        "glow-strong": "0 0 80px rgba(0, 240, 255, 0.25)",
        "glow-gold": "0 0 40px rgba(255, 170, 0, 0.15)",
        "glass": "0 8px 32px rgba(0, 0, 0, 0.4)",
        "glass-sm": "0 4px 16px rgba(0, 0, 0, 0.3)",
      },
      backdropBlur: {
        glass: "20px",
        "glass-heavy": "40px",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "orbit-spin": "orbit-spin 20s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "fade-in": "fade-in 0.8s ease-out",
        "slide-up": "slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "text-reveal": "text-reveal 1.5s steps(40) forwards",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        "orbit-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
