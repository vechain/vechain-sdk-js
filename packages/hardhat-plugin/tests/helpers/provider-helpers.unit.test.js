"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const fixture_1 = require("./fixture");
const helpers_1 = require("../../src/helpers");
/**
 * Provider hardhat helpers test suite
 *
 * @group unit/hardhat-helpers
 */
(0, globals_1.describe)('Provider Hardhat Helpers', () => {
    /**
     * Test suite for createWalletFromHardhatNetworkConfig
     */
    (0, globals_1.describe)('createWalletFromHardhatNetworkConfig', () => {
        /**
         * Positive test cases for createWalletFromHardhatNetworkConfig function
         */
        fixture_1.createWalletFromHardhatNetworkConfigPositiveCasesFixture.forEach((fixture) => {
            (0, globals_1.test)(fixture.test, async () => {
                const wallet = (0, helpers_1.createWalletFromHardhatNetworkConfig)(fixture.networkConfig);
                const addresses = await wallet.getAddresses();
                const gasPayer = await wallet.getGasPayer();
                (0, globals_1.expect)(addresses).toEqual(fixture.expectedAddresses);
                (0, globals_1.expect)(gasPayer).toEqual(fixture.networkConfig.gasPayer ?? null);
            });
        });
    });
    /**
     * Negative test cases for createWalletFromHardhatNetworkConfig function
     */
    fixture_1.createWalletFromHardhatNetworkConfigNegativeCasesFixture.forEach((fixture) => {
        (0, globals_1.test)(fixture.test, () => {
            (0, globals_1.expect)(() => (0, helpers_1.createWalletFromHardhatNetworkConfig)(fixture.networkConfig)).toThrowError(fixture.expectedError);
        });
    });
});
