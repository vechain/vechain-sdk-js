import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { JSONRPCInternalError } from '@vechain/vechain-sdk-errors';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';
import { zeroBlock } from './fixture';

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
    describe('eth_getBlockByNumber - Positive cases', () => {
        /**
         * Positive case 1 - Should be able to get a block
         */
        test('eth_getBlockByNumber - Should be able to get a block', async () => {
            // Zero block
            const rpcCallZeroBlock = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_getBlockByNumber
            ]([0]);
            expect(rpcCallZeroBlock).toStrictEqual(zeroBlock);
        });

        /**
         * Positive case 2 - Should be able to get null if block does not exist
         */
        test('eth_getBlockByNumber - Should be able to get null block', async () => {
            // Null block
            const rpcCallNullBlock = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_getBlockByNumber
            ]([
                // Invalid revision
                '0x0000000000000000000000000000000000000000000000000000000000000000'
            ]);
            expect(rpcCallNullBlock).toBeNull();
        });
    });

    /**
     * eth_getBlockByNumber RPC call tests - Negative cases
     */
    describe('eth_getBlockByNumber - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('eth_getBlockByNumber - negative case 1', async () => {
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getBlockByNumber
                    ]([-1])
            ).rejects.toThrowError(JSONRPCInternalError);
        });
    });
});
