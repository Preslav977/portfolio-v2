import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setup.js",
    // Process CSS in tests so a `?inline` import returns the real stylesheet.
    // The contrast test reads src/index.css this way, which keeps the CSS as
    // the single source of truth for the palette (PLAN.md §2.5).
    css: { include: [/\.css/] },
  },
});
