import { defineConfig } from 'tsup';
import { resolve } from 'path';

export default defineConfig({
    treeshake: true,
    minify: true,
    sourcemap: true,
    esbuildOptions(options) {
        // Configure path alias resolution for esbuild
        options.alias = {
            '@common/*': resolve(__dirname, './src/common/*'),
            '@thor/*': resolve(__dirname, './src/thor/*'),
            '@viem/*': resolve(__dirname, './src/viem/*'),
        };
    }
});
