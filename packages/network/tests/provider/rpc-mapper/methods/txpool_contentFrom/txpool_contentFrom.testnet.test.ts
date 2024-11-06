import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import { JSONRPCInvalidParams } from '@vechain/sdk-errors';

/**
 * RPC Mapper integration tests for 'txpool_contentFrom' method
 *
 * @group integration/rpc-mapper/methods/txpool_contentFrom
 */
describe('RPC Mapper - txpool_contentFrom method tests', () => {
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
     * txpool_contentFrom RPC call tests - Positive cases
     */
    describe('txpool_contentFrom - Positive cases', () => {
        /**
         * Should return the transaction pool content from address
         */
        test('Should return the transaction pool content from address', async () => {
            const txPoolInspect = await RPCMethodsMap(thorClient)[
                RPC_METHODS.txpool_contentFrom
            ](['0x9e7911de289c3c856ce7f421034f66b6cde49c39']);

            expect(txPoolInspect).toStrictEqual({});
        });
    });

    /**
     * txpool_contentFrom RPC call tests - Negative cases
     */
    describe('txpool_contentFrom - Negative cases', () => {
        /**
         * Should not be able to return the transaction pool content from address
         */
        test('Should not be able to return the transaction pool content from address', async () => {
            // No params
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.txpool_contentFrom
                    ]([])
            ).rejects.toThrowError(JSONRPCInvalidParams);

            // Extra params
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.txpool_contentFrom
                    ](['0x9e7911de289c3c856ce7f421034f66b6cde49c39', 'extra'])
            ).rejects.toThrowError(JSONRPCInvalidParams);

            // Invalid address
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.txpool_contentFrom
                    ](['INVALID_ADDRESS'])
            ).rejects.toThrowError(JSONRPCInvalidParams);
        });
    });
});
