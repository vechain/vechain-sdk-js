import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import {
    blockWithTransactionsExpanded,
    blockWithTransactionsNotExpanded,
    testNetwork
} from '../../../fixture';
import { zeroBlock } from './fixture';
import { ProviderRpcError } from '@vechain/vechain-sdk-errors';
import { vechain_sdk_core_ethers } from '@vechain/vechain-sdk-core';

/**
 * RPC Mapper integration tests for 'eth_getBlockByNumber' method
 *
 * @group integration/rpc-mapper/methods/eth_getBlockByNumber
 */
describe('RPC Mapper - eth_getBlockByNumber method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Inti thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = new ThorClient(testNetwork);
    });

    /**
     * Destory thor client after each test
     */
    afterEach(() => {
        thorClient.destroy();
    });

    /**
     * eth_getBlockByNumber RPC call tests - Positive cases
     */
    describe('Positive cases', () => {
        /**
         * Test case where the block number is zero and the full transaction objects flag is false
         */
        test('Should be able to get a block', async () => {
            // Zero block
            const rpcCallZeroBlock = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_getBlockByNumber
            ]([vechain_sdk_core_ethers.toQuantity(0), false]);
            expect(rpcCallZeroBlock).toStrictEqual(zeroBlock);
        });

        /**
         * Test case where the block number is zero and the full transaction objects flag is true
         */
        test('Should be able to get a block with full transaction objects', async () => {
            const rpcCall = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_getBlockByNumber
            ]([vechain_sdk_core_ethers.toQuantity(17529453), true]); // 17529453 is the block number of a block with transactions on testnet
            expect(rpcCall).toStrictEqual(blockWithTransactionsExpanded);
        });

        /**
         * Test case where the block number is zero and the full transaction objects flag is false
         */
        test('Should be able to get a block with transactions not expanded', async () => {
            const rpcCall = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_getBlockByNumber
            ]([vechain_sdk_core_ethers.toQuantity(17529453), false]); // 17529453 is the block number of a block with transactions on testnet
            expect(rpcCall).toStrictEqual(blockWithTransactionsNotExpanded);
        });

        /**
         * Test case where the revision is valid but doesn't refer to an existing block
         */
        test('Should be able to get null block', async () => {
            // Null block
            const rpcCallNullBlock = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_getBlockByNumber
            ]([
                // Invalid revision
                '0x0000000000000000000000000000000000000000000000000000000000000000',
                false
            ]);
            expect(rpcCallNullBlock).toBeNull();
        });
    });

    /**
     * eth_getBlockByNumber RPC call tests - Negative cases
     */
    describe('Negative cases', () => {
        /**
         * Test case where the block number is negative
         */
        test('Should throw `ProviderRpcError` for negative block number', async () => {
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getBlockByNumber
                    ]([`0x${BigInt(-1).toString(16)}`, false]) // Block number is negative (-1)
            ).rejects.toThrowError(ProviderRpcError);
        });
    });
});
