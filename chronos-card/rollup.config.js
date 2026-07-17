import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/chronos-card.ts",
  output: {
    file: "../custom_components/chronos/www/chronos-card.js",
    format: "es",
  },
  plugins: [
    resolve(),
    // Leaflet ships as UMD/CJS; commonjs() converts it for the ES bundle.
    commonjs(),
    typescript(),
    terser({ format: { comments: false } }),
  ],
};
