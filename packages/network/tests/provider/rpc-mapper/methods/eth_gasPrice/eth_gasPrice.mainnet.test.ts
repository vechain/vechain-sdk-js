import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    MAINNET_URL,
    RPC_METHODS,
    RPCMethodsMap,
    ThorClient
} from '../../../../../src';

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
        thorClient = ThorClient.fromUrl(MAINNET_URL);
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
            expect(gasPrice).toBe('0x9184e72a000');
        });
    });
});
