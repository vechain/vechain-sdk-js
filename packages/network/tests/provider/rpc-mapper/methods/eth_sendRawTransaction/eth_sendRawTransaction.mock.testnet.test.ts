import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import { JSONRPCInternalError } from '@vechain/sdk-errors';

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
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.at(TESTNET_URL);
    });

    /**
     * eth_sendRawTransaction RPC call tests - Negative cases
     */
    describe('eth_sendRawTransaction - Negative cases', () => {
        /**
         *  Test case where request fails
         */
        test('Should throw `JSONRPCInternalError` when request fails', async () => {
            // Mock the getBlock method to throw error
            jest.spyOn(
                thorClient.transactions,
                'sendRawTransaction'
            ).mockRejectedValue(new Error());

            await expect(async () => {
                (await RPCMethodsMap(thorClient)[
                    RPC_METHODS.eth_sendRawTransaction
                ](['0x123456789'])) as string;
            }).rejects.toThrowError(JSONRPCInternalError);
        });
    });
});
