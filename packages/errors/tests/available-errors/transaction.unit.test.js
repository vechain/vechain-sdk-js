"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../src");
/**
 * Available errors test - Transaction
 * @group unit/errors/available-errors/transaction
 */
(0, globals_1.describe)('Error package Available errors test - Transaction', () => {
    /**
     * Helper function to test UnavailableTransactionField
     */
    const testUnavailableTransactionField = (innerError) => {
        (0, globals_1.expect)(() => {
            throw new src_1.UnavailableTransactionField('method', 'message', { fieldName: 'field' }, innerError);
        }).toThrowError(src_1.VechainSDKError);
    };
    /**
     * Test UnavailableTransactionField
     */
    (0, globals_1.test)('UnavailableTransactionField', () => {
        [undefined, new Error('error')].forEach((innerError) => {
            testUnavailableTransactionField(innerError);
        });
    });
    /**
     * Helper function to test InvalidTransactionField
     */
    const testInvalidTransactionField = (innerError) => {
        (0, globals_1.expect)(() => {
            throw new src_1.InvalidTransactionField('method', 'message', {
                fieldName: 'field',
                fieldContent: 'invalid-field-content'
            }, innerError);
        }).toThrowError(src_1.VechainSDKError);
    };
    /**
     * Test InvalidTransactionField
     */
    (0, globals_1.test)('InvalidTransactionField', () => {
        [undefined, new Error('error')].forEach((innerError) => {
            testInvalidTransactionField(innerError);
        });
    });
    /**
     * Helper function to test NotDelegatedTransaction
     */
    const testNotDelegatedTransaction = (innerError, data) => {
        (0, globals_1.expect)(() => {
            throw new src_1.NotDelegatedTransaction('method', 'message', data, innerError);
        }).toThrowError(src_1.VechainSDKError);
    };
    /**
     * Test NotDelegatedTransaction
     */
    (0, globals_1.test)('NotDelegatedTransaction', () => {
        [undefined, new Error('error')].forEach((innerError) => {
            // Use a valid object or explicitly check for undefined
            const dataOptions = [
                { gasPayerUrl: 'url' },
                undefined
            ];
            dataOptions.forEach((dataItem) => {
                // Explicit null check for dataItem
                if (dataItem != null) {
                    testNotDelegatedTransaction(innerError, dataItem);
                }
                else {
                    testNotDelegatedTransaction(innerError);
                }
            });
        });
    });
    /**
     * Helper function to test CannotFindTransaction
     */
    const testCannotFindTransaction = (innerError) => {
        (0, globals_1.expect)(() => {
            throw new src_1.CannotFindTransaction('method', 'message', {
                transactionHash: '0xhash',
                networkUrl: 'https://network.url'
            }, innerError);
        }).toThrowError(src_1.VechainSDKError);
    };
    /**
     * Test CannotFindTransaction
     */
    (0, globals_1.test)('CannotFindTransaction', () => {
        [undefined, new Error('error')].forEach((innerError) => {
            testCannotFindTransaction(innerError);
        });
    });
});
