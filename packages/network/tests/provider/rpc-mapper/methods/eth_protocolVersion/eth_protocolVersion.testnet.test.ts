import { beforeEach, describe, expect, test } from '@jest/globals';
import { FunctionNotImplemented } from '@vechain/sdk-errors';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';

/**
 * RPC Mapper integration tests for 'eth_protocolVersion' method
 *
 * @group integration/rpc-mapper/methods/eth_protocolVersion
 */
describe('RPC Mapper - eth_protocolVersion method tests', () => {
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
     * eth_protocolVersion RPC call tests - Positive cases
     */
    describe('eth_protocolVersion - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('eth_protocolVersion - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_protocolVersion
                    ]([-1])
            ).rejects.toThrowError(FunctionNotImplemented);
        });
    });

    /**
     * eth_protocolVersion RPC call tests - Negative cases
     */
    describe('eth_protocolVersion - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('eth_protocolVersion - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_protocolVersion
                    ](['SOME_RANDOM_PARAM'])
            ).rejects.toThrowError(FunctionNotImplemented);
        });
    });
});
