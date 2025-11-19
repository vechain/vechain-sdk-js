"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../src");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * Test TransactionType
 * @group unit/transaction
 */
(0, globals_1.describe)('TransactionType', () => {
    (0, globals_1.test)('should be able to convert toTransactionType', () => {
        (0, globals_1.expect)((0, src_1.toTransactionType)(81)).toBe(src_1.TransactionType.EIP1559);
        (0, globals_1.expect)((0, src_1.toTransactionType)(0)).toBe(src_1.TransactionType.Legacy);
    });
    (0, globals_1.test)('should be able to convert fromTransactionType', () => {
        (0, globals_1.expect)((0, src_1.fromTransactionType)(src_1.TransactionType.EIP1559)).toBe(81);
        (0, globals_1.expect)((0, src_1.fromTransactionType)(src_1.TransactionType.Legacy)).toBe(0);
    });
    (0, globals_1.test)('should throw an error if the transaction type is not valid', () => {
        (0, globals_1.expect)(() => (0, src_1.toTransactionType)(256)).toThrow(sdk_errors_1.InvalidTransactionType);
        // Test error properties
        const throwingFunction = () => (0, src_1.toTransactionType)(256);
        (0, globals_1.expect)(throwingFunction).toThrowError(globals_1.expect.objectContaining({
            data: {
                transactionType: '256',
                validTypes: '0, 81'
            }
        }));
    });
});
