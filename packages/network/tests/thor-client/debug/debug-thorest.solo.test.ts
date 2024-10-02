import { beforeEach, describe, expect, test } from '@jest/globals';
import { THOR_SOLO_URL, ThorClient, type TracerName } from '../../../src';
import {
    sendTransactionWithAccountIndex,
    traceContractCallTestnetFixture
} from './fixture-thorest';
import { transfer1VTHOClause } from '../transactions/fixture';

/**
 * Debug endpoints tests on the Solo network.
 * With the solo network we are testing all the tracers,
 * while on testnet we only test the 'call' tracer.
 *
 * @group integration/clients/thor-client/debug-solo
 */
describe('ThorClient - Debug Module - Solo', () => {
    // ThorClient instance
    let thorSoloClient: ThorClient;

    beforeEach(() => {
        thorSoloClient = ThorClient.fromUrl(THOR_SOLO_URL);
    });

    /**
     * traceTransactionClause tests
     */
    describe('traceTransactionClause', () => {
        /**
         * Test a result of a transaction clause for each kind of trace name
         */
        (
            [
                { tracerName: '', senderAccountIndex: 10 },
                { tracerName: '4byte', senderAccountIndex: 11 },
                { tracerName: 'call', senderAccountIndex: 12 },
                { tracerName: 'noop', senderAccountIndex: 13 },
                { tracerName: 'prestate', senderAccountIndex: 14 },
                { tracerName: 'unigram', senderAccountIndex: 15 },
                { tracerName: 'bigram', senderAccountIndex: 16 },
                { tracerName: 'trigram', senderAccountIndex: 17 },
                { tracerName: 'evmdis', senderAccountIndex: 18 },
                { tracerName: 'opcount', senderAccountIndex: 19 },
                { tracerName: null, senderAccountIndex: 20 }
            ] as Array<{ tracerName: TracerName; senderAccountIndex: number }>
        ).forEach((testCase) => {
            test(`traceTransactionClause - ${testCase.tracerName as string}`, async () => {
                // Send a transaction in advance in order to debug it later
                const txReceipt = await sendTransactionWithAccountIndex(
                    testCase.senderAccountIndex,
                    thorSoloClient
                );

                // Debug the transaction clause
                const result =
                    await thorSoloClient.debug.traceTransactionClause(
                        {
                            target: {
                                blockID: txReceipt?.meta.blockID as string,
                                transaction: txReceipt?.meta.txID as string,
                                clauseIndex: 0
                            },
                            config: {}
                        },
                        testCase.tracerName
                    );
                expect(result).toBeDefined();
            }, 10000);
        });
    });

    /**
     * traceContractCall tests
     */
    describe('traceContractCall', () => {
        /**
         * Test a result of a contract call for each kind of trace name
         */
        (
            [
                { tracerName: '', senderAccountIndex: 10 },
                { tracerName: '4byte', senderAccountIndex: 11 },
                { tracerName: 'call', senderAccountIndex: 12 },
                { tracerName: 'noop', senderAccountIndex: 13 },
                { tracerName: 'prestate', senderAccountIndex: 14 },
                { tracerName: 'unigram', senderAccountIndex: 15 },
                { tracerName: 'bigram', senderAccountIndex: 16 },
                { tracerName: 'trigram', senderAccountIndex: 17 },
                { tracerName: 'evmdis', senderAccountIndex: 18 },
                { tracerName: 'opcount', senderAccountIndex: 19 }
            ] as Array<{ tracerName: TracerName; senderAccountIndex: number }>
        ).forEach((testCase) => {
            test(`traceContractCall - ${testCase.tracerName as string}`, async () => {
                // Send a transaction in advance in order to debug it later
                const txReceipt = await sendTransactionWithAccountIndex(
                    testCase.senderAccountIndex,
                    thorSoloClient
                );

                // Debug the contract call
                const result = await thorSoloClient.debug.traceContractCall(
                    {
                        contractInput: {
                            to: traceContractCallTestnetFixture.positiveCases[0]
                                .to,
                            data: transfer1VTHOClause.data
                        },
                        transactionOptions: {
                            caller: txReceipt?.gasPayer as string,
                            gasPayer: txReceipt?.gasPayer as string
                        },
                        config: {}
                    },
                    testCase.tracerName
                );
                expect(result).toBeDefined();
            });
        });
    });
});
