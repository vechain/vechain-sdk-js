import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import {
    getReceiptCorrectCasesTestNetwork,
    getReceiptIncorrectCasesTestNetwork
} from './fixture';

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
        thorClient = ThorClient.at(TESTNET_URL);
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

    /**
     * eth_getTransactionReceipt RPC call tests - Negative cases
     */
    describe('eth_getTransactionReceipt - Negative cases', () => {
        /**
         * Negative cases - Test network
         */
        getReceiptIncorrectCasesTestNetwork.forEach((fixture) => {
            test(
                fixture.testCase,
                async () => {
                    await expect(
                        async () =>
                            await RPCMethodsMap(thorClient)[
                                RPC_METHODS.eth_getTransactionReceipt
                            ](fixture.params)
                    ).rejects.toThrowError(fixture.expectedError);
                },
                7000
            );
        });
    });
});
