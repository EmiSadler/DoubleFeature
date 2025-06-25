cine2dorkle / frontend / vite.config.js;
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      external: [/@rollup\/rollup-linux-x64-gnu/],
      onwarn(warning, warn) {
        if (
          warning.code === "MISSING_EXPORT" ||
          warning.code === "CIRCULAR_DEPENDENCY" ||
          warning.message.includes("@rollup/rollup-linux") ||
          warning.message.includes("tailwindcss")
        )
          return;
        warn(warning);
      },
    },
  },
  optimizeDeps: {
    exclude: ["@rollup/rollup-linux-x64-gnu"],
  },
  css: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
});
