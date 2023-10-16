import { describe, expect, test } from '@jest/globals';
import { TRANSACTIONS_GAS_CONSTANTS } from '../../../src';
import { intrinsicGas } from '../../../src/utils/transaction';
import {
    invalidData,
    normalTransactions,
    smartContractTransactions
} from './fixture';
import { type Clause } from '../../../src/transaction/types';

/**
 * Transaction utils test
 */
describe('Transaction utils', () => {
    /**
     * Invalid clauses data
     */
    test('Should throw errors for invalid clauses data', () => {
        invalidData.forEach((invalidClause) => {
            expect(() => {
                intrinsicGas([
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
        expect(intrinsicGas([])).toBe(
            TRANSACTIONS_GAS_CONSTANTS.TX_GAS +
                TRANSACTIONS_GAS_CONSTANTS.CLAUSE_GAS
        );
    });

    /**
     * Intrinsic gas - Normal call - Some clauses
     */
    test('Should calculate intrinsic gas for a normal call transaction ("to" field is NOT null)', () => {
        normalTransactions.forEach((normalTransaction) => {
            const clauses: Clause[] = normalTransaction.clauses.map(
                (clause: Clause) => {
                    return {
                        to: clause.to,
                        value: clause.value,
                        data: clause.data
                    };
                }
            );
            expect(intrinsicGas(clauses)).toBe(normalTransaction.expected);
        });
    });

    /**
     * Intrinsic gas - Smart contract - Some clauses
     */
    test('Should calculate intrinsic gas for a smart contract transaction ("to" field is null)', () => {
        smartContractTransactions(100, 100).forEach(
            (smartContractTransaction: {
                clauses: Clause[];
                expected: number;
            }) => {
                expect(intrinsicGas(smartContractTransaction.clauses)).toBe(
                    smartContractTransaction.expected
                );
            }
        );
    });
});
