import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 1000, // Increase limit to 1000 KB (default is 500 KB)
  },
  server: {
    historyApiFallback: true
  }
});
