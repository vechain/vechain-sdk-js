"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidBloomParams = exports.InvalidBloom = void 0;
const sdk_error_1 = require("../sdk-error");
/**
 * Invalid bloom error.
 *
 * WHEN TO USE:
 * * Error will be thrown when the bloom is invalid.
 */
class InvalidBloom extends sdk_error_1.VechainSDKError {
}
exports.InvalidBloom = InvalidBloom;
/**
 * Invalid bloom params error.
 *
 * WHEN TO USE:
 * * Error will be thrown when the bloom params are invalid.
 */
class InvalidBloomParams extends sdk_error_1.VechainSDKError {
}
exports.InvalidBloomParams = InvalidBloomParams;
