import { defineConfig } from 'tsup';
import { resolve } from 'path';

export default defineConfig({
    entry: {
        common: './packages/sdk/src/common/index.ts',
        thor: './packages/sdk/src/thor/index.ts',
        viem: './packages/sdk/src/viem/index.ts',
    },
    format: ['cjs', 'esm'],
    dts: false,
    sourcemap: true,
    treeshake: true,
    minify: true,
    outDir: './packages/sdk/dist',
    esbuildOptions(options) {
        // Configure path alias resolution for esbuild
        options.alias = {
            '@common': resolve(__dirname, './src/common'),
            '@common/errors': resolve(__dirname, './src/common/errors'),
            '@common/vcdm': resolve(__dirname, './src/common/vcdm'),
            '@common/http': resolve(__dirname, './src/common/http'),
            '@common/logging': resolve(__dirname, './src/common/logging'),
            '@common/cryptography/secp256k1': resolve(__dirname, './src/common/cryptography/secp256k1'),
            '@common/cryptography/hdkey': resolve(__dirname, './src/common/cryptography/hdkey'),
            '@thor': resolve(__dirname, './src/thor'),
            '@thor/thorest': resolve(__dirname, './src/thor/thorest'),
            '@thor/thorest/model': resolve(__dirname, './src/thor/thorest/model'),
            '@thor/thorest/model/Transfer': resolve(__dirname, './src/thor/thorest/model/Transfer'),
            '@thor/thorest/model/Clause': resolve(__dirname, './src/thor/thorest/model/Clause'),
            '@thor/thorest/model/Event': resolve(__dirname, './src/thor/thorest/model/Event'),
            '@thor/thorest/model/Output': resolve(__dirname, './src/thor/thorest/model/Output'),
            '@thor/thorest/logs': resolve(__dirname, './src/thor/thorest/logs'),
            '@thor/thorest/transactions/model/Tx': resolve(__dirname, './src/thor/thorest/transactions/model/Tx'),
            '@thor/thor-client': resolve(__dirname, './src/thor/thor-client'),
            '@thor/thor-client/ThorClient': resolve(__dirname, './src/thor/thor-client/ThorClient'),
            '@thor/thor-client/model/logs/EventLogFilter': resolve(__dirname, './src/thor/thor-client/model/logs/EventLogFilter'),
            '@thor/thor-client/model/logs/FilterRange': resolve(__dirname, './src/thor/thor-client/model/logs/FilterRange'),
            '@thor/thor-client/model/logs/FilterRangeUnits': resolve(__dirname, './src/thor/thor-client/model/logs/FilterRangeUnits'),
            '@thor/thor-client/model/logs/FilterOptions': resolve(__dirname, './src/thor/thor-client/model/logs/FilterOptions'),
            '@thor/thor-client/model/logs/EventCriteria': resolve(__dirname, './src/thor/thor-client/model/logs/EventCriteria'),
            '@thor/ws': resolve(__dirname, './src/thor/ws'),
            '@thor/utils': resolve(__dirname, './src/thor/utils'),
        };
    }
});
