import { beforeEach, describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechain/sdk-errors';
import { RPC_METHODS, RPCMethodsMap, ThorClient } from '../../../../../src';
import { testnetUrl } from '../../../../fixture';

/**
 * RPC Mapper integration tests for 'eth_newPendingTransactionFilter' method
 *
 * @group integration/rpc-mapper/methods/eth_newPendingTransactionFilter
 */
describe('RPC Mapper - eth_newPendingTransactionFilter method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.fromUrl(testnetUrl);
    });

    /**
     * eth_newPendingTransactionFilter RPC call tests - Positive cases
     */
    describe('eth_newPendingTransactionFilter - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('eth_newPendingTransactionFilter - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_newPendingTransactionFilter
                    ]([-1])
            ).rejects.toThrowError(NotImplementedError);
        });
    });

    /**
     * eth_newPendingTransactionFilter RPC call tests - Negative cases
     */
    describe('eth_newPendingTransactionFilter - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('eth_newPendingTransactionFilter - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_newPendingTransactionFilter
                    ](['SOME_RANDOM_PARAM'])
            ).rejects.toThrowError(NotImplementedError);
        });
    });
});
