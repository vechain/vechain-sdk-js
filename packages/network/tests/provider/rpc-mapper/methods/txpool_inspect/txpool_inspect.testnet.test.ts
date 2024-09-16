import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';

/**
 * RPC Mapper integration tests for 'txpool_inspect' method
 *
 * @group integration/rpc-mapper/methods/txpool_inspect
 */
describe('RPC Mapper - txpool_inspect method tests', () => {
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
     * txpool_inspect RPC call tests - Positive cases
     */
    describe('txpool_inspect - Positive cases', () => {
        /**
         * Should return the transaction pool content
         */
        test('Should return the transaction pool status', async () => {
            const txPoolInspect = await RPCMethodsMap(thorClient)[
                RPC_METHODS.txpool_inspect
            ]([]);

            expect(txPoolInspect).toStrictEqual({});
        });
    });
});
