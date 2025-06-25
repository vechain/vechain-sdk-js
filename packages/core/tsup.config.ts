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
            '@keystore': resolve(__dirname, './src/keystore'),
            '@cryptography': resolve(__dirname, './src/keystore/cryptography'),
            '@secp256k1': resolve(__dirname, './src/secp256k1'),
            '@utils': resolve(__dirname, './src/utils')
        };
    }
}); 