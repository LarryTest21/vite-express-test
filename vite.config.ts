import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

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
