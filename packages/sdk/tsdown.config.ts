import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: {
        common: 'src/common/index.ts',
        thor: 'src/thor/index.ts',
        'sdk-viem': 'src/viem/index.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    treeshake: true,
    minify: false,
    outDir: './dist',
    clean: true,
    target: 'es2020',
    platform: 'neutral',
    external: ['viem'] // ensure viem is not bundled
});
