import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import {
    blockReceiptsFixture,
    blockHashReceiptsFixture,
    blockReceiptsInvalidFixture
} from './fixture';
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
         * Should retrieve receipts for specific block hash 0x015395abb2644d21d6f15c9e2b616a190e1a9d01259ba895d6f99ece4f99e2f0
         */
        test('Should retrieve receipts for specific block hash', async () => {
            const blockHash = blockHashReceiptsFixture.blockHash;
            const rpcCall = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_getBlockReceipts
            ]([blockHash]);

            // Compare the result with the expected value
            expect(rpcCall).toBeDefined();
        }, 20000);
    });

    describe('eth_getBlockReceipts - with tags', () => {
        /**
         * Throw error if RPC parameters are invalid
         */
        test('Should get block based on tags', async () => {
            for (const fixture of [
                'earliest',
                'latest',
                'safe',
                'finalized',
                'pending'
            ]) {
                const rpcCall = await RPCMethodsMap(thorClient)[
                    RPC_METHODS.eth_getBlockReceipts
                ]([fixture]);

                expect(rpcCall).toBeDefined();
            }
        });
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

    /**
     * Test for specific block hash 0x015395abb2644d21d6f15c9e2b616a190e1a9d01259ba895d6f99ece4f99e2f0
     */
    test('Should retrieve receipts for specific block hash 0x015395abb2644d21d6f15c9e2b616a190e1a9d01259ba895d6f99ece4f99e2f0', async () => {
        // Call RPC function with the specific block hash
        const rpcCall = await RPCMethodsMap(thorClient)[
            RPC_METHODS.eth_getBlockReceipts
        ]([blockHashReceiptsFixture.blockHash]);

        // Check that we got a response
        expect(rpcCall).toBeDefined();

        // If receipts are returned (not null), verify they have the correct structure
        if (rpcCall !== null) {
            // Verify it's an array
            expect(Array.isArray(rpcCall)).toBe(true);

            // Type guard for TypeScript
            if (Array.isArray(rpcCall) && rpcCall.length > 0) {
                // If there are receipts, verify their structure
                for (const receipt of rpcCall) {
                    expect(receipt).toHaveProperty('blockHash');
                    expect(receipt).toHaveProperty('blockNumber');
                    expect(receipt).toHaveProperty('transactionHash');
                    expect(receipt).toHaveProperty('status');
                    expect(receipt).toHaveProperty('logs');
                }
            }
        }
    }, 20000);
});
