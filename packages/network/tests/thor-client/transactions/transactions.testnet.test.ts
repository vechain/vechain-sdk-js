import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import {
    buildTransactionBodyClausesTestCases,
    getRevertReasonTestCasesFixture
} from './fixture';
import { getUnusedBaseWallet } from '../../fixture';
import { TESTNET_URL, ThorClient, VeChainProvider } from '../../../src';
import { InvalidDataType } from '@vechain/sdk-errors';

/**
 * Transactions module tests suite.
 *
 * @group integration/clients/thor-client/transactions
 */
describe('Transactions module Testnet tests suite', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient: ThorClient;
    let provider: VeChainProvider;

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        thorClient = ThorClient.at(TESTNET_URL);
        provider = new VeChainProvider(
            thorClient,
            getUnusedBaseWallet(),
            false
        );
    });

    /**
     * Destroy thor client and provider after each test
     */
    afterEach(() => {
        provider.destroy();
    });

    /**
     * Test suite for buildTransactionBody method
     */
    describe('buildTransactionBody', () => {
        /**
         * buildTransactionBody test cases with different options
         */
        buildTransactionBodyClausesTestCases.forEach(
            ({ description, clauses, options, expected }) => {
                test(
                    description,
                    async () => {
                        const thorClient = ThorClient.at(TESTNET_URL);
                        const gasResult =
                            await thorClient.transactions.estimateGas(
                                clauses,
                                '0x000000000000000000000000004d000000000000' // This address might not exist on testnet, thus the gasResult.reverted might be true
                            );

                        expect(gasResult.totalGas).toBe(expected.testnet.gas);

                        const txBody =
                            await thorClient.transactions.buildTransactionBody(
                                clauses,
                                gasResult.totalGas,
                                options
                            );

                        expect(txBody).toBeDefined();
                        expect(txBody.clauses).toStrictEqual(
                            expected.testnet.clauses
                        );
                        expect(txBody.expiration).toBe(
                            expected.testnet.expiration
                        );
                        expect(txBody.gas).toBe(gasResult.totalGas);
                        expect(txBody.dependsOn).toBe(
                            expected.testnet.dependsOn
                        );
                        expect(txBody.gasPriceCoef).toBe(
                            expected.testnet.gasPriceCoef
                        );
                        expect(txBody.reserved).toStrictEqual(
                            expected.testnet.reserved
                        );
                        expect(txBody.chainTag).toBe(expected.testnet.chainTag);
                    },
                    8000
                );
            }
        );
    });

    /**
     * Test suite for getRevertReason method
     */
    describe('getRevertReason', () => {
        /**
         * Get revert info test case
         */
        getRevertReasonTestCasesFixture.forEach((testCase) => {
            test(testCase.description, async () => {
                const revertReason =
                    await thorClient.transactions.getRevertReason(
                        testCase.revertedTransactionHash,
                        testCase.errorFragment
                    );
                expect(revertReason).toStrictEqual(testCase.expected);
            });
        }, 10000);
    });

    /**
     * Test negative cases
     */
    describe('Negative cases', () => {
        /**
         * waitForTransaction() with invalid transaction id
         */
        test('waitForTransaction with invalid transaction id', async () => {
            await expect(async () => {
                await thorClient.transactions.waitForTransaction('0xINVALID');
            }).rejects.toThrow(InvalidDataType);
        });

        /**
         * getTransactionRaw() with invalid input data
         */
        test('getTransactionRaw with invalid input data', async () => {
            // Invalid transaction id
            await expect(async () => {
                await thorClient.transactions.getTransactionRaw('0xINVALID');
            }).rejects.toThrow(InvalidDataType);

            // Invalid block id
            await expect(async () => {
                await thorClient.transactions.getTransactionRaw(
                    getRevertReasonTestCasesFixture[0].revertedTransactionHash,
                    { head: '0xINVALID' }
                );
            }).rejects.toThrow(InvalidDataType);
        });
    });
});
