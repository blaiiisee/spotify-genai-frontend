const App = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Gemify 🎵</h1>
      <a href={`${apiUrl}/login`}>
        <button className="bg-green-500 text-white px-6 py-3 rounded-lg">
          Login with Spotify
        </button>
      </a>
    </div>
  );
};

export default App;
