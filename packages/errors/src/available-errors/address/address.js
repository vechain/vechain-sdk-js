"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidAddress = void 0;
const sdk_error_1 = require("../sdk-error");
/**
 * Invalid address error
 *
 * WHEN TO USE:
 * * This error will be thrown when the address is invalid.
 */
class InvalidAddress extends sdk_error_1.VechainSDKError {
}
exports.InvalidAddress = InvalidAddress;
