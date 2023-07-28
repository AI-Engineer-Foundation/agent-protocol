import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  target: 'node16',
  platform: 'node',
  format: 'cjs',
  dts: true,
})
