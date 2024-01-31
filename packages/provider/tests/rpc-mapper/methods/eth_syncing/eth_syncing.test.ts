import { beforeEach, describe, expect, test } from '@jest/globals';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';

/**
 * RPC Mapper integration tests for 'eth_syncing' method
 *
 * @group integration/rpc-mapper/methods/eth_syncing
 */
describe('RPC Mapper - eth_syncing method tests', () => {
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
     * eth_syncing RPC call tests - Positive cases
     */
    describe('eth_syncing - Positive cases', () => {
        /**
         * Positive case 1 - Check status
         */
        test('eth_syncing - positive case 1', async () => {
            const status = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_syncing
            ]([]);
            expect(status).toBe(false);
        });
    });
});
