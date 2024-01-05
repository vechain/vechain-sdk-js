import { describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechainfoundation/vechain-sdk-errors';
import { thorClient } from '../../fixture';
import { RPC_METHODS, RPCMethodsMap } from '../../../src';

/**
 * RPC Mapper integration tests
 *
 * @group integration/rpc-mapper/transactions
 */
describe('RPC Mapper - Transactions tests', () => {
    /**
     * eth_getTransactionByHash RPC call tests
     */
    describe('eth_getTransactionByHash', () => {
        /**
         * Positive cases
         */
        test('eth_getTransactionByHash - positive cases', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getTransactionByHash
                    ]([-1])
            ).rejects.toThrowError(NotImplementedError);
        });

        /**
         * Negative cases
         */
        test('eth_getTransactionByHash - negative cases', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getTransactionByHash
                    ](['0x0000'])
            ).rejects.toThrowError(NotImplementedError);
        });
    });
});
