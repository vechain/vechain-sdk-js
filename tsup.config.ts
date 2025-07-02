import { defineConfig } from 'tsup';
import { resolve } from 'path';

export default defineConfig({
    treeshake: true,
    minify: true,
    sourcemap: true,
    esbuildOptions(options) {
        // Configure path alias resolution for esbuild
        options.alias = {
            '@vcdm': resolve(__dirname, './packages/sdk/src/vcdm'),
            '@errors': resolve(__dirname, './packages/sdk/src/errors'),
            '@sdk': resolve(__dirname, './packages/sdk'),
            '@certificate': resolve(
                __dirname,
                './packages/sdk/src/certificate'
            ),
            '@transaction': resolve(
                __dirname,
                './packages/sdk/src/thor/transactions'
            ),
            '@accounts': resolve(__dirname, './packages/sdk/src/thor/accounts'),
            '@blocks': resolve(__dirname, './packages/sdk/src/thor/blocks'),
            '@hdkey': resolve(__dirname, './packages/sdk/src/hdkey'),
            '@keystore': resolve(__dirname, './packages/sdk/src/keystore'),
            '@cryptography': resolve(
                __dirname,
                './packages/sdk/src/keystore/cryptography'
            ),
            '@secp256k1': resolve(__dirname, './packages/sdk/src/secp256k1'),
            '@utils': resolve(__dirname, './packages/sdk/src/utils')
        };
    }
});
