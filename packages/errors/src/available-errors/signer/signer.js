"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignerMethodError = void 0;
const sdk_error_1 = require("../sdk-error");
/**
 * Signer method error.
 *
 * WHEN TO USE:
 * * This error will be thrown when a signer method has failed.
 */
class SignerMethodError extends sdk_error_1.VechainSDKError {
}
exports.SignerMethodError = SignerMethodError;
