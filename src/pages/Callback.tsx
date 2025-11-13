import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("refresh_token");

    if (token) {
      localStorage.setItem("spotify_refresh_token", token);
      navigate("/create");
    }
  }, [navigate]);

  return <p>Authenticating...</p>;
};

export default Callback;
