import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import { getReceiptCorrectCasesTestNetwork } from './fixture';
import { JSONRPCInternalError } from '@vechain/sdk-errors';

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
     * eth_getTransactionReceipt RPC call tests - Negative cases
     */
    describe('eth_getTransactionReceipt - Negative cases', () => {
        /**
         * Negative case 1 - An error occurs while retrieving the transaction receipt
         */
        test('eth_getTransactionReceipt - negative case 1', async () => {
            // Mock the getTransactionReceipt method to throw an error
            jest.spyOn(
                thorClient.transactions,
                'getTransactionReceipt'
            ).mockRejectedValue(new Error());

            // Call eth_getTransactionReceipt with a valid transaction hash BUT an error occurs while retrieving the transaction receipt
            await expect(
                RPCMethodsMap(thorClient)[
                    RPC_METHODS.eth_getTransactionReceipt
                ]([getReceiptCorrectCasesTestNetwork[0].hash])
            ).rejects.toThrowError(JSONRPCInternalError);
        });

        /**
         * Negative case 2 - Transaction details of existing transaction are not found (returns null)
         */
        test('eth_getTransactionReceipt - negative case 2', async () => {
            // Mock the getTransactionReceipt method to throw an error
            jest.spyOn(
                thorClient.transactions,
                'getTransaction'
            ).mockResolvedValue(null);

            // Call eth_getTransactionReceipt with a valid transaction hash BUT an error occurs while retrieving the transaction receipt
            const receipt = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_getTransactionReceipt
            ]([getReceiptCorrectCasesTestNetwork[0].hash]);
            expect(receipt).toBe(null);
        });
    });
});
