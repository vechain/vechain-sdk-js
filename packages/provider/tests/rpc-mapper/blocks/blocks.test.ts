import { describe, expect, test } from '@jest/globals';
import { JSONRPCInternalError } from '@vechainfoundation/vechain-sdk-errors';
import { zeroBlock } from './fixture';
import { RPC_METHODS, RPCMethodsMap } from '../../../src';
import { ThorClient } from '@vechainfoundation/vechain-sdk-network';
import { testNetwork } from '../../fixture';

/**
 * RPC Mapper integration tests
 *
 * @group integration/rpc-mapper/blocks
 */
describe('RPC Mapper - Blocks tests', () => {
    /**
     * eth_getBlockByNumber RPC call tests
     */
    describe('eth_getBlockByNumber', () => {
        /**
         * Positive cases
         */
        test('eth_getBlockByNumber - positive cases', async () => {
            // Init thor client
            const thorClient = new ThorClient(testNetwork);

            // Zero block
            const rpcCallZeroBlock = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_getBlockByNumber
            ]([0]);
            expect(rpcCallZeroBlock).toStrictEqual(zeroBlock);

            // Null block
            const rpcCallNullBlock = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_getBlockByNumber
            ]([
                // Invalid revision
                '0x0000000000000000000000000000000000000000000000000000000000000000'
            ]);
            expect(rpcCallNullBlock).toBeNull();

            // @NOTE for future PRs
            // thorClient.destroy();
        });

        /**
         * Negative cases
         */
        test('eth_getBlockByNumber - negative cases', async () => {
            // Init thor client
            const thorClient = new ThorClient(testNetwork);

            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getBlockByNumber
                    ]([-1])
            ).rejects.toThrowError(JSONRPCInternalError);

            // @NOTE for future PRs
            // thorClient.destroy();
        });
    });
});
