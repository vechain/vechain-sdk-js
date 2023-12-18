import { describe, expect, test } from '@jest/globals';
import { buildTransactionBodyClausesTestCases } from './fixture';
import { TEST_ACCOUNTS, thorClient } from '../../../fixture';

/**
 * Transactions module tests suite.
 *
 * @group integration/clients/thor-client/transactions
 */
describe('Transactions module Testnet tests suite', () => {
    /**
     * Test suite for buildTransactionBody method
     */
    describe('buildTransactionBody', () => {
        /**
         * buildTransactionBody test cases with different options
         */
        buildTransactionBodyClausesTestCases.forEach(
            ({ description, clauses, options, expected }) => {
                test(description, async () => {
                    const gasResult = await thorClient.gas.estimateGas(
                        clauses,
                        TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address // This address might not exist on testnet, thus the gasResult.reverted might be true
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
                    expect(txBody.expiration).toBe(expected.testnet.expiration);
                    expect(txBody.gas).toBe(gasResult.totalGas);
                    expect(txBody.dependsOn).toBe(expected.testnet.dependsOn);
                    expect(txBody.gasPriceCoef).toBe(
                        expected.testnet.gasPriceCoef
                    );
                    expect(txBody.reserved).toStrictEqual(
                        expected.testnet.reserved
                    );
                    expect(txBody.chainTag).toBe(expected.testnet.chainTag);
                });
            }
        );
    });
});
