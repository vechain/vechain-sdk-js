import { beforeEach, describe, expect, test } from '@jest/globals';
import { FunctionNotImplemented } from '@vechain/sdk-errors';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';

/**
 * RPC Mapper integration tests for 'eth_getProof' method
 *
 * @group integration/rpc-mapper/methods/eth_getProof
 */
describe('RPC Mapper - eth_getProof method tests', () => {
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
     * eth_getProof RPC call tests - Positive cases
     */
    describe('eth_getProof - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('eth_getProof - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[RPC_METHODS.eth_getProof]([
                        -1
                    ])
            ).rejects.toThrowError(FunctionNotImplemented);
        });
    });

    /**
     * eth_getProof RPC call tests - Negative cases
     */
    describe('eth_getProof - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('eth_getProof - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[RPC_METHODS.eth_getProof]([
                        'SOME_RANDOM_PARAM'
                    ])
            ).rejects.toThrowError(FunctionNotImplemented);
        });
    });
});
