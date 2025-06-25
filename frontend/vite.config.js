import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Prevent Rollup from trying to bundle dependencies that cause issues
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      // Explicitly set external dependencies
      external: [/@rollup\/rollup-linux-x64-gnu/],
      onwarn(warning, warn) {
        // Suppress specific warnings
        if (
          warning.code === "MISSING_EXPORT" ||
          warning.code === "CIRCULAR_DEPENDENCY" ||
          warning.message.includes("@rollup/rollup-linux")
        )
          return;
        warn(warning);
      },
    },
  },
  optimizeDeps: {
    exclude: ["@rollup/rollup-linux-x64-gnu"],
  },
});
