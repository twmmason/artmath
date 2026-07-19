import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // relative base so the build works on GitHub Pages project URLs
  base: "./",
  plugins: [react()],
  server: { port: 3003 },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
} as any);
