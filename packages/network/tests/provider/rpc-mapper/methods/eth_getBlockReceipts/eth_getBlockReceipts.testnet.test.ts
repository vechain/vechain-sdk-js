import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import { blockReceiptsFixture, blockReceiptsInvalidFixture } from './fixture';
import { JSONRPCInvalidParams } from '@vechain/sdk-errors';

/**
 * RPC Mapper integration tests for 'eth_getBlockReceipts' method
 *
 * @group integration/sdk-network/rpc-mapper/methods/eth_getBlockReceipts
 */
describe('RPC Mapper - eth_getBlockReceipts method tests', () => {
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
     * eth_getBlockReceipts RPC call tests - Positive cases
     */
    describe('eth_getBlockReceipts - Positive cases', () => {
        /**
         * Positive case 1 - Simple block receipts retrieval
         */
        test('Should be able to get block receipts', async () => {
            for (const fixture of blockReceiptsFixture) {
                // Call RPC function
                const rpcCall = await RPCMethodsMap(thorClient)[
                    RPC_METHODS.eth_getBlockReceipts
                ]([fixture.blockNumber]);

                // Compare the result with the expected value
                expect(rpcCall).toEqual(fixture.expected);
            }
        }, 20000);

        /**
         * Should get a result with block tags 'latest' and 'finalized'
         */
        test('Should get a result with block tags "latest" and "finalized"', async () => {
            for (const blockNumber of ['latest', 'finalized']) {
                // Call RPC function
                const rpcCall = await RPCMethodsMap(thorClient)[
                    RPC_METHODS.eth_getBlockReceipts
                ]([blockNumber]);

                // Compare the result with the expected value
                expect(rpcCall).toBeDefined();
            }
        }, 20000);
    });

    /**
     * eth_getBlockReceipts RPC call tests - Negative cases
     */
    describe('eth_getBlockReceipts - Negative cases', () => {
        /**
         * Throw error if RPC parameters are invalid
         */
        test('Should throw error with invalid parameters', async () => {
            for (const fixture of blockReceiptsInvalidFixture) {
                await expect(
                    async () =>
                        await RPCMethodsMap(thorClient)[
                            RPC_METHODS.eth_getBlockReceipts
                        ]([fixture])
                ).rejects.toThrowError(JSONRPCInvalidParams);
            }
        });
    });
});
