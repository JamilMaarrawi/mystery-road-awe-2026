import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: ".",
  publicDir: "public",
  base: "./",
  plugins: [react()],

  build: {
    outDir: "dist",
    // Both the vanilla app and the React version are built during the migration.
    rollupOptions: {
      input: { main: "index.html", react: "react.html" },
    },
  },
});
