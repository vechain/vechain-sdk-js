"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidHDKey = exports.InvalidHDKeyMnemonic = void 0;
const sdk_error_1 = require("../sdk-error");
/**
 * Invalid HDNode mnemonic error.
 *
 * WHEN TO USE:
 * * This error will be thrown when the HDKey mnemonic is invalid.
 *
 * @note Data (mnemonic) is undefined for security reasons, the mnemonic should not be logged!
 */
class InvalidHDKeyMnemonic extends sdk_error_1.VechainSDKError {
}
exports.InvalidHDKeyMnemonic = InvalidHDKeyMnemonic;
/**
 * Invalid HDNode error.
 *
 * WHEN TO USE:
 * * This error will be thrown when the HDKey is invalid (derivation path / chainCode / public key parameters).
 */
class InvalidHDKey extends sdk_error_1.VechainSDKError {
}
exports.InvalidHDKey = InvalidHDKey;
