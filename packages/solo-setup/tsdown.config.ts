import { defineConfig } from 'tsdown';

export default defineConfig({
  format: ['cjs', 'esm'],
  target: 'es2020',
  sourcemap: true,
  treeshake: true,
  minify: false,
});