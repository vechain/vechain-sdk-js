import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { ProviderRpcError } from '@vechain/sdk-errors';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/sdk-network';
import { soloNetwork } from '../../../fixture';

/**
 * RPC Mapper integration tests for 'eth_call' method with Solo Network and mocked functionality
 *
 * @group integration/rpc-mapper/methods/eth_call
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
        thorClient = new ThorClient(soloNetwork);
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
                        to: '0x3db469a79593dcc67f07de1869d6682fc1eaf535',
                        value: '1000000000000000000',
                        data: '0x'
                    },
                    'latest'
                ])
            ).rejects.toThrowError(ProviderRpcError);
        });
    });
});
