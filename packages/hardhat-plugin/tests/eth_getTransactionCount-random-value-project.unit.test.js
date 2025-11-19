"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const plugins_testing_1 = require("hardhat/plugins-testing");
const test_utils_1 = require("./test-utils");
/**
 * Simple hardhat project eth_getTransactionCount-random-value-project network configuration defined
 *
 * @group unit/eth_getTransactionCount-random-value-project
 */
(0, globals_1.describe)('Using eth_getTransactionCount with random value (not the default 0x0 value)', () => {
    /**
     * Init hardhat runtime environment
     */
    let hre;
    (0, globals_1.beforeEach)(function () {
        // Set hardhat context
        (0, test_utils_1.setHardhatContext)('eth_getTransactionCount-random-value-project');
        // Load hardhat environment using require instead of dynamic import
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        hre = require('hardhat');
    });
    (0, globals_1.afterEach)(function () {
        (0, plugins_testing_1.resetHardhatContext)();
    });
    /**
     * Test suite for eth_getTransactionCount with random value
     */
    (0, globals_1.describe)('Custom network configuration hardhat', () => {
        /**
         * Should be able to get random value from eth_getTransactionCount
         */
        (0, globals_1.test)('Should be able to get random value from eth_getTransactionCount', async () => {
            // Network configuration should be defined
            (0, globals_1.expect)(hre.config.networks.vechain_testnet).toBeDefined();
            // Initialize network configuration AND check ethGetTransactionCountDefaultValue parameter
            const networkConfig = hre.config.networks
                .vechain_testnet;
            (0, globals_1.expect)(networkConfig.rpcConfiguration
                ?.ethGetTransactionCountMustReturn0).toBe(false);
            // Get the provider
            (0, globals_1.expect)(hre.VeChainProvider).toBeDefined();
            const provider = hre.VeChainProvider;
            // Expect 0 as the default value
            const request = await provider?.request({
                method: 'eth_getTransactionCount',
                params: ['0x0b41c56e19c5151122568873a039fEa090937Fe2', 'latest']
            });
            (0, globals_1.expect)(request).not.toBe('0x0');
        });
    });
});
