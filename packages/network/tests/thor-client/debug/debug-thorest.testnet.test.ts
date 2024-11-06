import { beforeEach, describe, expect, test } from '@jest/globals';
import { TESTNET_URL, ThorClient } from '../../../src';
import {
    retrieveStorageRangeTestnetFixture,
    traceContractCallTestnetFixture,
    traceTransactionClauseTestnetFixture
} from './fixture-thorest';

/**
 * Debug endpoints tests on the Testnet network.
 *
 * @group integration/clients/thor-client/debug-testnet
 */
describe('ThorClient - Debug Module - Testnet', () => {
    // ThorClient instance
    let thorClient: ThorClient;

    beforeEach(() => {
        thorClient = ThorClient.at(TESTNET_URL);
    });

    /**
     * traceTransactionClause tests
     */
    describe('traceTransactionClause', () => {
        /**
         * traceTransactionClause - correct cases
         *
         * @note Only 'call' tracer is tested here, other tracers are tested in the solo network
         */
        traceTransactionClauseTestnetFixture.positiveCases.forEach(
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
                            'call'
                        );
                    expect(result).toEqual(positiveTestCase.expected);
                });
            }
        );

        /**
         * traceTransactionClause - negative cases
         */
        // traceTransactionClauseTestnetFixture.negativeCases.forEach(
        //     (negativeTestCase) => {
        //         test(negativeTestCase.testName, async () => {
        //             await expect(
        //                 thorClient.debug.traceTransactionClause(
        //                     {
        //                         target: {
        //                             blockID: negativeTestCase.blockID,
        //                             transaction: negativeTestCase.transaction,
        //                             clauseIndex: negativeTestCase.clauseIndex
        //                         },
        //                         config: {}
        //                     },
        //                     'call'
        //                 )
        //             ).rejects.toThrow(negativeTestCase.expectedError);
        //         });
        //     }
        // );
    });

    /**
     * traceContractCall tests
     */
    describe('traceContractCall', () => {
        /**
         * traceContractCall - correct cases
         */
        traceContractCallTestnetFixture.positiveCases.forEach(
            (positiveTestCase) => {
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
                        'call'
                    );
                    expect(result).toEqual(positiveTestCase.expected);
                });
            }
        );

        /**
         * traceContractCall - negative cases
         */
        traceContractCallTestnetFixture.negativeCases.forEach(
            (negativeTestCase) => {
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
            }
        );
    });

    /**
     * retrieveStorageRange tests
     */
    describe('retrieveStorageRange', () => {
        /**
         * retrieveStorageRange - correct cases
         */
        retrieveStorageRangeTestnetFixture.positiveCases.forEach(
            (positiveTestCase) => {
                test(positiveTestCase.testName, async () => {
                    const result = await thorClient.debug.retrieveStorageRange({
                        target: {
                            blockID: positiveTestCase.blockID,
                            transaction: positiveTestCase.transaction,
                            clauseIndex: positiveTestCase.clauseIndex
                        },
                        options: {
                            address: positiveTestCase.address,
                            keyStart: positiveTestCase.keyStart,
                            maxResult: positiveTestCase.maxResult
                        }
                    });
                    expect(result).toEqual(positiveTestCase.expected);
                });
            }
        );

        /**
         * retrieveStorageRange - negative cases
         */
        // retrieveStorageRangeTestnetFixture.negativeCases.forEach(
        //     (negativeTestCase) => {
        //         test(negativeTestCase.testName, async () => {
        //             await expect(
        //                 thorClient.debug.retrieveStorageRange({
        //                     target: {
        //                         blockID: negativeTestCase.blockID,
        //                         transaction: negativeTestCase.transaction,
        //                         clauseIndex: negativeTestCase.clauseIndex
        //                     },
        //                     options: {
        //                         address: negativeTestCase.address,
        //                         keyStart: negativeTestCase.keyStart,
        //                         maxResult: negativeTestCase.maxResult
        //                     }
        //                 })
        //             ).rejects.toThrow(negativeTestCase.expectedError);
        //         });
        //     }
        // );
    });
});
