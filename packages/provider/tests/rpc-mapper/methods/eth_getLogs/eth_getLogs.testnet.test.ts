import { beforeEach, describe, expect, test } from '@jest/globals';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/sdk-network';
import { testNetwork } from '../../../fixture';
import { logsFixture } from './fixture';
import { type LogsRPC } from '../../../../src/utils/formatter/logs';
import { InvalidDataTypeError } from '@vechain/sdk-errors';

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
        thorClient = new ThorClient(testNetwork);
    });

    /**
     * eth_getLogs RPC call tests - Positive cases
     */
    describe('eth_getLogs - Positive cases', () => {
        /**
         * Positive cases. Should be able to get logs
         */
        logsFixture.forEach((fixture, index) => {
            test(`eth_getLogs - Should be able to get logs - ${index} with input: ${JSON.stringify(fixture.input)}`, async () => {
                // Call RPC method
                const logs = (await RPCMethodsMap(thorClient)[
                    RPC_METHODS.eth_getLogs
                ]([fixture.input])) as LogsRPC[];

                expect(logs.slice(0, 4)).toStrictEqual(fixture.expectedSliced);
            }, 6000);
        });
    });

    /**
     * eth_getLogs RPC call tests - Negative cases
     */
    describe('eth_getLogs - Negative cases', () => {
        /**
         * Negative case 1 - Should throw an error for invalid input
         */
        test('eth_getLogs - Invalid input', async () => {
            await expect(
                async () =>
                    // Call RPC method
                    (await RPCMethodsMap(thorClient)[RPC_METHODS.eth_getLogs]([
                        'INVALID_INPUT'
                    ])) as LogsRPC[]
            ).rejects.toThrowError(InvalidDataTypeError);
        });
    });
});
