import { defineConfig } from 'tsup';
import { resolve } from 'path';

export default defineConfig({
    treeshake: true,
    minify: true,
    sourcemap: true,
    esbuildOptions(options) {
        // Configure path alias resolution for esbuild
        options.alias = {
            '@http': resolve(__dirname, './src/http'),
            '@thor/accounts': resolve(__dirname, './src/thor/accounts'),
            '@thor/blocks': resolve(__dirname, './src/thor/blocks'),
            '@thor/debug': resolve(__dirname, './src/thor/debug'),
            '@thor/logs': resolve(__dirname, './src/thor/logs'),
            '@thor/node': resolve(__dirname, './src/thor/node'),
            '@thor/subscriptions': resolve(__dirname, './src/thor/subscriptions'),
            '@thor/transactions': resolve(__dirname, './src/thor/transactions'),
            '@thor/utils': resolve(__dirname, './src/thor/utils'),
            '@ws': resolve(__dirname, './src/ws')
        };
    }
}); 