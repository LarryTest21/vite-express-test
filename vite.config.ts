import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import nodePolyfills from "vite-plugin-node-stdlib-browser";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      process: "process/browser",
      zlib: "browserify-zlib",
      util: "util",
    },
  },
  plugins: [vue()],
});
