import { beforeEach, describe, expect, test } from '@jest/globals';
import { RPC_METHODS, RPCMethodsMap, ThorClient } from '../../../../../src';
import { testnetUrl } from '../../../fixture';
import { getReceiptCorrectCasesTestNetwork } from './fixture';

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
        thorClient = ThorClient.fromUrl(testnetUrl);
    });

    /**
     * eth_getTransactionReceipt RPC call tests - Positive cases
     */
    describe('eth_getTransactionReceipt - Positive cases', () => {
        /**
         * Positive cases - Test network
         */
        getReceiptCorrectCasesTestNetwork.forEach((testCase) => {
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
