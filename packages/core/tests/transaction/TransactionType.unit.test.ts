import { describe, expect, test } from '@jest/globals';
import {
    TransactionType,
    fromTransactionType,
    toTransactionType
} from '../../src';
import { InvalidTransactionType } from '@vechain/sdk-errors';

/**
 * Test TransactionType
 * @group unit/transaction
 */
describe('TransactionType', () => {
    test('should be able to convert toTransactionType', () => {
        expect(toTransactionType(81)).toBe(TransactionType.EIP1559);
        expect(toTransactionType(0)).toBe(TransactionType.Legacy);
    });
    test('should be able to convert fromTransactionType', () => {
        expect(fromTransactionType(TransactionType.EIP1559)).toBe(81);
        expect(fromTransactionType(TransactionType.Legacy)).toBe(0);
    });
    test('should throw an error if the transaction type is not valid', () => {
        expect(() => toTransactionType(256)).toThrow(InvalidTransactionType);

        // Test error properties
        const throwingFunction = (): TransactionType => toTransactionType(256);
        expect(throwingFunction).toThrowError(
            expect.objectContaining({
                message: 'Invalid transaction type',
                data: {
                    transactionType: '256',
                    validTypes: '0, 81'
                }
            })
        );
    });
});
