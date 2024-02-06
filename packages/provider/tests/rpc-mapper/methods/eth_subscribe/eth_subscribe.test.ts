import { afterEach, beforeEach, describe, test } from '@jest/globals';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';

/**
 * RPC Mapper integration tests for 'eth_subscribe' method
 *
 * @group integration/rpc-mapper/methods/eth_subscribe
 */
describe('RPC Mapper - eth_subscribe method tests', () => {
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
     * Destroy thor client after each test
     */
    afterEach(() => {
        thorClient.destroy();
    });

    /**
     * eth_subscribe RPC call tests - Positive cases
     */
    describe('eth_subscribe - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('eth_subscribe - positive case 1', async () => {});
    });

    /**
     * eth_subscribe RPC call tests - Negative cases
     */
    describe('eth_subscribe - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('eth_subscribe - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
        });
    });
});
