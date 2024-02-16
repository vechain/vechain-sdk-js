import { beforeEach, describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechain/vechain-sdk-errors';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';

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
        thorClient = new ThorClient(testNetwork);
    });

    /**
     * net_peerCount RPC call tests - Positive cases
     */
    describe('net_peerCount - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('net_peerCount - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[RPC_METHODS.net_peerCount]([
                        -1
                    ])
            ).rejects.toThrowError(NotImplementedError);
        });
    });

    /**
     * net_peerCount RPC call tests - Negative cases
     */
    describe('net_peerCount - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('net_peerCount - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[RPC_METHODS.net_peerCount]([
                        'SOME_RANDOM_PARAM'
                    ])
            ).rejects.toThrowError(NotImplementedError);
        });
    });
});
