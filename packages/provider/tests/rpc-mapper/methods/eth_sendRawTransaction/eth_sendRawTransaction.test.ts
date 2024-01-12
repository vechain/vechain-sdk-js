import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechain/vechain-sdk-errors';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';

/**
 * RPC Mapper integration tests for 'eth_sendRawTransaction' method
 *
 * @group integration/rpc-mapper/methods/eth_sendRawTransaction
 */
describe('RPC Mapper - eth_sendRawTransaction method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Inti thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = new ThorClient(testNetwork);
    });

    /**
     * Destory thor client after each test
     */
    afterEach(() => {
        thorClient.destroy();
    });

    /**
     * eth_sendRawTransaction RPC call tests - Positive cases
     */
    describe('eth_sendRawTransaction - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('eth_sendRawTransaction - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_sendRawTransaction
                    ]([-1])
            ).rejects.toThrowError(NotImplementedError);
        });
    });

    /**
     * eth_sendRawTransaction RPC call tests - Negative cases
     */
    describe('eth_sendRawTransaction - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('eth_sendRawTransaction - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_sendRawTransaction
                    ](['SOME_RANDOM_PARAM'])
            ).rejects.toThrowError(NotImplementedError);
        });
    });
});
