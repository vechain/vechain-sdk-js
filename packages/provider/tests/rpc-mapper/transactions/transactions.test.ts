import { describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechainfoundation/vechain-sdk-errors';
import { RPC_METHODS, RPCMethodsMap } from '../../../src';
import { ThorClient } from '@vechainfoundation/vechain-sdk-network';
import { testNetwork } from '../../fixture';

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
            // Init thor client
            const thorClient = new ThorClient(testNetwork);

            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getTransactionByHash
                    ]([-1])
            ).rejects.toThrowError(NotImplementedError);

            // @NOTE for future PRs
            // thorClient.destroy();
        });

        /**
         * Negative cases
         */
        test('eth_getTransactionByHash - negative cases', async () => {
            // Init thor client
            const thorClient = new ThorClient(testNetwork);

            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getTransactionByHash
                    ](['0x0000'])
            ).rejects.toThrowError(NotImplementedError);

            // @NOTE for future PRs
            // thorClient.destroy();
        });
    });
});
