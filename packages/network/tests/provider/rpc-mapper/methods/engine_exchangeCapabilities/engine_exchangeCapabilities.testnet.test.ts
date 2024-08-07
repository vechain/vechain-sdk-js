import { beforeEach, describe, expect, test } from '@jest/globals';
import { FunctionNotImplemented } from '@vechain/sdk-errors';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';

/**
 * RPC Mapper integration tests for 'engine_exchangeCapabilities' method
 *
 * @group integration/rpc-mapper/methods/engine_exchangeCapabilities
 */
describe('RPC Mapper - engine_exchangeCapabilities method tests', () => {
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
     * engine_exchangeCapabilities RPC call tests - Positive cases
     */
    describe('engine_exchangeCapabilities - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('engine_exchangeCapabilities - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.engine_exchangeCapabilities
                    ]([-1])
            ).rejects.toThrowError(FunctionNotImplemented);
        });
    });

    /**
     * engine_exchangeCapabilities RPC call tests - Negative cases
     */
    describe('engine_exchangeCapabilities - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('engine_exchangeCapabilities - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.engine_exchangeCapabilities
                    ](['SOME_RANDOM_PARAM'])
            ).rejects.toThrowError(FunctionNotImplemented);
        });
    });
});
