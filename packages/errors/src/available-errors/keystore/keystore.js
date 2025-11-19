"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidKeystoreParams = exports.InvalidKeystore = void 0;
const sdk_error_1 = require("../sdk-error");
/**
 * Invalid keystore error.
 *
 * WHEN TO USE:
 * * Error will be thrown when the keystore is invalid.
 */
class InvalidKeystore extends sdk_error_1.VechainSDKError {
}
exports.InvalidKeystore = InvalidKeystore;
/**
 * Invalid keystore params error.
 *
 * WHEN TO USE:
 * * Error will be thrown when the keystore params are invalid.
 */
class InvalidKeystoreParams extends sdk_error_1.VechainSDKError {
}
exports.InvalidKeystoreParams = InvalidKeystoreParams;
