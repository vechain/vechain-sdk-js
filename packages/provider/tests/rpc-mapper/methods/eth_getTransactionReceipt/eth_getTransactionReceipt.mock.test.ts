import {
    afterEach,
    beforeEach,
    describe,
    expect,
    jest,
    test
} from '@jest/globals';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';
import { getReceiptCorrectCasesTestNetwork } from './fixture';
import { ProviderRpcError } from '@vechain/vechain-sdk-errors';

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
            ).rejects.toThrowError(ProviderRpcError);
        });
    });
});
