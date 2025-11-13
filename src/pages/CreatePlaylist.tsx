import { useState } from "react";
import axios from "axios";
import { type RecommendationsResponse, type GeneratePlaylistResponse } from "../types.ts";

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
    <div>
      <h2>Describe your vibe 🎧</h2>

      {!finalPlaylist && (
        <>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A rainy day in a cozy coffee shop, feeling nostalgic but hopeful..."
            disabled={isLoading}
          />
          <button onClick={handleGenerate} disabled={isLoading || !prompt}>
            {isLoading ? "Generating..." : "Generate Recommendations"}
          </button>
        </>
      )}

      {error && <div>{error}</div>}

      {recommendations && (
        <div>
          <h3>{recommendations.title}</h3>
          <p>{recommendations.description}</p>

          <ul>
            {recommendations.tracks.map((track) => (
              <li key={track.id}>
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

          <button onClick={handleCreatePlaylist} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create this Playlist on Spotify"}
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
  );
};

export default CreatePlaylist;
