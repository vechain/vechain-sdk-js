import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';

/**
 * RPC Mapper integration tests for 'txpool_status' method
 *
 * @group integration/rpc-mapper/methods/txpool_status
 */
describe('RPC Mapper - txpool_status method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.fromUrl(TESTNET_URL);
    });

    /**
     * txpool_status RPC call tests - Positive cases
     */
    describe('txpool_status - Positive cases', () => {
        /**
         * Should return the transaction pool status
         */
        test('Should return the transaction pool status', async () => {
            const txPoolInspect = await RPCMethodsMap(thorClient)[
                RPC_METHODS.txpool_status
            ]([]);

            expect(txPoolInspect).toStrictEqual({});
        });
    });
});
