import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/index.css";

// Preserve previously shared hash URLs while moving public Host Pages to clean,
// indexable paths. This only rewrites app-owned route hashes.
if (window.location.hash.startsWith("#/")) {
  const legacyPath = window.location.hash.slice(1);
  window.history.replaceState(null, "", legacyPath);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
