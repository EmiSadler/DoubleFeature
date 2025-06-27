import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/tests/setupTests.js",

    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{js,jsx,ts,tsx}"],
      exclude: ["**/*.test.{js,ts,jsx,tsx}", "node_modules"],
    },
  },
});
