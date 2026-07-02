"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGlobeStore } from "@/stores/globe";
import { useUIStore } from "@/stores/ui";
import { CAMERA_IDLE_DISTANCE, CAMERA_TRANSITION_DURATION } from "@/lib/constants";
import type { CameraState } from "@/types";

/**
 * CameraController — cinematic camera state machine.
 *
 * States:
 * - IDLE: Slow auto-rotation around Earth
 * - APPROACH: Smooth zoom toward selected satellite
 * - FOLLOW: Track satellite from behind with slight lag
 * - ORBIT: User-controlled manual orbit
 * - TRANSITION: Smooth interpolation between states
 */
export function CameraController() {
  const { camera, gl } = useThree();
  const controlsRef = useRef<{
    target: THREE.Vector3;
    position: THREE.Vector3;
  }>({
    target: new THREE.Vector3(),
    position: new THREE.Vector3(),
  });

  const orbitAngle = useRef(0);
  const orbitHeight = useRef(CAMERA_IDLE_DISTANCE * 0.3);
  const transitionProgress = useRef(1); // 1 = complete
  const prevPosition = useRef(new THREE.Vector3());
  const prevTarget = useRef(new THREE.Vector3());
  const nextPosition = useRef(new THREE.Vector3());
  const nextTarget = useRef(new THREE.Vector3());

  const cameraState = useGlobeStore((s) => s.cameraState);
  const isStoryActive = useUIStore((s) => s.activeMode === "story");
  const loadingComplete = useUIStore((s) => !s.isLoading);

  // Initialize camera state
  useEffect(() => {
    if (!loadingComplete) return;

    camera.position.set(0, CAMERA_IDLE_DISTANCE * 0.3, CAMERA_IDLE_DISTANCE);
    camera.lookAt(0, 0, 0);

    prevPosition.current.copy(camera.position);
    prevTarget.current.set(0, 0, 0);
  }, [camera, loadingComplete]);

  useFrame((_, delta) => {
    if (!loadingComplete) return;

    const selectedId = useGlobeStore.getState().selectedSatelliteId;
    let currentState: CameraState = "IDLE";
    if (isStoryActive) currentState = "FOLLOW";
    else if (selectedId) currentState = "APPROACH";

    // Calculate target position based on state
    switch (currentState) {
      case "IDLE": {
        // Gentle auto-orbit
        orbitAngle.current += delta * 0.15;
        const x = Math.cos(orbitAngle.current) * CAMERA_IDLE_DISTANCE;
        const z = Math.sin(orbitAngle.current) * CAMERA_IDLE_DISTANCE;
        const y = Math.sin(orbitAngle.current * 0.5) * CAMERA_IDLE_DISTANCE * 0.3;

        nextTarget.current.set(0, 0, 0);
        nextPosition.current.set(x, y, z);
        break;
      }

      case "APPROACH": {
        // Move toward selected satellite
        nextTarget.current.set(0, 0, 0);
        nextPosition.current.set(0, 2, 5);
        break;
      }

      case "FOLLOW": {
        // Follow a satellite — enhanced orbital view
        orbitAngle.current += delta * 0.5;
        const dist = 3;
        const x = Math.cos(orbitAngle.current) * dist;
        const z = Math.sin(orbitAngle.current) * dist;
        const y = Math.sin(orbitAngle.current * 0.7) * dist * 0.5;

        nextTarget.current.set(0, 0, 0);
        nextPosition.current.set(x, y, z);
        break;
      }

      default:
        break;
    }

    // Smooth interpolation
    if (transitionProgress.current < 1) {
      transitionProgress.current = Math.min(
        1,
        transitionProgress.current + delta / CAMERA_TRANSITION_DURATION,
      );

      // Ease out cubic
      const t = 1 - Math.pow(1 - transitionProgress.current, 3);

      camera.position.lerpVectors(prevPosition.current, nextPosition.current, t);
      controlsRef.current.target.lerpVectors(prevTarget.current, nextTarget.current, t);
    } else {
      // Direct follow with slight lag
      camera.position.lerp(nextPosition.current, delta * 2);
      controlsRef.current.target.lerp(nextTarget.current, delta * 2);
    }

    camera.lookAt(controlsRef.current.target);

    // Start new transition if target changed significantly
    if (nextPosition.current.distanceTo(prevPosition.current) > 1) {
      prevPosition.current.copy(camera.position);
      prevTarget.current.copy(controlsRef.current.target);
      transitionProgress.current = 0;
    }
  });

  return null;
}
