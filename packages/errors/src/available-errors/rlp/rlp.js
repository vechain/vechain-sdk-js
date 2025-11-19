"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidRLP = void 0;
const sdk_error_1 = require("../sdk-error");
/**
 * Invalid RLP error.
 *
 * WHEN TO USE:
 * * Error will be thrown when the RLP is invalid.
 */
class InvalidRLP extends sdk_error_1.VechainSDKError {
}
exports.InvalidRLP = InvalidRLP;
