import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Published on GitHub Pages under the repo's name: the deploy workflow
  // sets BASE_PATH (e.g. "/tv-guide/"). Locally it stays at the root.
  base: process.env.BASE_PATH ?? "/",
  plugins: [react()],
});
