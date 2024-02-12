import { beforeEach, describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechain/vechain-sdk-errors';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';

/**
 * RPC Mapper integration tests for 'eth_feeHistory' method
 *
 * @group integration/rpc-mapper/methods/eth_feeHistory
 */
describe('RPC Mapper - eth_feeHistory method tests', () => {
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
     * eth_feeHistory RPC call tests - Positive cases
     */
    describe('eth_feeHistory - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('eth_feeHistory - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[RPC_METHODS.eth_feeHistory](
                        [-1]
                    )
            ).rejects.toThrowError(NotImplementedError);
        });
    });

    /**
     * eth_feeHistory RPC call tests - Negative cases
     */
    describe('eth_feeHistory - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('eth_feeHistory - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[RPC_METHODS.eth_feeHistory](
                        ['SOME_RANDOM_PARAM']
                    )
            ).rejects.toThrowError(NotImplementedError);
        });
    });
});
