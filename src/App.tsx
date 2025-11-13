const App = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  return (
    <div>
      <h1>Gemify 🎵</h1>
      <a href={`${apiUrl}/login`}>
        <button>
          Login with Spotify
        </button>
      </a>
    </div>
  );
};

export default App;
