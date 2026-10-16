import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Pure modules only. The site's visual behaviour is checked in a real browser
// with Playwright.
export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
