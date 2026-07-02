"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGlobeStore } from "@/stores/globe";
import { SATELLITE_COLORS, EARTH_RADIUS_KM, SCENE_SCALE } from "@/lib/constants";
import type { SceneSatellite } from "@/types";

/**
 * Satellites — renders thousands of satellites as instanced glowing spheres.
 * Color-coded by type (payload, debris, station, rocket body).
 */
export function Satellites() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const hoverPulseRef = useRef<number>(0);
  const [satellites, setSatellites] = useState<SceneSatellite[]>([]);

  const selectedSatelliteId = useGlobeStore((s) => s.selectedSatelliteId);
  const hoveredSatelliteId = useGlobeStore((s) => s.hoveredSatelliteId);
  const setSatelliteDataLoaded = useGlobeStore((s) => s.setSatelliteDataLoaded);

  // Generate sample satellite positions in various orbits
  // In production, these come from TLE propagation
  useEffect(() => {
    const samples: SceneSatellite[] = [];
    const count = 2000;
    const earthRadius = EARTH_RADIUS_KM * SCENE_SCALE;

    for (let i = 0; i < count; i++) {
      // Random orbit altitudes: LEO (200-2000km), MEO (2000-35786), GEO (35786)
      const orbitType = Math.random();
      let altitude: number;
      let objectType: "PAYLOAD" | "ROCKET_BODY" | "DEBRIS" | "STATION";

      if (orbitType < 0.7) {
        altitude = 200 + Math.random() * 1800; // LEO
        objectType = Math.random() < 0.6 ? "PAYLOAD" : Math.random() < 0.5 ? "DEBRIS" : "ROCKET_BODY";
      } else if (orbitType < 0.9) {
        altitude = 2000 + Math.random() * 20000; // MEO
        objectType = Math.random() < 0.7 ? "PAYLOAD" : "DEBRIS";
      } else {
        altitude = 35786 + (Math.random() - 0.5) * 100; // GEO region
        objectType = "PAYLOAD";
      }

      const orbitRadius = earthRadius + altitude * SCENE_SCALE;

      // Random orbital inclination
      const inclination = Math.random() * Math.PI * 0.8 + 0.1; // Avoid purely equatorial
      const phase = Math.random() * Math.PI * 2;
      const raan = Math.random() * Math.PI * 2; // Right ascension of ascending node

      // Position in orbital plane
      const xOrbit = orbitRadius * Math.cos(phase);
      const yOrbit = orbitRadius * Math.sin(phase);

      // Rotate by RAAN around Z, then by inclination around X
      const x = xOrbit * Math.cos(raan) - yOrbit * Math.sin(raan) * Math.cos(inclination);
      const y = yOrbit * Math.sin(inclination);
      const z = xOrbit * Math.sin(raan) + yOrbit * Math.cos(raan) * Math.cos(inclination);

      samples.push({
        id: `sample-${i}`,
        noradId: 10000 + i,
        name: `Satellite ${i}`,
        objectType,
        position: { x: x / SCENE_SCALE, y: y / SCENE_SCALE, z: z / SCENE_SCALE },
        geodetic: { latitude: 0, longitude: 0, altitude },
        velocity: 7.5,
        trail: [],
      });
    }

    setSatellites(samples);
    setSatelliteDataLoaded(true);
  }, [setSatelliteDataLoaded]);

  // Build instance matrices
  const matrices = useMemo(() => {
    const matrices = new Float32Array(satellites.length * 16);
    const dummy = new THREE.Matrix4();

    satellites.forEach((sat, i) => {
      const pos = new THREE.Vector3(
        sat.position.x * SCENE_SCALE,
        sat.position.y * SCENE_SCALE,
        sat.position.z * SCENE_SCALE,
      );

      // Small scale — satellites are tiny at Earth scale
      const scale = sat.objectType === "SPACE_STATION" ? 0.08 : 0.03;
      dummy.compose(pos, new THREE.Quaternion(), new THREE.Vector3(scale, scale, scale));
      dummy.toArray(matrices, i * 16);
    });

    return matrices;
  }, [satellites]);

  // Colors by type
  const colorArray = useMemo(() => {
    const colors = new Float32Array(satellites.length * 3);
    const color = new THREE.Color();

    satellites.forEach((sat, i) => {
      const hex = SATELLITE_COLORS[sat.objectType as keyof typeof SATELLITE_COLORS] || SATELLITE_COLORS.UNKNOWN;
      color.set(hex);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    });

    return colors;
  }, [satellites]);

  // Hover pulse animation
  useFrame((_, delta) => {
    hoverPulseRef.current += delta * 3;
  });

  if (satellites.length === 0) return null;

  return (
    <group>
      {/* Instanced satellite dots */}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, satellites.length]}
        frustumCulled={true}
      >
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
        <instancedBufferAttribute
          attach="instanceMatrix"
          args={[matrices, 16]}
        />
        {colorArray.length > 0 && (
          <instancedBufferAttribute
            attach="instanceColor"
            args={[colorArray, 3]}
          />
        )}
      </instancedMesh>

      {/* Selected satellite highlight — larger, pulsing */}
      {selectedSatelliteId && (
        <mesh>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial
            color="#ffaa00"
            transparent
            opacity={0.5 + Math.sin(hoverPulseRef.current) * 0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
