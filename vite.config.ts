import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import nodePolyfills from "@emreerdogan/vite-plugin-node-stdlib-browser";

export default defineConfig({
  plugins: [vue(), nodePolyfills()],

  server: {
    port: 5173,
  },
});
