import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",  // Ensure correct base path for Vercel
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 1000
  },
  server: {
    // Ensure proper history fallback in dev mode
    hmr: true
  },
  preview: {
    port: 5000
  }
});
