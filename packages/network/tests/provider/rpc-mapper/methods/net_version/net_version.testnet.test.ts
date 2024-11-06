import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';

/**
 * RPC Mapper integration tests for 'eth_chainId' method
 *
 * @group integration/rpc-mapper/methods/net_version
 */
describe('RPC Mapper - net_version method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.at(TESTNET_URL);
    });

    /**
     * net_version RPC call tests - Positive cases
     */
    describe('net_version - Positive cases', () => {
        /**
         * Test case regarding obtaining the net_version
         */
        test('Should return the net_version (the chain id in our case)', async () => {
            // net_version and eth_chainId should return the same value
            const rpcCallNetVersion = (await RPCMethodsMap(thorClient)[
                RPC_METHODS.net_version
            ]([])) as string;

            const rpcCallChainId = (await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_chainId
            ]([])) as string;

            expect(rpcCallNetVersion).toBe(rpcCallChainId);
        });
    });
});
