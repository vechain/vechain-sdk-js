import { defineConfig } from 'tsup';
import { resolve } from 'path';

export default defineConfig({
    treeshake: true,
    minify: true,
    sourcemap: true,
    esbuildOptions(options) {
        // Configure path alias resolution for esbuild
        options.alias = {
            '@vcdm': resolve(__dirname, './src/vcdm'),
            '@errors': resolve(__dirname, './src/errors'),
            '@certificate': resolve(__dirname, './src/certificate'),
            '@transaction': resolve(__dirname, './src/transaction'),
            '@hdkey': resolve(__dirname, './src/hdkey'),
            '@secp256k1': resolve(__dirname, './src/secp256k1'),
            '@utils': resolve(__dirname, './src/utils'),
            '@http': resolve(__dirname, './src/http'),
            '@thor/accounts': resolve(__dirname, './src/thor/accounts'),
            '@thor/blocks': resolve(__dirname, './src/thor/blocks'),
            '@thor/debug': resolve(__dirname, './src/thor/debug'),
            '@sdk': resolve(__dirname, './src'),
            '@thor/logs': resolve(__dirname, './src/thor/logs'),
            '@thor/node': resolve(__dirname, './src/thor/node'),
            '@thor/subscriptions': resolve(
                __dirname,
                './src/thor/subscriptions'
            ),
            '@thor/transactions': resolve(__dirname, './src/thor/transactions'),
            '@thor/utils': resolve(__dirname, './src/thor/utils'),
            '@ws': resolve(__dirname, './src/ws')
        };
    }
});
