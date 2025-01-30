import { describe, expect, test } from '@jest/globals';
import {
    CannotFindTransaction,
    InvalidTransactionField,
    NotDelegatedTransaction,
    UnavailableTransactionField,
    VechainSDKError
} from '../../src';

/**
 * Available errors test - Transaction
 * @group unit/errors/available-errors/transaction
 */
describe('Error package Available errors test - Transaction', () => {
    /**
     * Helper function to test UnavailableTransactionField
     */
    const testUnavailableTransactionField = (innerError?: Error): void => {
        expect(() => {
            throw new UnavailableTransactionField(
                'method',
                'message',
                { fieldName: 'field' },
                innerError
            );
        }).toThrowError(VechainSDKError);
    };

    /**
     * Test UnavailableTransactionField
     */
    test('UnavailableTransactionField', () => {
        [undefined, new Error('error')].forEach((innerError) => {
            testUnavailableTransactionField(innerError);
        });
    });

    /**
     * Helper function to test InvalidTransactionField
     */
    const testInvalidTransactionField = (innerError?: Error): void => {
        expect(() => {
            throw new InvalidTransactionField(
                'method',
                'message',
                {
                    fieldName: 'field',
                    fieldContent: 'invalid-field-content'
                },
                innerError
            );
        }).toThrowError(VechainSDKError);
    };

    /**
     * Test InvalidTransactionField
     */
    test('InvalidTransactionField', () => {
        [undefined, new Error('error')].forEach((innerError) => {
            testInvalidTransactionField(innerError);
        });
    });

    /**
     * Helper function to test NotDelegatedTransaction
     */
    const testNotDelegatedTransaction = (
        innerError?: Error,
        data?: { gasPayerUrl: string }
    ): void => {
        expect(() => {
            throw new NotDelegatedTransaction(
                'method',
                'message',
                data,
                innerError
            );
        }).toThrowError(VechainSDKError);
    };

    /**
     * Test NotDelegatedTransaction
     */
    test('NotDelegatedTransaction', () => {
        [undefined, new Error('error')].forEach((innerError) => {
            // Use a valid object or explicitly check for undefined
            const dataOptions: Array<{ gasPayerUrl: string } | undefined> = [
                { gasPayerUrl: 'url' },
                undefined
            ];

            dataOptions.forEach((dataItem) => {
                // Explicit null check for dataItem
                if (dataItem != null) {
                    testNotDelegatedTransaction(innerError, dataItem);
                } else {
                    testNotDelegatedTransaction(innerError);
                }
            });
        });
    });

    /**
     * Helper function to test CannotFindTransaction
     */
    const testCannotFindTransaction = (innerError?: Error): void => {
        expect(() => {
            throw new CannotFindTransaction(
                'method',
                'message',
                {
                    transactionHash: '0xhash',
                    networkUrl: 'https://network.url'
                },
                innerError
            );
        }).toThrowError(VechainSDKError);
    };

    /**
     * Test CannotFindTransaction
     */
    test('CannotFindTransaction', () => {
        [undefined, new Error('error')].forEach((innerError) => {
            testCannotFindTransaction(innerError);
        });
    });
});
