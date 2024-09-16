import { beforeEach, describe, expect, test } from '@jest/globals';
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
         * Should be able to gety if the node is listening
         */
        test('Should be able to get if the node is listening', async () => {
            const peers = await RPCMethodsMap(thorClient)[
                RPC_METHODS.net_listening
            ]([]);
            expect(peers).toBeDefined();
        });
    });
});
