import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App";
import Callback from "./pages/Callback.tsx";
import CreatePlaylist from "./pages/CreatePlaylist.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="/create" element={<CreatePlaylist />} />
    </Routes>
  </BrowserRouter>
);
