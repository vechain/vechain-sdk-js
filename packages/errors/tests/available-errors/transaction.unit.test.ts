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
     * UnavailableTransactionField
     */
    test('UnavailableTransactionField', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new UnavailableTransactionField(
                    'method',
                    'message',
                    { fieldName: 'field' },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });

    /**
     * InvalidTransactionField
     */
    test('InvalidTransactionField', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
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
        });
    });

    /**
     * NotDelegatedTransaction
     */
    test('NotDelegatedTransaction', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            // Fragment type
            [undefined, { delegatorUrl: 'url' }].forEach((data) => {
                expect(() => {
                    throw new NotDelegatedTransaction(
                        'method',
                        'message',
                        data,
                        innerError
                    );
                }).toThrowError(VechainSDKError);
            });
        });
    });

    /**
     * CannotFindTransaction
     */
    test('CannotFindTransaction', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
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
        });
    });
});
