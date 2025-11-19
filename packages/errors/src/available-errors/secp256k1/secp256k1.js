"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidSecp256k1Signature = exports.InvalidSecp256k1MessageHash = exports.InvalidSecp256k1PrivateKey = void 0;
const sdk_error_1 = require("../sdk-error");
/**
 * Invalid secp256k1 private key error.
 *
 * WHEN TO USE:
 * * Error will be thrown when the secp256k1 private key is invalid.
 *
 * @note Data (private key) is undefined for security reasons, the private key should not be logged!
 */
class InvalidSecp256k1PrivateKey extends sdk_error_1.VechainSDKError {
}
exports.InvalidSecp256k1PrivateKey = InvalidSecp256k1PrivateKey;
/**
 * Invalid secp256k1 message hash error.
 *
 * WHEN TO USE:
 * * Error will be thrown when the secp256k1 message hash is invalid.
 */
class InvalidSecp256k1MessageHash extends sdk_error_1.VechainSDKError {
}
exports.InvalidSecp256k1MessageHash = InvalidSecp256k1MessageHash;
/**
 * Invalid secp256k1 signature error.
 *
 * WHEN TO USE:
 * * Error will be thrown when the secp256k1 signature is invalid.
 */
class InvalidSecp256k1Signature extends sdk_error_1.VechainSDKError {
}
exports.InvalidSecp256k1Signature = InvalidSecp256k1Signature;
