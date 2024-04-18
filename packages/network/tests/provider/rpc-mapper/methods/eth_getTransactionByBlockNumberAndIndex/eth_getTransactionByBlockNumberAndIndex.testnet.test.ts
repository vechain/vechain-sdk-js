import { beforeEach, describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechain/sdk-errors';
import { RPC_METHODS, RPCMethodsMap, ThorClient } from '../../../../../src';
import { testNetwork } from '../../../fixture';

/**
 * RPC Mapper integration tests for 'eth_getTransactionByBlockNumberAndIndex' method
 *
 * @group integration/rpc-mapper/methods/eth_getTransactionByBlockNumberAndIndex
 */
describe('RPC Mapper - eth_getTransactionByBlockNumberAndIndex method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = new ThorClient(testNetwork);
    });

    /**
     * eth_getTransactionByBlockNumberAndIndex RPC call tests - Positive cases
     */
    describe('eth_getTransactionByBlockNumberAndIndex - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('eth_getTransactionByBlockNumberAndIndex - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getTransactionByBlockNumberAndIndex
                    ]([-1])
            ).rejects.toThrowError(NotImplementedError);
        });
    });

    /**
     * eth_getTransactionByBlockNumberAndIndex RPC call tests - Negative cases
     */
    describe('eth_getTransactionByBlockNumberAndIndex - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('eth_getTransactionByBlockNumberAndIndex - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getTransactionByBlockNumberAndIndex
                    ](['SOME_RANDOM_PARAM'])
            ).rejects.toThrowError(NotImplementedError);
        });
    });
});
