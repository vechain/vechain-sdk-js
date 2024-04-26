import { beforeEach, describe, expect, test } from '@jest/globals';
import { RPC_METHODS, RPCMethodsMap, ThorClient } from '../../../../../src';
import { soloUrl } from '../../../../fixture';
import { getReceiptCorrectCasesSoloNetwork } from './fixture';

/**
 * RPC Mapper integration tests for 'eth_getTransactionReceipt' method
 *
 * @group integration/rpc-mapper/methods/eth_getTransactionReceipt
 */
describe('RPC Mapper - eth_getTransactionReceipt method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.fromUrl(soloUrl);
    });

    /**
     * eth_getTransactionReceipt RPC call tests - Positive cases
     */
    describe('eth_getTransactionReceipt - Positive cases', () => {
        /**
         * Positive cases - Solo network
         */
        getReceiptCorrectCasesSoloNetwork.forEach((testCase) => {
            test(
                testCase.testCase,
                async () => {
                    const receipt = await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getTransactionReceipt
                    ]([testCase.hash]);

                    expect(receipt).toEqual(testCase.expected);
                },
                7000
            );
        });
    });
});
