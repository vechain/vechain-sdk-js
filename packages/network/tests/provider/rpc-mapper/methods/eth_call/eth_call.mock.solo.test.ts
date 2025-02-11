import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { JSONRPCInternalError } from '@vechain/sdk-errors';
import {
    RPC_METHODS,
    RPCMethodsMap,
    THOR_SOLO_URL,
    ThorClient
} from '../../../../../src';

/**
 * RPC Mapper integration tests for 'eth_call' method with Solo Network and mocked functionality
 *
 * @group unit/rpc-mapper/methods/eth_call
 */
describe('RPC Mapper - eth_call method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.at(THOR_SOLO_URL);
    });

    /**
     * eth_call RPC call tests - Negative cases
     */
    describe('eth_call - Negative cases', () => {
        /**
         * Test case that mocks an error thrown by the simulateTransaction method
         */
        test('Should throw `ProviderRpcError` if an error occurs while simulating the transaction', async () => {
            // Mock the getGenesisBlock method to return null
            jest.spyOn(
                thorClient.transactions,
                'simulateTransaction'
            ).mockRejectedValue(new Error());

            await expect(
                RPCMethodsMap(thorClient)[RPC_METHODS.eth_call]([
                    {
                        from: '0x7487d912d03ab9de786278f679592b3730bdd540',
                        to: '0x3db469a79593dcc67f07DE1869d6682fC1eaf535',
                        value: '1000000000000000000',
                        data: '0x'
                    },
                    'latest'
                ])
            ).rejects.toThrowError(JSONRPCInternalError);
        });
        /**
         * Test an invalid default block tag name
         */
        test('Should throw `JSONRPCInvalidParams` if the default block parameter is invalid block tag', async () => {
            await expect(
                RPCMethodsMap(thorClient)[RPC_METHODS.eth_call]([
                    {
                        from: '0x7487d912d03ab9de786278f679592b3730bdd540',
                        to: '0x3db469a79593dcc67f07DE1869d6682fC1eaf535',
                        value: '1000000000000000000',
                        data: '0x'
                    },
                    'invalid'
                ])
            ).rejects.toThrowError(JSONRPCInternalError);
        });
        /**
         * Test an invalid hexadecimal block number
         */
        test('Should throw `JSONRPCInvalidParams` if the default block parameter is invalid block number hex', async () => {
            await expect(
                RPCMethodsMap(thorClient)[RPC_METHODS.eth_call]([
                    {
                        from: '0x7487d912d03ab9de786278f679592b3730bdd540',
                        to: '0x3db469a79593dcc67f07DE1869d6682fC1eaf535',
                        value: '1000000000000000000',
                        data: '0x'
                    },
                    '0xinvalid'
                ])
            ).rejects.toThrowError(JSONRPCInternalError);
        });
    });
});
