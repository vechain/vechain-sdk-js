import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import { negativeCasesFixtures, positiveCasesFixtures } from './fixture';

/**
 * RPC Mapper integration tests for 'eth_call' method
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
        thorClient = ThorClient.at(TESTNET_URL);
    });

    /**
     * eth_call RPC call tests - Positive cases
     */
    describe('eth_call - Positive cases', () => {
        /**
         * Positive cases
         */
        positiveCasesFixtures.forEach((fixture) => {
            test(fixture.description, async () => {
                const response = await RPCMethodsMap(thorClient)[
                    RPC_METHODS.eth_call
                ](fixture.input);
                expect(response).toBe(fixture.expected);
            });
        });
    });

    /**
     * eth_call RPC call tests - Negative cases
     */
    describe('eth_call - Negative cases', () => {
        /**
         * Negative cases
         */
        negativeCasesFixtures.forEach((fixture) => {
            test(fixture.description, async () => {
                await expect(
                    RPCMethodsMap(thorClient)[RPC_METHODS.eth_call](
                        fixture.input
                    )
                ).rejects.toThrowError(fixture.expected);
            });
        });
    });
});
