"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const plugins_testing_1 = require("hardhat/plugins-testing");
const test_utils_1 = require("./test-utils");
/**
 * Simple hardhat project withoutVeChain network configuration defined
 *
 * @group unit/no-vechain-network-defined-project
 */
(0, globals_1.describe)('Custom network configuration hardhat withoutVeChain network defined', () => {
    /**
     * Init hardhat runtime environment
     */
    let hre;
    (0, globals_1.beforeEach)(function () {
        // Set hardhat context
        (0, test_utils_1.setHardhatContext)('no-vechain-network-defined-project');
        // Load hardhat environment using require instead of dynamic import
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        hre = require('hardhat');
    });
    (0, globals_1.afterEach)(function () {
        (0, plugins_testing_1.resetHardhatContext)();
    });
    /**
     * Test suite for createWalletFromHardhatNetworkConfig
     */
    (0, globals_1.describe)('Custom network configuration hardhat', () => {
        /**
         * Positive test cases for createWalletFromHardhatNetworkConfig function
         */
        (0, globals_1.test)('Should be able to get custom configuration from a project', () => {
            // Default network (hardhat) should be undefined
            (0, globals_1.expect)(hre.config.networks.hardhat).toBeDefined();
        });
    });
});
