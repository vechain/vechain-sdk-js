import { afterEach, beforeEach, describe, test } from '@jest/globals';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';

/**
 * RPC Mapper integration tests for 'eth_unsubscribe' method
 *
 * @group integration/rpc-mapper/methods/eth_unsubscribe
 */
describe('RPC Mapper - eth_unsubscribe method tests', () => {
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
     * eth_unsubscribe RPC call tests - Positive cases
     */
    describe('eth_unsubscribe - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('eth_unsubscribe - positive case 1', async () => {});
    });

    /**
     * eth_unsubscribe RPC call tests - Negative cases
     */
    describe('eth_unsubscribe - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('eth_unsubscribe - negative case 1', async () => {});
    });
});
