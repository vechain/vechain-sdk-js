"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONRPCTransactionRevertError = exports.JSONRPCInvalidDefaultBlock = exports.ProviderMethodError = exports.JSONRPCServerError = exports.JSONRPCProviderError = exports.JSONRPCParseError = exports.JSONRPCMethodNotImplemented = exports.JSONRPCMethodNotFound = exports.JSONRPCInvalidRequest = exports.JSONRPCInvalidParams = exports.JSONRPCInternalError = void 0;
const sdk_error_1 = require("../sdk-error");
/**
 * Provider method error.
 *
 * WHEN TO USE:
 * * This error will be thrown when a provider method has failed.
 */
class ProviderMethodError extends sdk_error_1.VechainSDKError {
}
exports.ProviderMethodError = ProviderMethodError;
/**
 * Provider generic error.
 *
 * WHEN TO USE:
 * * It is a subclass of all provider errors
 *
 * @see{https://www.jsonrpc.org/specification#error_object}
 */
class JSONRPCProviderError extends sdk_error_1.VechainSDKError {
    methodName;
    innerError;
    constructor(methodName, code, message, data, innerError) {
        super(methodName, message, { code, message, data }, innerError);
        this.methodName = methodName;
        this.innerError = innerError;
    }
}
exports.JSONRPCProviderError = JSONRPCProviderError;
/**
 * Parse error.
 *
 * WHEN TO USE:
 * * Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.
 */
class JSONRPCParseError extends JSONRPCProviderError {
    methodName;
    innerError;
    constructor(methodName, message, data, innerError) {
        super(methodName, -32700, message, data, innerError);
        this.methodName = methodName;
        this.innerError = innerError;
    }
}
exports.JSONRPCParseError = JSONRPCParseError;
/**
 * Invalid request.
 *
 * WHEN TO USE:
 * * The JSON sent is not a valid Request object.
 */
class JSONRPCInvalidRequest extends JSONRPCProviderError {
    methodName;
    innerError;
    constructor(methodName, message, data, innerError) {
        super(methodName, -32600, message, data, innerError);
        this.methodName = methodName;
        this.innerError = innerError;
    }
}
exports.JSONRPCInvalidRequest = JSONRPCInvalidRequest;
/**
 * Method not found.
 *
 * WHEN TO USE:
 * * The method does not exist / is not available.
 */
class JSONRPCMethodNotFound extends JSONRPCProviderError {
    methodName;
    innerError;
    constructor(methodName, message, data, innerError) {
        super(methodName, -32601, message, data, innerError);
        this.methodName = methodName;
        this.innerError = innerError;
    }
}
exports.JSONRPCMethodNotFound = JSONRPCMethodNotFound;
/**
 * Invalid params.
 *
 * WHEN TO USE:
 * * Invalid method parameter(s).
 */
class JSONRPCInvalidParams extends JSONRPCProviderError {
    methodName;
    innerError;
    constructor(methodName, message, data, innerError) {
        super(methodName, -32602, message, data, innerError);
        this.methodName = methodName;
        this.innerError = innerError;
    }
}
exports.JSONRPCInvalidParams = JSONRPCInvalidParams;
/**
 * Internal JSON-RPC error.
 *
 * WHEN TO USE:
 * * Internal JSON-RPC error.
 */
class JSONRPCInternalError extends JSONRPCProviderError {
    methodName;
    innerError;
    constructor(methodName, message, data, innerError) {
        super(methodName, -32603, message, data, innerError);
        this.methodName = methodName;
        this.innerError = innerError;
    }
}
exports.JSONRPCInternalError = JSONRPCInternalError;
/**
 * Invalid default block.
 *
 * WHEN TO USE:
 * * When converting default block to vechain revision
 */
class JSONRPCInvalidDefaultBlock extends sdk_error_1.VechainSDKError {
}
exports.JSONRPCInvalidDefaultBlock = JSONRPCInvalidDefaultBlock;
/**
 * Server error.
 *
 * WHEN TO USE:
 * * Reserved for implementation-defined server-errors.
 */
class JSONRPCServerError extends JSONRPCProviderError {
    methodName;
    innerError;
    constructor(methodName, message, data, innerError) {
        super(methodName, -32000, message, data, innerError);
        this.methodName = methodName;
        this.innerError = innerError;
    }
}
exports.JSONRPCServerError = JSONRPCServerError;
/**
 * Method not implemented.
 *
 * WHEN TO USE:
 * * When a method is implemented but not yet supported by the provider.
 */
class JSONRPCMethodNotImplemented extends JSONRPCProviderError {
    methodName;
    innerError;
    constructor(methodName, message, data, innerError) {
        super(methodName, -32004, message, data, innerError);
        this.methodName = methodName;
        this.innerError = innerError;
    }
}
exports.JSONRPCMethodNotImplemented = JSONRPCMethodNotImplemented;
/**
 * Revert error.
 *
 * WHEN TO USE:
 * * When a Transaction is reverted.
 */
class JSONRPCTransactionRevertError extends Error {
    code;
    data;
    message;
    constructor(message, data) {
        super(message || 'execution reverted');
        this.message = message;
        this.name = 'JSONRPCTransactionRevertError';
        this.code = -32000;
        this.data = data;
        // Needed to make instanceof work when transpiled
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.JSONRPCTransactionRevertError = JSONRPCTransactionRevertError;
