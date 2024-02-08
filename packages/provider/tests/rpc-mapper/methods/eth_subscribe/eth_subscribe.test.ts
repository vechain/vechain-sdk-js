import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';
import { VechainProvider } from '../../../../src';

/**
 * RPC Mapper integration tests for 'eth_subscribe' method
 *
 * @group integration/rpc-mapper/methods/eth_subscribe
 */
describe('RPC Mapper - eth_subscribe method tests', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient: ThorClient;
    let provider: VechainProvider;

    /**
     * Inti thor client and provider before each test
     */
    beforeEach(() => {
        thorClient = new ThorClient(testNetwork);
        provider = new VechainProvider(thorClient);
    });

    /**
     * Destroy thor client and provider after each test
     */
    afterEach(() => {
        provider.destroy();
    });

    /**
     * eth_subscribe RPC call tests - Positive cases
     */
    describe('eth_subscribe - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('eth_subscribe - positive case 1', async () => {
            // Call RPC function
            const rpcCall = (await provider.request({
                method: 'eth_subscribe',
                params: ['newHeads']
            })) as string;

            expect(rpcCall.length).toEqual(32);
        });
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
