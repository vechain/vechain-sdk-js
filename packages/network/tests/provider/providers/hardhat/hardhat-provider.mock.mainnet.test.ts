import {
    beforeAll,
    beforeEach,
    describe,
    expect,
    jest,
    test
} from '@jest/globals';

import { VeChainSDKLogger } from '@vechain/sdk-logging';
import {
    HardhatVeChainProvider,
    MAINNET_URL,
    ProviderInternalBaseWallet
} from '../../../../src';

/**
 * Hardhat provider tests - Mainnet
 *
 * @group integration/providers/hardhat-provider-mainnet
 */
describe('Hardhat provider tests', () => {
    /**
     * Hardhat provider instances
     */
    let providerInDebugMode: HardhatVeChainProvider;

    /**
     * Setup global log mocks before all tests
     */
    beforeAll(() => {
        // Silence all loggers without affecting spy functionality
        jest.spyOn(VeChainSDKLogger('log'), 'log').mockImplementation(() => {});
        jest.spyOn(VeChainSDKLogger('error'), 'log').mockImplementation(
            () => {}
        );
        jest.spyOn(VeChainSDKLogger('warning'), 'log').mockImplementation(
            () => {}
        );
    });

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        providerInDebugMode = new HardhatVeChainProvider(
            new ProviderInternalBaseWallet([]),
            MAINNET_URL,
            (message: string, parent?: Error) => new Error(message, parent),
            true
        );
    });

    /**
     * Test debug mode.
     */
    test('Should be able to enable debug mode', async () => {
        // Spy on VeChainSDKLogger without changing implementation (already mocked)
        const logSpy = jest.spyOn(VeChainSDKLogger('log'), 'log');

        // Clear previous calls to ensure clean test
        logSpy.mockClear();

        // Call an RPC function (e.g., eth_blockNumber)
        await providerInDebugMode.request({
            method: 'eth_blockNumber',
            params: []
        });

        expect(logSpy).toHaveBeenCalled();
    });

    /**
     * Test debug mode errors.
     */

    /**
     * Test debug mode errors in send function.
     */
    test('Should be able to log errors in debug mode - send function', async () => {
        // Spy on VeChainSDKLogger without changing implementation (already mocked)
        const logSpy = jest.spyOn(VeChainSDKLogger('error'), 'log');

        // Clear previous calls to ensure clean test
        logSpy.mockClear();

        // Error during call
        await expect(
            async () => await providerInDebugMode.send('INVALID_METHOD', [-1])
        ).rejects.toThrowError();

        expect(logSpy).toHaveBeenCalled();
    });
});
