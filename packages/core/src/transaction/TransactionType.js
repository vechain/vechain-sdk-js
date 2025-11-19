"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionType = void 0;
exports.toTransactionType = toTransactionType;
exports.fromTransactionType = fromTransactionType;
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * Represents the type of a transaction
 */
var TransactionType;
(function (TransactionType) {
    TransactionType["Legacy"] = "legacy";
    TransactionType["EIP1559"] = "eip1559";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
/**
 * Constants for transaction type values
 */
const TRANSACTION_TYPE_VALUES = {
    [TransactionType.Legacy]: 0,
    [TransactionType.EIP1559]: 81 // 0x51
};
/**
 * Valid transaction type values
 */
const VALID_TRANSACTION_TYPES = Object.values(TRANSACTION_TYPE_VALUES);
/**
 * Converts a transaction type number to TransactionType string.
 * Type 0 represents legacy transactions, type 81 (0x51) represents EIP-1559 transactions
 *
 * @param type - The transaction type number (0 or 81)
 * @returns The transaction type as 'legacy' or 'eip1559'
 * @throws {Error} If the input type is not a valid transaction type
 * @example
 * ```typescript
 * const type = toTransactionType(81); // returns TransactionType.EIP1559
 * const type = toTransactionType(0);  // returns TransactionType.Legacy
 * ```
 */
function toTransactionType(type) {
    if (!VALID_TRANSACTION_TYPES.includes(type)) {
        throw new sdk_errors_1.InvalidTransactionType('TransactionType.toTransactionType()', 'Invalid transaction type', {
            transactionType: type.toString(),
            validTypes: VALID_TRANSACTION_TYPES.map((t) => t.toString()).join(', ')
        });
    }
    return type === TRANSACTION_TYPE_VALUES[TransactionType.Legacy]
        ? TransactionType.Legacy
        : TransactionType.EIP1559;
}
/**
 * Converts a TransactionType string to its corresponding number representation.
 * 'legacy' transactions are type 0, 'eip1559' transactions are type 81 (0x51).
 *
 * @param type - The transaction type as TransactionType
 * @returns The transaction type number (0 for legacy, 81 for eip1559)
 * @example
 * ```typescript
 * const type = fromTransactionType(TransactionType.EIP1559); // returns 81
 * const type = fromTransactionType(TransactionType.Legacy);  // returns 0
 * ```
 */
function fromTransactionType(type) {
    return TRANSACTION_TYPE_VALUES[type];
}
