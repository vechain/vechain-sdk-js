import { beforeEach, describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechain/sdk-errors';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/sdk-network';
import { testNetwork } from '../../../fixture';

/**
 * RPC Mapper integration tests for 'eth_sign' method
 *
 * @group integration/rpc-mapper/methods/eth_sign
 */
describe('RPC Mapper - eth_sign method tests', () => {
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
     * eth_sign RPC call tests - Positive cases
     */
    describe('eth_sign - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('eth_sign - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[RPC_METHODS.eth_sign]([-1])
            ).rejects.toThrowError(NotImplementedError);
        });
    });

    /**
     * eth_sign RPC call tests - Negative cases
     */
    describe('eth_sign - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('eth_sign - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[RPC_METHODS.eth_sign]([
                        'SOME_RANDOM_PARAM'
                    ])
            ).rejects.toThrowError(NotImplementedError);
        });
    });
});
