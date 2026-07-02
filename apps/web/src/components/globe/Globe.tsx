"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { EarthSurface } from "./EarthSurface";
import { Atmosphere } from "./Atmosphere";
import { Starfield } from "./Starfield";
import { Satellites } from "./Satellites";
import { CameraController } from "./CameraController";
import { PostProcessing } from "./PostProcessing";

/**
 * Globe — the main 3D canvas containing the Earth, satellites, stars, and effects.
 * Rendered as a background layer behind all UI elements.
 */
export function Globe() {
  return (
    <Canvas
      camera={{
        position: [0, 2, 22],
        fov: 45,
        near: 0.1,
        far: 1000,
      }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: 4, // ACES Filmic
        toneMappingExposure: 1.2,
      }}
      style={{
        background: "radial-gradient(ellipse at center, #060620 0%, #01010a 70%)",
      }}
    >
      <Suspense fallback={null}>
        {/* Scene lighting */}
        <ambientLight intensity={0.1} />
        <directionalLight
          position={[100, 50, 100]}
          intensity={1.5}
          color="#ffffff"
        />

        {/* Earth and atmosphere */}
        <EarthSurface />
        <Atmosphere />

        {/* Background stars */}
        <Starfield />

        {/* Satellites */}
        <Satellites />

        {/* Camera controller */}
        <CameraController />

        {/* Post-processing effects */}
        <PostProcessing />
      </Suspense>
    </Canvas>
  );
}
