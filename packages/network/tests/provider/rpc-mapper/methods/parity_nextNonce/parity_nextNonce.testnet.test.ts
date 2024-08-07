import { beforeEach, describe, expect, test } from '@jest/globals';
import { FunctionNotImplemented } from '@vechain/sdk-errors';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';

/**
 * RPC Mapper integration tests for 'parity_nextNonce' method
 *
 * @group integration/rpc-mapper/methods/parity_nextNonce
 */
describe('RPC Mapper - parity_nextNonce method tests', () => {
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
     * parity_nextNonce RPC call tests - Positive cases
     */
    describe('parity_nextNonce - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('parity_nextNonce - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.parity_nextNonce
                    ]([-1])
            ).rejects.toThrowError(FunctionNotImplemented);
        });
    });

    /**
     * parity_nextNonce RPC call tests - Negative cases
     */
    describe('parity_nextNonce - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('parity_nextNonce - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.parity_nextNonce
                    ](['SOME_RANDOM_PARAM'])
            ).rejects.toThrowError(FunctionNotImplemented);
        });
    });
});
