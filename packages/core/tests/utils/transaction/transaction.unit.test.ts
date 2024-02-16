import { describe, expect, test } from '@jest/globals';
import { TRANSACTIONS_GAS_CONSTANTS, TransactionUtils } from '../../../src';
import {
    invalidData,
    normalTransactions,
    smartContractTransactions
} from './fixture';
import { type TransactionClause } from '../../../src';

/**
 * Transaction utils test
 * @group unit/utils-transaction
 */
describe('Transaction utils', () => {
    /**
     * Invalid clauses data
     */
    test('Should throw errors for invalid clauses data', () => {
        invalidData.forEach((invalidClause) => {
            expect(() => {
                TransactionUtils.intrinsicGas([
                    {
                        to: invalidClause.to,
                        value: invalidClause.value,
                        data: invalidClause.data
                    }
                ]);
            }).toThrowError(invalidClause.errorToThrow);
        });
    });

    /**
     * Intrinsic gas - No clauses
     */
    test('Should calculate intrinsic gas for a transaction with no clauses', () => {
        expect(TransactionUtils.intrinsicGas([])).toBe(
            TRANSACTIONS_GAS_CONSTANTS.TX_GAS +
                TRANSACTIONS_GAS_CONSTANTS.CLAUSE_GAS
        );
    });

    /**
     * Intrinsic gas - Normal call - Some clauses
     */
    test('Should calculate intrinsic gas for a normal call transaction ("to" field is NOT null)', () => {
        normalTransactions.forEach((normalTransaction) => {
            const clauses: TransactionClause[] = normalTransaction.clauses.map(
                (clause: TransactionClause) => {
                    return {
                        to: clause.to,
                        value: clause.value,
                        data: clause.data
                    };
                }
            );
            expect(TransactionUtils.intrinsicGas(clauses)).toBe(
                normalTransaction.expected
            );
        });
    });

    /**
     * Intrinsic gas - Smart contract - Some clauses
     */
    test('Should calculate intrinsic gas for a smart contract transaction ("to" field is null)', () => {
        smartContractTransactions(100, 100).forEach(
            (smartContractTransaction: {
                clauses: TransactionClause[];
                expected: number;
            }) => {
                expect(
                    TransactionUtils.intrinsicGas(
                        smartContractTransaction.clauses
                    )
                ).toBe(smartContractTransaction.expected);
            }
        );
    });
});
