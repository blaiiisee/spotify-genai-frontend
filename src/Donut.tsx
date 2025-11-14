import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Donut = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = 0;
      meshRef.current.rotation.y = 0;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[1, 0.4, 16, 100]} />
      <meshStandardMaterial color={"pink"} />
    </mesh>
  );
};

export default Donut;
