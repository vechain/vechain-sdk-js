"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpNetworkError = exports.InvalidHTTPParams = exports.InvalidHTTPRequest = void 0;
const sdk_error_1 = require("../sdk-error");
/**
 * Http invalid request error
 *
 * WHEN TO USE:
 * * Error will be thrown when an invalid HTTP request fails
 */
class InvalidHTTPRequest extends sdk_error_1.VechainSDKError {
}
exports.InvalidHTTPRequest = InvalidHTTPRequest;
/**
 * Http invalid params error
 *
 * WHEN TO USE:
 * * Error will be thrown when HTTP request params are invalid
 */
class InvalidHTTPParams extends sdk_error_1.VechainSDKError {
}
exports.InvalidHTTPParams = InvalidHTTPParams;
/**
 * Http network communication error
 *
 * WHEN TO USE:
 * * Error will be thrown when network communication fails (timeout, connection reset, etc.)
 * * This is different from HTTP protocol errors (4xx/5xx responses)
 */
class HttpNetworkError extends sdk_error_1.VechainSDKError {
}
exports.HttpNetworkError = HttpNetworkError;
