import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { HardhatVechainProvider } from '../../../src';
import { mainnetUrl } from '../../fixture';
import { BaseWallet } from '@vechain/sdk-wallet';
import { VechainSDKLogger } from '@vechain/sdk-logging';

/**
 * Hardhat provider tests - Mainnet
 *
 * @group integration/providers/hardhat-provider-mainnet
 */
describe('Hardhat provider tests', () => {
    /**
     * Hardhat provider instances
     */
    let providerInDebugMode: HardhatVechainProvider;

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        providerInDebugMode = new HardhatVechainProvider(
            new BaseWallet([]),
            mainnetUrl,
            (message: string, parent?: Error) => new Error(message, parent),
            true
        );
    });

    /**
     * Test debug mode.
     */
    test('Should be able to enable debug mode', async () => {
        // Spy on VechainSDKLogger
        const logSpy = jest.spyOn(VechainSDKLogger('log'), 'log');

        // Call an RPC function (e.g., eth_blockNumber)
        await providerInDebugMode.request({
            method: 'eth_blockNumber',
            params: []
        });

        expect(logSpy).toHaveBeenCalled();
        logSpy.mockRestore();
    });

    /**
     * Test debug mode errors.
     */

    /**
     * Test debug mode errors in send function.
     */
    test('Should be able to log errors in debug mode - send function', async () => {
        // Spy on VechainSDKLogger
        const logSpy = jest.spyOn(VechainSDKLogger('error'), 'log');

        // Error during call
        await expect(
            async () => await providerInDebugMode.send('INVALID_METHOD', [-1])
        ).rejects.toThrowError();

        expect(logSpy).toHaveBeenCalled();
        logSpy.mockRestore();
    });
});
