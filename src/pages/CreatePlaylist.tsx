import './CreatePlaylist.css'
import { useState } from "react";
import axios from "axios";
import { type RecommendationsResponse, type GeneratePlaylistResponse } from "../types.ts";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, SoftShadows } from "@react-three/drei";
import Airpods from "../Airpods.tsx";
import CameraRig from "./CameraRig.tsx";
import SpheresScene from './SpheresScene.tsx';

const CreatePlaylist = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [recommendations, setRecommendations] = useState<RecommendationsResponse | null>(null);
  const [finalPlaylist, setFinalPlaylist] = useState<GeneratePlaylistResponse | null>(null);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleGenerate = async () => {
    const refreshToken = localStorage.getItem("spotify_refresh_token");
    if (!refreshToken) return alert("Please log in first.");

    setIsLoading(true);
    setError(null);
    setRecommendations(null);
    setFinalPlaylist(null);

    try {
      const { data } = await axios.post<RecommendationsResponse>(
        `${apiUrl}/generate-recommendations?refresh_token=${refreshToken}`,
        { prompt }
      );
      setRecommendations(data);
    } catch (err) {
      console.error("Error generating recommendations:", err);
      setError("Failed to get recommendations. Please try a different prompt.");
    }
    setIsLoading(false);
  };

  const handleCreatePlaylist = async () => {
    if (!recommendations) return;

    const refreshToken = localStorage.getItem("spotify_refresh_token");
    if (!refreshToken) return alert("Please log in first.");

    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.post<GeneratePlaylistResponse>(
        `${apiUrl}/generate-playlist?refresh_token=${refreshToken}`,
        {
          title: recommendations.title,
          description: recommendations.description,
          song_uris: recommendations.song_uris,
        }
      );
      setFinalPlaylist(data);
      setRecommendations(null);
    } catch (err) {
      console.error("Error creating playlist:", err);
      setError("Failed to create the playlist on Spotify.");
    }
    setIsLoading(false);
  };

  const getFinalUrl = () => {
    if (!finalPlaylist) return "#";
    return `https://open.spotify.com/playlist/${finalPlaylist.playlist_id}`;
  };

  return (
    <div id="create_playlist_container">

      <div id="input-output_container">
        {!finalPlaylist && (
          <div id="input_container">
            <textarea
              id="mood_prompt"
              wrap="soft"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What's your mood today?"
              disabled={isLoading}
            />
            <button onClick={handleGenerate} disabled={isLoading || !prompt} className="glass_button">
              {isLoading ? "Enchanting..." : "Enchant mood"}
            </button>
          </div>
        )}

        {error && <div>{error}</div>}

        <div id="output_container">
          {recommendations && (
            <div>
              <h3 className="details">{recommendations.title}</h3>
              <p className="details">{recommendations.description}</p>

              <div id="list_container">
                <ul>
                  {recommendations.tracks.map((track) => (
                    <li key={track.id} className='track'>
                      <div>
                        <strong>{track.name}</strong> -{" "}
                        <span>{track.artists.map((a) => a.name).join(", ")}</span>
                      </div>
                      <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                        Preview
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <button onClick={handleCreatePlaylist} disabled={isLoading} id="add_to_spotify_button">
                {isLoading ? "Creating..." : "Add Playlist to Spotify"}
              </button>
            </div>
          )}

          {finalPlaylist && (
            <div>
              <h3>Playlist Created!</h3>
              <p>Your new playlist is ready.</p>
              <a href={getFinalUrl()} target="_blank" rel="noopener noreferrer">
                Open on Spotify
              </a>
            </div>
          )}
          </div>
        </div>

      <div id="canvas-container">
        <Canvas
            shadows>
            <PerspectiveCamera makeDefault position={[0, 0, 2]} />

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

            <Airpods />

            <CameraRig />

            <SpheresScene />
        </Canvas>
      </div>

    </div>
  );
};

export default CreatePlaylist;
