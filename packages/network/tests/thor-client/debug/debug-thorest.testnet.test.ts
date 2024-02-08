import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { testNetwork } from '../../fixture';
import { ThorClient } from '../../../src';
import { type TracerName } from '../../../src/thor-client/debug';
import {
    firstTransactionTraceContractCallTestnetFixture,
    firstTransactionTraceTransactionClauseTestnetFixture,
    traceContractCallTestnet,
    traceTransactionClauseTestnet
} from './fixture-thorest';

/**
 * ThorClient class tests
 *
 * @NOTE: This test suite run on testnet network because it contains read-only tests.
 *
 * @group integration/clients/thor-client/debug
 */
describe('ThorClient - Debug Module', () => {
    // ThorClient instance
    let thorClient: ThorClient;

    beforeEach(() => {
        thorClient = new ThorClient(testNetwork);
    });

    afterEach(() => {
        thorClient.destroy();
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
                '',
                '4byte',
                'call',
                'noop',
                'prestate',
                'unigram',
                'bigram',
                'trigram',
                'evmdis',
                'opcount',
                null
            ] as TracerName[]
        ).forEach((traceName: TracerName) => {
            test(`traceTransactionClause - ${traceName}`, async () => {
                const result = await thorClient.debug.traceTransactionClause(
                    {
                        target: {
                            blockID:
                                firstTransactionTraceTransactionClauseTestnetFixture.blockID,
                            transaction:
                                firstTransactionTraceTransactionClauseTestnetFixture.transaction,
                            clauseIndex:
                                firstTransactionTraceTransactionClauseTestnetFixture.clauseIndex
                        },
                        config: {}
                    },
                    traceName
                );
                expect(result).toBeDefined();
            });
        });

        /**
         * traceTransactionClause - correct cases
         */
        traceTransactionClauseTestnet.positiveCases.forEach(
            (positiveTestCase) => {
                test(positiveTestCase.testName, async () => {
                    const result =
                        await thorClient.debug.traceTransactionClause(
                            {
                                target: {
                                    blockID: positiveTestCase.blockID,
                                    transaction: positiveTestCase.transaction,
                                    clauseIndex: positiveTestCase.clauseIndex
                                },
                                config: {}
                            },
                            positiveTestCase.name as TracerName | undefined
                        );
                    expect(result).toEqual(positiveTestCase.expected);
                });
            }
        );

        /**
         * traceTransactionClause - negative cases
         */
        traceTransactionClauseTestnet.negativeCases.forEach(
            (negativeTestCase) => {
                test(negativeTestCase.testName, async () => {
                    await expect(
                        thorClient.debug.traceTransactionClause(
                            {
                                target: {
                                    blockID: negativeTestCase.blockID,
                                    transaction: negativeTestCase.transaction,
                                    clauseIndex: negativeTestCase.clauseIndex
                                },
                                config: {}
                            },
                            negativeTestCase.name as TracerName | undefined
                        )
                    ).rejects.toThrow(negativeTestCase.expectedError);
                });
            }
        );
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
                '',
                '4byte',
                'call',
                'noop',
                'prestate',
                'unigram',
                'bigram',
                'trigram',
                'evmdis',
                'opcount',
                null
            ] as TracerName[]
        ).forEach((traceName: TracerName) => {
            test(`traceContractCall - ${traceName}`, async () => {
                const result = await thorClient.debug.traceContractCall(
                    // Transaction 0x7bf1cbf0485e265075a771ac4b0875b09019163f93d8e281adb893875c36453f
                    {
                        contractInput: {
                            to: firstTransactionTraceContractCallTestnetFixture.to,
                            data: firstTransactionTraceContractCallTestnetFixture.data
                        },
                        transactionOptions: {
                            caller: firstTransactionTraceContractCallTestnetFixture.caller,
                            gasPayer:
                                firstTransactionTraceContractCallTestnetFixture.gasPayer,
                            expiration:
                                firstTransactionTraceContractCallTestnetFixture.expiration,
                            blockRef:
                                firstTransactionTraceContractCallTestnetFixture.blockRef
                        },
                        config: {}
                    },
                    'call'
                );
                expect(result).toBeDefined();
            });
        });

        /**
         * traceContractCall - correct cases
         */
        traceContractCallTestnet.positiveCases.forEach((positiveTestCase) => {
            test(positiveTestCase.testName, async () => {
                const result = await thorClient.debug.traceContractCall(
                    {
                        contractInput: {
                            to: positiveTestCase.to,
                            data: positiveTestCase.data,
                            value: positiveTestCase.value
                        },
                        transactionOptions: {
                            caller: positiveTestCase.caller,
                            gasPayer: positiveTestCase.gasPayer,
                            expiration: positiveTestCase.expiration,
                            blockRef: positiveTestCase.blockRef,
                            gas: positiveTestCase.gas
                        },
                        config: {}
                    },
                    positiveTestCase.name as TracerName | undefined
                );
                expect(result).toEqual(positiveTestCase.expected);
            });
        });

        /**
         * traceContractCall - negative cases
         */
        traceContractCallTestnet.negativeCases.forEach((negativeTestCase) => {
            test(negativeTestCase.testName, async () => {
                await expect(
                    thorClient.debug.traceContractCall({
                        contractInput: {
                            to: negativeTestCase.to,
                            data: negativeTestCase.data,
                            value: negativeTestCase.value
                        },
                        transactionOptions: {},
                        config: {}
                    })
                ).rejects.toThrow(negativeTestCase.expectedError);
            });
        });
    });
});
