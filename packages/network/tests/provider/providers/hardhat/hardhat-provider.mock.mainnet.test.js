"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_logging_1 = require("@vechain/sdk-logging");
const src_1 = require("../../../../src");
/**
 * Hardhat provider tests - Mainnet
 *
 * @group integration/providers/hardhat-provider-mainnet
 */
(0, globals_1.describe)('Hardhat provider tests', () => {
    /**
     * Hardhat provider instances
     */
    let providerInDebugMode;
    /**
     * Setup global log mocks before all tests
     */
    (0, globals_1.beforeAll)(() => {
        // Silence all loggers without affecting spy functionality
        globals_1.jest.spyOn((0, sdk_logging_1.VeChainSDKLogger)('log'), 'log').mockImplementation(() => { });
        globals_1.jest.spyOn((0, sdk_logging_1.VeChainSDKLogger)('error'), 'log').mockImplementation(() => { });
        globals_1.jest.spyOn((0, sdk_logging_1.VeChainSDKLogger)('warning'), 'log').mockImplementation(() => { });
    });
    /**
     * Init thor client and provider before each test
     */
    (0, globals_1.beforeEach)(() => {
        providerInDebugMode = new src_1.HardhatVeChainProvider(new src_1.ProviderInternalBaseWallet([]), src_1.MAINNET_URL, (message, parent) => new Error(message, parent), true);
    });
    /**
     * Test debug mode.
     */
    (0, globals_1.test)('Should be able to enable debug mode', async () => {
        // Spy on VeChainSDKLogger without changing implementation (already mocked)
        const logSpy = globals_1.jest.spyOn((0, sdk_logging_1.VeChainSDKLogger)('log'), 'log');
        // Clear previous calls to ensure clean test
        logSpy.mockClear();
        // Call an RPC function (e.g., eth_blockNumber)
        await providerInDebugMode.request({
            method: 'eth_blockNumber',
            params: []
        });
        (0, globals_1.expect)(logSpy).toHaveBeenCalled();
    });
    /**
     * Test debug mode errors.
     */
    /**
     * Test debug mode errors in send function.
     */
    (0, globals_1.test)('Should be able to log errors in debug mode - send function', async () => {
        // Spy on VeChainSDKLogger without changing implementation (already mocked)
        const logSpy = globals_1.jest.spyOn((0, sdk_logging_1.VeChainSDKLogger)('error'), 'log');
        // Clear previous calls to ensure clean test
        logSpy.mockClear();
        // Error during call
        await (0, globals_1.expect)(async () => await providerInDebugMode.send('INVALID_METHOD', [-1])).rejects.toThrowError();
        (0, globals_1.expect)(logSpy).toHaveBeenCalled();
    });
});
