import { defineConfig } from 'tsup';
import { resolve } from 'path';

export default defineConfig({
    treeshake: true,
    minify: true,
    sourcemap: true,
    esbuildOptions(options) {
        // Configure path alias resolution for esbuild
        options.alias = {
            '@vcdm': resolve(__dirname, './packages/core/src/vcdm'),
            '@errors': resolve(__dirname, './packages/core/src/errors'),
            '@certificate': resolve(__dirname, './packages/core/src/certificate'),
            '@transaction': resolve(__dirname, './packages/core/src/transaction'),
            '@hdkey': resolve(__dirname, './packages/core/src/hdkey'),
            '@keystore': resolve(__dirname, './packages/core/src/keystore'),
            '@cryptography': resolve(__dirname, './packages/core/src/keystore/cryptography'),
            '@secp256k1': resolve(__dirname, './packages/core/src/secp256k1'),
            '@utils': resolve(__dirname, './packages/core/src/utils')
        };
    }
});
