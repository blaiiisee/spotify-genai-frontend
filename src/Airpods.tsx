import { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const Airpods = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/airpods.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        if (mesh.geometry) {
            mesh.geometry.computeVertexNormals();
        }

        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        
        // --- Material Override Logic ---
        materials.forEach((material) => {
            if (material instanceof THREE.MeshStandardMaterial) {
                material.color.setHex(0xFFFFFF);
            }
        });
      }
    });

    if (groupRef.current) {
      groupRef.current.scale.set(18, 18, 18);
    }
  }, [scene]);

  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0; 
    }
  });

  return (
    <primitive
      ref={groupRef}
      object={scene}
      position={[0, -4, -3]}
      rotation={[0, 0, 0]}
      castShadow
      receiveShadow
    />
  );
};

export default Airpods;