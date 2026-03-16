import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  envPrefix: ["VITE_", "MAPS_"],
  server: {
    proxy: {
      "/functions/tailgatetime-prod": {
        target: "https://us-central1-tailgatetime-prod.cloudfunctions.net",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/functions\/tailgatetime-prod/, "")
      },
      "/functions/lot-legends": {
        target: "https://us-central1-lot-legends.cloudfunctions.net",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/functions\/lot-legends/, "")
      }
    }
  }
});
