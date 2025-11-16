// CameraRig.tsx
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const CameraRig = () => {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  // Track mouse movement
  const handleMouseMove = (e: MouseEvent) => {
    mouse.current.x =(e.clientX / window.innerWidth) * 2 - 1;   // -1 to 1
    mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1; // -1 to 1
  };

  // Listen once
  if (typeof window !== "undefined") {
    window.addEventListener("mousemove", handleMouseMove);
  }

  useFrame(() => {
    // Amount of camera sway
    const intensity = 0.4;

    // Target camera position
    const targetX = -mouse.current.x * intensity;
    const targetY = -mouse.current.y * intensity;

    // Smooth movement (lerp)
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);

    // Keep camera *looking at the center*
    camera.lookAt(0, 0, 0);
  });

  return null;
};

export default CameraRig;
