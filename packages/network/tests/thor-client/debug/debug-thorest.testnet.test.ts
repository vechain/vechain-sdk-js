import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { testNetwork } from '../../fixture';
import { ThorClient } from '../../../src';
import {
    firstTransactionTestnetFixture,
    traceTransactionClauseTestnet
} from './fixture';
import { type TracerName } from '../../../src/thor-client/debug';

/**
 * ThorClient class tests
 *
 * @NOTE: This test suite run on testnet network because it contains read only tests.
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
                        blockID: firstTransactionTestnetFixture.blockID,
                        transaction: firstTransactionTestnetFixture.transaction,
                        clauseIndex: firstTransactionTestnetFixture.clauseIndex
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
                                blockID: positiveTestCase.blockID,
                                transaction: positiveTestCase.transaction,
                                clauseIndex: positiveTestCase.clauseIndex
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
                                blockID: negativeTestCase.blockID,
                                transaction: negativeTestCase.transaction,
                                clauseIndex: negativeTestCase.clauseIndex
                            },
                            negativeTestCase.name as TracerName | undefined
                        )
                    ).rejects.toThrow(negativeTestCase.expectedError);
                });
            }
        );
    });
});
