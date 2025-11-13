import { useState } from "react";
import axios from "axios";
// Import our new types, which match your main.py
import { type RecommendationsResponse, type GeneratePlaylistResponse } from "../types.ts";

const CreatePlaylist = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for step 1
  const [recommendations, setRecommendations] = useState<RecommendationsResponse | null>(null);
  
  // State for step 2
  const [finalPlaylist, setFinalPlaylist] = useState<GeneratePlaylistResponse | null>(null);
  
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // --- STEP 1: Get Recommendations ---
  const handleGenerate = async () => {
    const refreshToken = localStorage.getItem("spotify_refresh_token");
    if (!refreshToken) return alert("Please log in first.");

    setIsLoading(true);
    setError(null);
    setRecommendations(null); // Clear old results
    setFinalPlaylist(null); // Clear old results

    try {
      // This is your correct API call from before
      const { data } = await axios.post<RecommendationsResponse>(
        `${apiUrl}/generate-recommendations?refresh_token=${refreshToken}`,
        { prompt }
      );
      setRecommendations(data); // Set the recommendation data
    } catch (err) {
      console.error("Error generating recommendations:", err);
      setError("Failed to get recommendations. Please try a different prompt.");
    }
    setIsLoading(false);
  };

  // --- STEP 2: Create the Playlist ---
  const handleCreatePlaylist = async () => {
    if (!recommendations) return;
    
    const refreshToken = localStorage.getItem("spotify_refresh_token");
    if (!refreshToken) return alert("Please log in first.");

    setIsLoading(true);
    setError(null);

    try {
      // This is your NEW API call to the second endpoint
      const { data } = await axios.post<GeneratePlaylistResponse>(
        `${apiUrl}/generate-playlist?refresh_token=${refreshToken}`,
        {
          title: recommendations.title,
          description: recommendations.description,
          song_uris: recommendations.song_uris,
        }
      );
      setFinalPlaylist(data); // Set the *final* playlist data
      setRecommendations(null); // Clear the recommendations UI
    } catch (err) {
      console.error("Error creating playlist:", err);
      setError("Failed to create the playlist on Spotify.");
    }
    setIsLoading(false);
  };

  // Helper to build the final URL
  const getFinalUrl = () => {
    if (!finalPlaylist) return "#";
    // This builds the URL based on the ID returned from your backend
    return `https://open.spotify.com/playlist/${finalPlaylist.playlist_id}`;
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Describe your vibe 🎧</h2>
      
      {/* Input area - Only show if no final playlist */}
      {!finalPlaylist && (
        <>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A rainy day in a cozy coffee shop, feeling nostalgic but hopeful..."
            className="border p-3 w-full h-32 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt}
            className="bg-blue-600 text-white mt-4 px-6 py-3 rounded-lg w-full font-semibold shadow-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
          >
            {isLoading ? "Generating..." : "Generate Recommendations"}
          </button>
        </>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Step 1: Show recommendations */}
      {recommendations && (
        <div className="mt-8 p-6 border rounded-lg bg-gray-50 shadow-inner">
          <h3 className="text-2xl font-bold text-gray-800">{recommendations.title}</h3>
          <p className="text-gray-600 mt-1">{recommendations.description}</p>
          
          <ul className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-2">
            {/* THIS IS THE FIX: We map 'recommendations.tracks' */}
            {recommendations.tracks.map((track) => (
              <li key={track.id} className="text-sm flex justify-between">
                <div>
                  <strong className="text-gray-900">{track.name}</strong>
                  {" - "}
                  <span className="text-gray-500">{track.artists.map((a) => a.name).join(", ")}</span>
                </div>
                <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="text-green-500 text-xs hover:underline">
                  Preview
                </a>
              </li>
            ))}
          </ul>

          <button
            onClick={handleCreatePlaylist}
            disabled={isLoading}
            className="bg-green-600 text-white mt-6 px-6 py-3 rounded-lg w-full font-semibold shadow-md hover:bg-green-700 transition duration-200 disabled:bg-gray-400"
          >
            {isLoading ? "Creating..." : "Create this Playlist on Spotify"}
          </button>
        </div>
      )}

      {/* Step 2: Show final created playlist */}
      {finalPlaylist && (
        <div className="mt-8 p-6 border rounded-lg bg-green-50 text-center shadow-inner">
          <h3 className="text-2xl font-bold text-green-800">Playlist Created!</h3>
          <p className="text-gray-700 mt-2">Your new playlist is ready.</p>
          <a
            href={getFinalUrl()} // This builds the URL from the playlist_id
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white mt-6 px-6 py-3 rounded-lg inline-block font-semibold shadow-md hover:bg-green-700 transition duration-200"
          >
            Open on Spotify
          </a>
        </div>
      )}
    </div>
  );
};

export default CreatePlaylist;