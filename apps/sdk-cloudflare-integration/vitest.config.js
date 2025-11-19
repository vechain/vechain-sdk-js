"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@cloudflare/vitest-pool-workers/config");
exports.default = (0, config_1.defineWorkersConfig)({
    test: {
        poolOptions: {
            workers: {
                wrangler: { configPath: './wrangler.toml' }
            }
        },
        server: {
            deps: {
                inline: ['crypto', 'ethers', '@vechain/sdk-core']
            }
        }
    }
});
