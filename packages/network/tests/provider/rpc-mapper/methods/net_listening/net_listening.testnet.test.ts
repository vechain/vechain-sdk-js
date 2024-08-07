import { beforeEach, describe, expect, test } from '@jest/globals';
import { FunctionNotImplemented } from '@vechain/sdk-errors';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';

/**
 * RPC Mapper integration tests for 'net_listening' method
 *
 * @group integration/rpc-mapper/methods/net_listening
 */
describe('RPC Mapper - net_listening method tests', () => {
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
     * net_listening RPC call tests - Positive cases
     */
    describe('net_listening - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('net_listening - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[RPC_METHODS.net_listening]([
                        -1
                    ])
            ).rejects.toThrowError(FunctionNotImplemented);
        });
    });

    /**
     * net_listening RPC call tests - Negative cases
     */
    describe('net_listening - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('net_listening - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[RPC_METHODS.net_listening]([
                        'SOME_RANDOM_PARAM'
                    ])
            ).rejects.toThrowError(FunctionNotImplemented);
        });
    });
});
