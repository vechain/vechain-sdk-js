"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidTransactionType = exports.CannotFindTransaction = exports.NotDelegatedTransaction = exports.InvalidTransactionField = exports.UnavailableTransactionField = void 0;
const sdk_error_1 = require("../sdk-error");
/**
 * Unavailable transaction field (field name) error.
 *
 * WHEN TO USE:
 * * Error will be thrown when a transaction (field name) in a transaction is unavailable.
 */
class UnavailableTransactionField extends sdk_error_1.VechainSDKError {
}
exports.UnavailableTransactionField = UnavailableTransactionField;
/**
 * Invalid transaction field (field name) error.
 *
 * WHEN TO USE:
 * * Error will be thrown when a transaction (field name) in a transaction is invalid.
 */
class InvalidTransactionField extends sdk_error_1.VechainSDKError {
}
exports.InvalidTransactionField = InvalidTransactionField;
/**
 * Not delegated transaction error.
 *
 * WHEN TO USE:
 * * Error will be thrown when the transaction is not delegated.
 */
class NotDelegatedTransaction extends sdk_error_1.VechainSDKError {
}
exports.NotDelegatedTransaction = NotDelegatedTransaction;
/**
 * Cannot find transaction error.
 *
 * WHEN TO USE:
 * * Error will be thrown when the transaction is not into the blockchain.
 */
class CannotFindTransaction extends sdk_error_1.VechainSDKError {
}
exports.CannotFindTransaction = CannotFindTransaction;
/**
 * Invalid transaction type error.
 *
 * WHEN TO USE:
 * * Error will be thrown when the transaction type is invalid.
 */
class InvalidTransactionType extends sdk_error_1.VechainSDKError {
}
exports.InvalidTransactionType = InvalidTransactionType;
