import { beforeEach, describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechain/sdk-errors';
import { RPC_METHODS, RPCMethodsMap, ThorClient } from '../../../../../src';
import { testNetwork } from '../../../fixture';

/**
 * RPC Mapper integration tests for 'eth_getBlockReceipts' method
 *
 * @group integration/rpc-mapper/methods/eth_getBlockReceipts
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
        thorClient = new ThorClient(testNetwork);
    });

    /**
     * eth_getBlockReceipts RPC call tests - Positive cases
     */
    describe('eth_getBlockReceipts - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('eth_getBlockReceipts - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getBlockReceipts
                    ]([-1])
            ).rejects.toThrowError(NotImplementedError);
        });
    });

    /**
     * eth_getBlockReceipts RPC call tests - Negative cases
     */
    describe('eth_getBlockReceipts - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('eth_getBlockReceipts - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getBlockReceipts
                    ](['SOME_RANDOM_PARAM'])
            ).rejects.toThrowError(NotImplementedError);
        });
    });
});
