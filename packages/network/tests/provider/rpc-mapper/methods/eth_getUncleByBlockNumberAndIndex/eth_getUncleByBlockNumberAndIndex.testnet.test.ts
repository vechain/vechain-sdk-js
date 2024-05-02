import { beforeEach, describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechain/sdk-errors';
import { RPC_METHODS, RPCMethodsMap, ThorClient } from '../../../../../src';
import { testnetUrl } from '../../../../fixture';

/**
 * RPC Mapper integration tests for 'eth_getUncleByBlockNumberAndIndex' method
 *
 * @group integration/rpc-mapper/methods/eth_getUncleByBlockNumberAndIndex
 */
describe('RPC Mapper - eth_getUncleByBlockNumberAndIndex method tests', () => {
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
     * eth_getUncleByBlockNumberAndIndex RPC call tests - Positive cases
     */
    describe('eth_getUncleByBlockNumberAndIndex - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('eth_getUncleByBlockNumberAndIndex - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getUncleByBlockNumberAndIndex
                    ]([-1])
            ).rejects.toThrowError(NotImplementedError);
        });
    });

    /**
     * eth_getUncleByBlockNumberAndIndex RPC call tests - Negative cases
     */
    describe('eth_getUncleByBlockNumberAndIndex - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('eth_getUncleByBlockNumberAndIndex - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getUncleByBlockNumberAndIndex
                    ](['SOME_RANDOM_PARAM'])
            ).rejects.toThrowError(NotImplementedError);
        });
    });
});
