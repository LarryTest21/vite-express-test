import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    open: false, // Prevents auto-opening
    port: 5173,
  },
  publicDir: "public", // ensures _redirects gets copied into dist/,
});
