import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import {
  EffectComposer,
  DepthOfField,
  ToneMapping,
} from "@react-three/postprocessing";

const GREYS = ["#3f3f3f", "#535353", "#272727","#202833", "#1d0f0f"];

function Sphere({ data }: any) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, dt) => {
    if (!ref.current) return;

    // Move sphere upward slowly
    data.y += dt * 1.05;

    ref.current.position.set(data.x, data.y, data.z);

    // Reset to bottom if it goes too high
    if (data.y > 60) {
      data.y = -60;
    }
  });

  return (
    <mesh ref={ref} scale={data.scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={data.color} roughness={0.4} metalness={0.1} />
    </mesh>
  );
}


export default function SpheresScene() {
  const count = 40;

  // Generate spheres data
  const spheres = Array.from({ length: count }).map((_, i) => ({
    x: THREE.MathUtils.randFloatSpread(100),
    y: THREE.MathUtils.randFloatSpread(120),
    z: -THREE.MathUtils.randFloat(50, 120),
    scale: THREE.MathUtils.randFloat(0.6, 3.2),
    color: GREYS[i % GREYS.length],
  }));

  return (
    <>
      {/* Very dark background */}
      <color attach="background" args={["#0b0b0b"]} />

      <spotLight
        position={[10, 20, 10]}
        penumbra={1}
        decay={0}
        intensity={2.5}
        color="#ffffff"
      />

      {/* Spheres */}
      {spheres.map((data, i) => (
        <Sphere key={i} data={data} />
      ))}

      <Environment preset="city" />

      <EffectComposer enableNormalPass multisampling={0}>
        <DepthOfField
          target={[0, 0, 0]}
          focalLength={15}
          bokehScale={10}
          height={700}
        />
        <ToneMapping />
      </EffectComposer>
    </>
  );
}
