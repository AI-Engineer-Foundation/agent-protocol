import { defineConfig } from 'tsup'

import * as packageJSON from './package.json'

const excludedPackages = []

export default defineConfig({
  entry: ['examples/minimal.ts'],
  target: 'node16',
  platform: 'node',
  format: 'cjs',
  noExternal: Object.keys(packageJSON.dependencies).filter(
    f => !excludedPackages.includes(f),
  ),
})
