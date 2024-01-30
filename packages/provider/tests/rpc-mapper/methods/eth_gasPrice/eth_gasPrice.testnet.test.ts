import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';

/**
 * RPC Mapper integration tests for 'eth_gasPrice' method
 *
 * @group integration/rpc-mapper/methods/eth_gasPrice
 */
describe('RPC Mapper - eth_gasPrice method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = new ThorClient(testNetwork);
    });

    /**
     * Destroy thor client after each test
     */
    afterEach(() => {
        thorClient.destroy();
    });

    /**
     * eth_gasPrice RPC call tests - Positive cases
     */
    describe('eth_gasPrice - Positive cases', () => {
        /**
         * Positive case 1 - Get a dummy gas price value.
         */
        test('eth_gasPrice - Dummy gas price value', async () => {
            const gasPrice = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_gasPrice
            ]([]);
            expect(gasPrice).toBe('0x0');
        });
    });
});
