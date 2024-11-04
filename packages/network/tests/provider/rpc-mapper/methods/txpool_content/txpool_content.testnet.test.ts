import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';

/**
 * RPC Mapper integration tests for 'txpool_content' method
 *
 * @group integration/rpc-mapper/methods/txpool_content
 */
describe('RPC Mapper - txpool_content method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.at(TESTNET_URL);
    });

    /**
     * txpool_content RPC call tests - Positive cases
     */
    describe('txpool_content - Positive cases', () => {
        /**
         * Should return the transaction pool content
         */
        test('Should return the transaction pool content', async () => {
            const txPoolInspect = await RPCMethodsMap(thorClient)[
                RPC_METHODS.txpool_content
            ]([]);

            expect(txPoolInspect).toStrictEqual({});
        });
    });
});
