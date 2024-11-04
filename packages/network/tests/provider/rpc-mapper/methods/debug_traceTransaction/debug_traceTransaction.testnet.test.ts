import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import {
    debugTraceTransactionNegativeCasesFixtureTestnet,
    debugTraceTransactionPositiveCasesFixtureTestnet
} from './fixture';

/**
 * RPC Mapper integration tests for 'debug_traceTransaction' method
 *
 * @group integration/rpc-mapper/methods/debug_traceTransaction-testnet
 */
describe('RPC Mapper - debug_traceTransaction method tests testnet', () => {
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
     * debug_traceTransaction RPC call tests - Positive cases
     */
    describe('debug_traceTransaction - Positive cases', () => {
        /**
         * Positive cases.
         */
        test('debug_traceTransaction - positive cases', async () => {
            for (const fixture of debugTraceTransactionPositiveCasesFixtureTestnet) {
                const result = await RPCMethodsMap(thorClient)[
                    RPC_METHODS.debug_traceTransaction
                ](fixture.input.params);
                expect(result).toEqual(fixture.input.expected);
            }
        }, 30000);
    });

    /**
     * debug_traceTransaction RPC call tests - Negative cases
     */
    describe('debug_traceTransaction - Negative cases', () => {
        /**
         * Negative cases.
         */
        test('debug_traceTransaction - negative case', async () => {
            for (const fixture of debugTraceTransactionNegativeCasesFixtureTestnet) {
                await expect(async () => {
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.debug_traceTransaction
                    ](fixture.input.params);
                }).rejects.toThrowError(fixture.input.expectedError);
            }
        });
    });
});
