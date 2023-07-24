import { defineConfig } from "tsup";

import * as packageJSON from "./package.json";

const excludedPackages = [];

export default defineConfig({
  entry: ["src/index.ts"],
  target: "node16",
  platform: "node",
  format: "cjs",
  dts: true,
});
