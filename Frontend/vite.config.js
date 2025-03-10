import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // Change this to an absolute path
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 1000
  },
  server: {
    historyApiFallback: true
  }
});
