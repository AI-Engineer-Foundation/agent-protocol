import { defineConfig } from "tsup";

// import * as packageJSON from "./package.json";

// const excludedPackages: string | string[] = [];

export default defineConfig({
  entry: ["src/index.ts"],
  dts: true,
  sourcemap: true,
  format: ["iife", "cjs", "esm"],
  // noExternal: Object.keys(packageJSON.dependencies).filter(
  //   (f) => !excludedPackages.includes(f),
  // ),
});
