import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/components/index.ts"),
      formats: ["cjs", "es", "iife", "umd"],
      name: "CodecrushReact",
      fileName: (format) => `${format}/index.js`,
    },
    rollupOptions: {
      external: ["codecrush-core", "react", "react-dom"],
    },
    manifest: true,
    ssrManifest: true,
    ssr: true,
  },
  server: {
    port: 5174
  }
});
