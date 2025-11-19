"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidAbiSignatureFormat = exports.InvalidAbiItem = exports.InvalidAbiDataToEncodeOrDecode = void 0;
const sdk_error_1 = require("../sdk-error");
/**
 * Invalid data to encode/decode abi error
 *
 * WHEN TO USE:
 * * This error will be thrown when the data to encode or decode into abi is invalid.
 */
class InvalidAbiDataToEncodeOrDecode extends sdk_error_1.VechainSDKError {
}
exports.InvalidAbiDataToEncodeOrDecode = InvalidAbiDataToEncodeOrDecode;
/**
 * Invalid ABI item error
 *
 * WHEN TO USE:
 * * This error will be thrown when the ABI item is invalid.
 */
class InvalidAbiItem extends sdk_error_1.VechainSDKError {
}
exports.InvalidAbiItem = InvalidAbiItem;
/**
 * Invalid abi signature format error
 *
 * WHEN TO USE:
 * * This error will be thrown when the abi signature format is invalid.
 */
class InvalidAbiSignatureFormat extends sdk_error_1.VechainSDKError {
}
exports.InvalidAbiSignatureFormat = InvalidAbiSignatureFormat;
