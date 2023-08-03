import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  target: 'node16',
  platform: 'node',
  format: 'cjs',
  minify: true,
  sourcemap: true,
  dts: true,
  loader: {
    '.yml': 'text',
  },
})
