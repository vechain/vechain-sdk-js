import { defineConfig } from 'tsup';
import { resolve } from 'path';

export default defineConfig({
    treeshake: true,
    minify: true,
    sourcemap: true,
    esbuildOptions(options) {
        // Configure path alias resolution for esbuild
        options.alias = {
            '@accounts': resolve(__dirname, './packages/sdk/src/thor/accounts'),
            '@blocks': resolve(__dirname, './packages/sdk/src/thor/blocks'),
            '@certificate': resolve(
                __dirname,
                './packages/sdk/src/certificate'
            ),
            '@cryptography': resolve(
                __dirname,
                './packages/sdk/src/keystore/cryptography'
            ),
            '@errors': resolve(__dirname, './packages/sdk/src/errors'),
            '@hdkey': resolve(__dirname, './packages/sdk/src/hdkey'),
            '@index': resolve(__dirname, './packages/sdk/src/index'),
            '@sdk': resolve(__dirname, './packages/sdk'),
            '@secp256k1': resolve(__dirname, './packages/sdk/src/secp256k1'),
            '@transaction': resolve(
                __dirname,
                './packages/sdk/src/thor/transactions'
            ),
            '@utils': resolve(__dirname, './packages/sdk/src/utils'),
            '@vcdm': resolve(__dirname, './packages/sdk/src/vcdm')
        };
    }
});
