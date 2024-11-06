import { beforeEach, describe, expect, test } from '@jest/globals';
import { TESTNET_URL, ThorClient } from '../../../src';
import {
    retrieveStorageRangeTestnetFixture,
    traceContractCallTestnetFixture,
    traceTransactionClauseTestnetFixture
} from './fixture-thorest';
import { Address, HexUInt, Units, VET } from '@vechain/sdk-core';

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
                            target: {
                                to:
                                    typeof positiveTestCase.to === 'string'
                                        ? Address.of(positiveTestCase.to)
                                        : null,
                                data: HexUInt.of(positiveTestCase.data),
                                value:
                                    positiveTestCase.value === 'string'
                                        ? VET.of(
                                              HexUInt.of(positiveTestCase.value)
                                                  .bi,
                                              Units.wei
                                          )
                                        : undefined
                            },
                            options: {
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
    });
});
