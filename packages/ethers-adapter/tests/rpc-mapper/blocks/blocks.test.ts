import { describe, expect, test } from '@jest/globals';
import { JSONRPCInternalError } from '@vechainfoundation/vechain-sdk-errors';
import { RPCMethodsMap } from '../../../src/utils/rpc-mapper';
import { RPC_METHODS } from '../../../src/utils/const/rpc-mapper';
import { thorClient } from '../../fixture';
import { zeroBlock } from './fixture';

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
            const rpcCallZeroBlock = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_getBlockByNumber
            ]([0]);
            expect(rpcCallZeroBlock).toStrictEqual(zeroBlock);
        });

        /**
         * Negative cases
         */
        test('eth_getBlockByNumber - negative cases', async () => {
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getBlockByNumber
                    ]([-1])
            ).rejects.toThrowError(JSONRPCInternalError);
        });
    });
});
