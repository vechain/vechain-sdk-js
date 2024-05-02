import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { testnetUrl } from '../../../../fixture';
import { RPC_METHODS, RPCMethodsMap, ThorClient } from '../../../../../src';
import { ProviderRpcError } from '@vechain/sdk-errors';
import { clauseBuilder, unitsUtils } from '@vechain/sdk-core';

/**
 * RPC Mapper integration tests for 'eth_estimateGas' method with Solo Network and mocked functionality
 *
 * @group integration/rpc-mapper/methods/eth_estimateGas
 */
describe('RPC Mapper - eth_estimateGas method tests', () => {
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
     * eth_call RPC call tests - Negative cases
     */
    describe('eth_call - Negative cases', () => {
        /**
         * Test case that mocks an error thrown by the estimateGas method
         */
        test('Should throw `ProviderRpcError` if an error occurs while estimating the gas', async () => {
            // Mock the estimateGas method to return null
            jest.spyOn(thorClient.gas, 'estimateGas').mockRejectedValue(
                new Error()
            );

            await expect(
                RPCMethodsMap(thorClient)[RPC_METHODS.eth_estimateGas]([
                    clauseBuilder.transferVET(
                        '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
                        unitsUtils.parseVET('1000')
                    ),
                    'latest'
                ])
            ).rejects.toThrowError(ProviderRpcError);
        });
    });
});
