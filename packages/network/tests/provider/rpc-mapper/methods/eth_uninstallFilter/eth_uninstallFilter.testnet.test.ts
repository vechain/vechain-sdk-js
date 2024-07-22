import { beforeEach, describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechain/sdk-errors';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';

/**
 * RPC Mapper integration tests for 'eth_uninstallFilter' method
 *
 * @group integration/rpc-mapper/methods/eth_uninstallFilter
 */
describe('RPC Mapper - eth_uninstallFilter method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.fromUrl(TESTNET_URL);
    });

    /**
     * eth_uninstallFilter RPC call tests - Positive cases
     */
    describe('eth_uninstallFilter - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('eth_uninstallFilter - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_uninstallFilter
                    ]([-1])
            ).rejects.toThrowError(NotImplementedError);
        });
    });

    /**
     * eth_uninstallFilter RPC call tests - Negative cases
     */
    describe('eth_uninstallFilter - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('eth_uninstallFilter - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_uninstallFilter
                    ](['SOME_RANDOM_PARAM'])
            ).rejects.toThrowError(NotImplementedError);
        });
    });
});
