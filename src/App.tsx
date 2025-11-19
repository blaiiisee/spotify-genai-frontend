import "./App.css";
import { Canvas } from "@react-three/fiber";
import { SoftShadows } from "@react-three/drei";
import Airpods from "./Airpods.tsx";
import { Text3D, Center } from '@react-three/drei';
import CameraRig from "./pages/CameraRig.tsx";
import SpheresScene from "./pages/SpheresScene.tsx";

const App = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  return (
    <div id="login_container">
      <div id="canvas-container">
        <Canvas
          shadows
          camera={{ position: [0, 0, 4], fov: 50 }} >
          {/* Lights */}
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[0, 1, 10]}
            castShadow
            intensity={1.6}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <SoftShadows size={10} samples={50} focus={0.4}/>

          <CameraRig />

          <Airpods />
          <Center position={[-1, 0.6, 0.5]}>
              <Text3D
                font="/Karina.json"
                size={0.4}
                height={0.05}
                >Himig
                <meshStandardMaterial color="#e2d380" /></Text3D>
          </Center>
          <Center position={[1.5, 0.1, -0.5]}>
              <Text3D
                font="/Karina.json"
                size={0.2}
                height={0.02}
                lineHeight={0.7}
                >{`Your mood.\nEnchanted.`}
                <meshStandardMaterial color="#f5d3a1" /></Text3D>
          </Center>
          <SpheresScene />
        </Canvas>
      </div>
      <div id="login_text_container">
        <a href={`${apiUrl}/login`}>
          <div className="glass_button">
            <img src="/spotify_logo.png" alt="Spotify logo" />
            Login with Spotify</div>
        </a>
      </div>
    </div>
  );
};

export default App;
