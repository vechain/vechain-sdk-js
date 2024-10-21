import { VechainSDKError } from '../sdk-error';
import type { JSONRpcErrorCode, ObjectErrorData } from '../types';

/**
 * Provider method error.
 *
 * WHEN TO USE:
 * * This error will be thrown when a provider method has failed.
 */
class ProviderMethodError extends VechainSDKError<ObjectErrorData> {}

/**
 * Provider generic error.
 *
 * WHEN TO USE:
 * * It is a subclass of all provider errors
 *
 * @see{https://www.jsonrpc.org/specification#error_object}
 */
class JSONRPCProviderError extends VechainSDKError<{
    code: JSONRpcErrorCode;
    message: string;
    data: ObjectErrorData;
}> {
    constructor(
        readonly methodName: string,
        code: JSONRpcErrorCode,
        message: string,
        data: ObjectErrorData,
        readonly innerError?: unknown
    ) {
        super(methodName, message, { code, message, data }, innerError);
    }
}

/**
 * Parse error.
 *
 * WHEN TO USE:
 * * Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.
 */
class JSONRPCParseError extends JSONRPCProviderError {
    constructor(
        readonly methodName: string,
        message: string,
        data: ObjectErrorData,
        readonly innerError?: unknown
    ) {
        super(methodName, -32700, message, data, innerError);
    }
}

/**
 * Invalid request.
 *
 * WHEN TO USE:
 * * The JSON sent is not a valid Request object.
 */
class JSONRPCInvalidRequest extends JSONRPCProviderError {
    constructor(
        readonly methodName: string,
        message: string,
        data: ObjectErrorData,
        readonly innerError?: unknown
    ) {
        super(methodName, -32600, message, data, innerError);
    }
}

/**
 * Method not found.
 *
 * WHEN TO USE:
 * * The method does not exist / is not available.
 */
class JSONRPCMethodNotFound extends JSONRPCProviderError {
    constructor(
        readonly methodName: string,
        message: string,
        data: ObjectErrorData,
        readonly innerError?: unknown
    ) {
        super(methodName, -32601, message, data, innerError);
    }
}

/**
 * Invalid params.
 *
 * WHEN TO USE:
 * * Invalid method parameter(s).
 */
class JSONRPCInvalidParams extends JSONRPCProviderError {
    constructor(
        readonly methodName: string,
        message: string,
        data: ObjectErrorData,
        readonly innerError?: unknown
    ) {
        super(methodName, -32602, message, data, innerError);
    }
}

/**
 * Internal JSON-RPC error.
 *
 * WHEN TO USE:
 * * Internal JSON-RPC error.
 */
class JSONRPCInternalError extends JSONRPCProviderError {
    constructor(
        readonly methodName: string,
        message: string,
        data: ObjectErrorData,
        readonly innerError?: unknown
    ) {
        super(methodName, -32603, message, data, innerError);
    }
}

/**
 * Server error.
 *
 * WHEN TO USE:
 * * Reserved for implementation-defined server-errors.
 */
class JSONRPCServerError extends JSONRPCProviderError {
    constructor(
        readonly methodName: string,
        message: string,
        data: ObjectErrorData,
        readonly innerError?: unknown
    ) {
        super(methodName, -32000, message, data, innerError);
    }
}

export {
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    JSONRPCInvalidRequest,
    JSONRPCMethodNotFound,
    JSONRPCParseError,
    JSONRPCProviderError,
    JSONRPCServerError,
    ProviderMethodError
};
