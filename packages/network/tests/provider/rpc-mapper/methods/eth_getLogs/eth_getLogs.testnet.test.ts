import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    type LogsRPC,
    RPC_METHODS,
    RPCMethodsMap,
    ThorClient,
    VeChainProvider
} from '../../../../../src';
import { testnetUrl } from '../../../../fixture';
import { logsFixture } from './fixture';
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
        thorClient = ThorClient.fromUrl(testnetUrl);
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
            ).rejects.toThrowError(InvalidDataTypeError);
        });
    });

    test('eth_getLogs - array of an array of topics', async () => {
        const provider = new VeChainProvider(thorClient);

        const multiTopics = await provider.request({
            method: 'eth_getLogs',
            params: [
                {
                    address: '0x6e04f400810be5c570c08ea2def43c4d44481063',
                    fromBlock: '0x10c8e00',
                    toBlock: '0x10c8e00',
                    topics: [
                        '0xb3d987963d01b2f68493b4bdb130988f157ea43070d4ad840fee0466ed9370d9',
                        [
                            '0xb3d987963d01b2f68493b4bdb130988f157ea43070d4ad840fee0466ed9370d9',
                            '0x9b87a00e30f1ac65d898f070f8a3488fe60517182d0a2098e1b4b93a54aa9bd6',
                            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
                        ]
                    ]
                }
            ]
        });

        console.log('Multi Matches', multiTopics);
    }, 15000);
});
