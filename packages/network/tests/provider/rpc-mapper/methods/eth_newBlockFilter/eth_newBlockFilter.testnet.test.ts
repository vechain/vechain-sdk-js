import { beforeEach, describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechain/sdk-errors';
import { RPC_METHODS, RPCMethodsMap, ThorClient } from '../../../../../src';
import { testnetUrl } from '../../../../fixture';

/**
 * RPC Mapper integration tests for 'eth_newBlockFilter' method
 *
 * @group integration/rpc-mapper/methods/eth_newBlockFilter
 */
describe('RPC Mapper - eth_newBlockFilter method tests', () => {
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
     * eth_newBlockFilter RPC call tests - Positive cases
     */
    describe('eth_newBlockFilter - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('eth_newBlockFilter - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_newBlockFilter
                    ]([-1])
            ).rejects.toThrowError(NotImplementedError);
        });
    });

    /**
     * eth_newBlockFilter RPC call tests - Negative cases
     */
    describe('eth_newBlockFilter - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('eth_newBlockFilter - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_newBlockFilter
                    ](['SOME_RANDOM_PARAM'])
            ).rejects.toThrowError(NotImplementedError);
        });
    });
});
