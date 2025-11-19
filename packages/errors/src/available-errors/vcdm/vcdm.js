"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidOperation = void 0;
const sdk_error_1 = require("../sdk-error");
/**
 * Invalid cast type error.
 *
 * WHEN TO USE:
 * * Error will be thrown when a method call or property read fails.
 */
class InvalidOperation extends sdk_error_1.VechainSDKError {
}
exports.InvalidOperation = InvalidOperation;
