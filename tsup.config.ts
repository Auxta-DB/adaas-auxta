import { defineConfig } from "tsup";

export default defineConfig([
  /**
   * ============================
   * Browser build
   * ============================
   *
   * Produces:
   *   dist/browser/index.mjs
   *   dist/browser/env.mjs
   *
   * - No Node globals
   * - No `process`
   * - Used by bundlers (Vite, Webpack, Rollup)
   */
  {
    entry: {
      // Public library entry
      index: "src/index.ts",
    },

    tsconfig: "./.conf/tsconfig.browser.json", // Separate tsconfig for browser build

    // Output directory for browser bundle
    outDir: "dist/browser",

    bundle: true, // Bundle for browser consumption

    // Browser consumers expect ESM
    format: ["esm"],

    // Tells esbuild this is browser-safe code
    platform: "browser",

    // Reasonable baseline for modern browsers
    target: "es2020",

    // Smaller bundles
    treeshake: true,

    // Useful for debugging in bundlers
    sourcemap: true,

    // Emit .d.ts files
    dts: true,

    minify: true, // Minify browser build for smaller size

    // Ensure .mjs extension for ESM output
    outExtension({ format }) {
      return {
        js: ".mjs"
      };
    }
  },

  /**
   * ============================
   * Node build
   * ============================
   *
   * Produces:
   *   dist/node/index.mjs
   *   dist/node/index.cjs
   *   dist/node/env.mjs
   *   dist/node/env.cjs
   *
   * - Can use process.env
   * - Used by Node (ESM + CJS)
   */
  {
    entry: {
      // Same public API as browser
      index: "src/index.ts",
    },

    tsconfig: "./.conf/tsconfig.node.json", // Separate tsconfig for node build

    splitting: true, // Disable code splitting for Node build

    // Output directory for node bundle
    outDir: "dist/node",

    bundle: true, // Don't bundle node build, keep imports as-is

    // Support both module systems
    format: ["esm", "cjs"],

    // Enables Node globals and resolution
    platform: "node",

    // Node 16+ safe baseline
    target: "es2020",

    treeshake: true,
    sourcemap: true,

    // Emit .d.ts files (shared shape)
    dts: true,

    minify: false, // Don't minify Node build for better readability

    // Ensure .cjs extension for CommonJS output
    outExtension({ format }) {
      return {
        js: format === "esm" ? ".mjs" : ".cjs"
      };
    }
  },
]);
