import { defineConfig } from "vite";
import path from "path";
import postcssNesting from "postcss-nesting";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "index.js"),
      formats: ["cjs", "es", "iife", "umd"],
      name: "CodecrushCore",
      fileName: (format) => `@codecrush-core.${format}.js`,
    },
  },
  css: {
    postcss: {
      plugins: [postcssNesting()],
    },
  },
});
