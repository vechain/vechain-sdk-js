import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';

/**
 * RPC Mapper integration tests for 'net_peerCount' method
 *
 * @group integration/rpc-mapper/methods/net_peerCount
 */
describe('RPC Mapper - net_peerCount method tests', () => {
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
     * net_peerCount RPC call tests - Positive cases
     */
    describe('net_peerCount - Positive cases', () => {
        /**
         * Should be able to get the peer count
         */
        test('Should be able to get the peer count', async () => {
            const peers = await RPCMethodsMap(thorClient)[
                RPC_METHODS.net_peerCount
            ]([]);
            expect(peers).toBeGreaterThanOrEqual(0);
        });
    });
});
