"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnsupportedOperation = exports.InvalidDataType = void 0;
const sdk_error_1 = require("../sdk-error");
/**
 * Invalid data type error.
 *
 * WHEN TO USE:
 * * This error will be thrown when the data type is invalid.
 * -e.g.- when the data type is not a string, number, boolean, or object.
 */
class InvalidDataType extends sdk_error_1.VechainSDKError {
}
exports.InvalidDataType = InvalidDataType;
/**
 * Unsupported operation error.
 *
 * WHEN TO USE:
 * * This error will be thrown when an operation is not supported.
 * -e.g.- into the ethers adapter, when the runner does not support sending transactions.
 */
class UnsupportedOperation extends sdk_error_1.VechainSDKError {
}
exports.UnsupportedOperation = UnsupportedOperation;
