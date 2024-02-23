import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { soloNetwork } from '../../../fixture';
import { type LogsRPC } from '../../../../src/utils/formatter/logs';
import { ProviderRpcError } from '@vechain/vechain-sdk-errors';
import { logsFixture } from './fixture';

/**
 * RPC Mapper integration tests for 'eth_getLogs' method
 *
 * @group integration/rpc-mapper/methods/eth_getLogs
 */
describe('RPC Mapper - eth_getLogs method tests', () => {
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
     * eth_getLogs RPC call tests - Negative cases
     */
    describe('eth_getLogs - Negative cases', () => {
        /**
         * Negative case 2 - Should throw an error for invalid input if request is invalid
         */
        test('eth_getLogs - Should throw error if request is invalid', async () => {
            // Mock the getGenesisBlock method to return null
            jest.spyOn(thorClient.logs, 'filterEventLogs').mockRejectedValue(
                new Error()
            );

            await expect(
                async () =>
                    // Call RPC method
                    (await RPCMethodsMap(thorClient)[RPC_METHODS.eth_getLogs]([
                        logsFixture[0].input
                    ])) as LogsRPC[]
            ).rejects.toThrowError(ProviderRpcError);
        });
    });
});
