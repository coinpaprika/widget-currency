import { defineConfig } from "vite";
import { terser } from "rollup-plugin-terser";
import path from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/widget.js"),
      name: "CoinpaprikaWidget",
      fileName: "widget.js",
    },
    rollupOptions: {
      output: [
        {
          entryFileNames: "widget.js",
          format: "es",
          sourcemap: false,
        },
        {
          entryFileNames: "widget.min.js",
          format: "es",
          sourcemap: false,
          plugins: [terser()],
        }
      ],
    },
    minify: false,
  },
  server: {
    watch: {
      include: ["./src/**"],
    },
  },
});
