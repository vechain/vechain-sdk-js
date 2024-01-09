import { beforeEach, describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechain/vechain-sdk-errors';
import { RPC_METHODS, RPCMethodsMap } from '../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../fixture';

/**
 * RPC Mapper integration tests
 *
 * @group integration/rpc-mapper/transactions
 */
describe('RPC Mapper - Transactions tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * eth_getTransactionByHash RPC call tests
     */
    describe('eth_getTransactionByHash', () => {
        /**
         * Before each test
         */
        beforeEach(() => {
            // Init thor client
            thorClient = new ThorClient(testNetwork);
        });

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
            // Init thor client
            const thorClient = new ThorClient(testNetwork);

            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getTransactionByHash
                    ](['0x0000'])
            ).rejects.toThrowError(NotImplementedError);
        });

        /**
         * After each test
         * @NOTE for future PRs
         */
        // afterEach(() => {
        //     // Destroy thor client
        //     thorClient.destroy();
        // });
    });
});
