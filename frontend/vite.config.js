import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: '[name].[hash].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[hash].[ext]'
      },
    },
  },
  server: {
    host: true,
    port: 5173,
    headers: {
      'Content-Type': 'application/javascript',
    },
  },
  preview: {
    host: true,
    port: 5173,
    headers: {
      'Content-Type': 'application/javascript',
    },
  },
});
