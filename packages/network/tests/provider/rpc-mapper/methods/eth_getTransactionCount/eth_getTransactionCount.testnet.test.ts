import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import { invalidEthGetTransactionCountTestCases } from './fixture';

/**
 * RPC Mapper integration tests for 'eth_getTransactionCount' method
 *
 * @group integration/rpc-mapper/methods/eth_getTransactionCount
 */
describe('RPC Mapper - eth_getTransactionCount method tests', () => {
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
     * eth_getTransactionCount RPC call tests - Positive cases
     */
    describe('eth_getTransactionCount - Positive cases', () => {
        /**
         * Positive case 1 - Get a random nonce (@note different from Ethereum)
         */
        test('eth_getTransactionCount - get a random nonce', async () => {
            // Random nonce
            const transactionCount = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_getTransactionCount
            ](['0x0b41c56e19c5151122568873a039fEa090937Fe2', 'latest']);
            expect(transactionCount).toBeDefined();
        });
    });

    /**
     * eth_getTransactionCount RPC call tests - Negative cases
     */
    describe('eth_getTransactionCount - Negative cases', () => {
        /**
         * Invalid params case 1 - Missing params
         */
        invalidEthGetTransactionCountTestCases.forEach(
            ({ description, params, expectedError }) => {
                test(description, async () => {
                    await expect(
                        RPCMethodsMap(thorClient)[
                            RPC_METHODS.eth_getTransactionCount
                        ](params)
                    ).rejects.toThrowError(expectedError);
                });
            }
        );
    });
});
