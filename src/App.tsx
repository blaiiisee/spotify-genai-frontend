import "./App.css";
import { Canvas } from "@react-three/fiber";
import Donut from "./Donut.tsx";
import DarkVeil from "./DarkVeil.tsx";

const App = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  return (
    <>
      <DarkVeil   hueShift={23}
  noiseIntensity={0.2}
  scanlineIntensity={0.0}/>

      <div id="login_container">
        <h1 className="title_header">Gemify 🎵</h1>

        {/* 3D donut Placeholder*/}
        <div style={{ width: 100, height: 100 }}>
          <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Donut />
          </Canvas>
        </div>

        <a href={`${apiUrl}/login`}>
          <button className="login_button">
            Login with Spotify
          </button>
        </a>

      </div>

    </>
  );
};

export default App;
