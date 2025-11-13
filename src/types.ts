export interface SpotifyArtist {
  name: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;
  artists: SpotifyArtist[];
  external_urls: {
    spotify: string;
  };
}

// Response from /generate-recommendations
export interface RecommendationsResponse {
  title: string;
  description: string;
  song_uris: string[];
  tracks: SpotifyTrack[]; // This is the key we need for display
}

// Response from /generate-playlist
export interface GeneratePlaylistResponse {
  message: string;
  playlist_id: string;
}