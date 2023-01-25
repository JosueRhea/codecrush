import { defineConfig } from "vite";
import path from "path";
import postcssNesting from "postcss-nesting";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "index.js"),
      formats: ["cjs", "es", "iife", "umd"],
      name: "CodecrushCore",
      fileName: (format) => `${format}/index.js`,
    },
    rollupOptions: {
      output: {
        globals: {
          shiki: "shiki",
        },
      },
    },
    manifest: true,
    ssrManifest: true,
    ssr: true,
  },
  css: {
    postcss: {
      plugins: [postcssNesting()],
    },
  },
  plugins: [dts()],
  server: {
    port: 5173
  }
});
