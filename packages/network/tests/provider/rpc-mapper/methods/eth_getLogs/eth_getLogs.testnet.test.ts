import { Hex } from '@vechain/sdk-core';
import { JSONRPCInvalidParams } from '@vechain/sdk-errors';
import { beforeEach, describe, expect, test } from '@jest/globals';
import { logsFixture } from './fixture';
import {
    type EventLogs,
    type LogsRPC,
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient,
    VeChainProvider
} from '../../../../../src';

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
        thorClient = ThorClient.at(TESTNET_URL);
    });

    /**
     * eth_getLogs RPC call tests - Positive cases
     */
    describe('eth_getLogs - Positive cases', () => {
        /**
         * Positive cases. Should be able to get logs
         */
        logsFixture.forEach((fixture, index) => {
            test(`eth_getLogs - Should be able to get logs test - ${index + 1}`, async () => {
                // Call RPC method
                const logs = (await RPCMethodsMap(thorClient)[
                    RPC_METHODS.eth_getLogs
                ]([fixture.input])) as LogsRPC[];

                expect(logs.slice(0, 4)).toStrictEqual(fixture.expected);
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
            ).rejects.toThrowError(JSONRPCInvalidParams);
        });
    });

    test('eth_getLogs - array of an array of topics as input', async () => {
        const provider = new VeChainProvider(thorClient);

        const multiTopicsResponse: EventLogs[] = (await provider.request({
            method: 'eth_getLogs',
            params: [
                {
                    address: [
                        '0x90c1a329e11ce6429eef0ab9b8f7daab68694e7d',
                        '0x3d7616213191a10460e49cfdb7edbf88d6a10942'
                    ],
                    fromBlock: Hex.of(0).toString(),
                    toBlock: Hex.of(19000000n), // Same integer has different hex representations for bigint and number IEEE 754.
                    topics: [
                        '0xd6dd0ade89eeb414b7e63b3b71fde3db88b04f032c3d5bce15271008598f64f9',
                        [
                            '0xd6dd0ade89eeb414b7e63b3b71fde3db88b04f032c3d5bce15271008598f64f9',
                            '0x808dd6e6b8eac0877deeb0f618c8e6776fa59d4ce0ede71e3c4a41bf91e9e462'
                        ]
                    ]
                }
            ]
        })) as EventLogs[];

        expect(multiTopicsResponse).toBeDefined();
        expect(multiTopicsResponse.length).toBeGreaterThan(0);
    }, 15000);
});
