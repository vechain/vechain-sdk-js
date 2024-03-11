import { beforeEach, describe, expect, test } from '@jest/globals';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/sdk-network';
import { testNetwork } from '../../../fixture';
import {
    debugTraceTransactionNegativeCasesFixtureTestnet,
    debugTraceTransactionPositiveCasesFixtureTestnet
} from './fixture';

/**
 * RPC Mapper integration tests for 'debug_traceTransaction' method
 *
 * @group integration/rpc-mapper/methods/debug_traceTransaction
 */
describe('RPC Mapper - debug_traceTransaction method tests', () => {
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
        }, 15000);
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
