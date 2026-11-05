import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Vite 8 reads the `@/*` alias straight from tsconfig.json, so the alias
    // stays declared in exactly one place.
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // Explicit imports from "vitest" rather than globals — keeps test files
    // honest about their dependencies and keeps test types out of app scope.
    globals: false,
    restoreMocks: true,
  },
});
