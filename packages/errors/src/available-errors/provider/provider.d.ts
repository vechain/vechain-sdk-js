import { VechainSDKError } from '../sdk-error';
import type { JSONRpcErrorCode, ObjectErrorData } from '../types';
/**
 * Provider method error.
 *
 * WHEN TO USE:
 * * This error will be thrown when a provider method has failed.
 */
declare class ProviderMethodError extends VechainSDKError<ObjectErrorData> {
}
/**
 * Provider generic error.
 *
 * WHEN TO USE:
 * * It is a subclass of all provider errors
 *
 * @see{https://www.jsonrpc.org/specification#error_object}
 */
declare class JSONRPCProviderError extends VechainSDKError<{
    code: JSONRpcErrorCode;
    message: string;
    data: ObjectErrorData;
}> {
    readonly methodName: string;
    readonly innerError?: unknown | undefined;
    constructor(methodName: string, code: JSONRpcErrorCode, message: string, data: ObjectErrorData, innerError?: unknown | undefined);
}
/**
 * Parse error.
 *
 * WHEN TO USE:
 * * Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.
 */
declare class JSONRPCParseError extends JSONRPCProviderError {
    readonly methodName: string;
    readonly innerError?: unknown | undefined;
    constructor(methodName: string, message: string, data: ObjectErrorData, innerError?: unknown | undefined);
}
/**
 * Invalid request.
 *
 * WHEN TO USE:
 * * The JSON sent is not a valid Request object.
 */
declare class JSONRPCInvalidRequest extends JSONRPCProviderError {
    readonly methodName: string;
    readonly innerError?: unknown | undefined;
    constructor(methodName: string, message: string, data: ObjectErrorData, innerError?: unknown | undefined);
}
/**
 * Method not found.
 *
 * WHEN TO USE:
 * * The method does not exist / is not available.
 */
declare class JSONRPCMethodNotFound extends JSONRPCProviderError {
    readonly methodName: string;
    readonly innerError?: unknown | undefined;
    constructor(methodName: string, message: string, data: ObjectErrorData, innerError?: unknown | undefined);
}
/**
 * Invalid params.
 *
 * WHEN TO USE:
 * * Invalid method parameter(s).
 */
declare class JSONRPCInvalidParams extends JSONRPCProviderError {
    readonly methodName: string;
    readonly innerError?: unknown | undefined;
    constructor(methodName: string, message: string, data: ObjectErrorData, innerError?: unknown | undefined);
}
/**
 * Internal JSON-RPC error.
 *
 * WHEN TO USE:
 * * Internal JSON-RPC error.
 */
declare class JSONRPCInternalError extends JSONRPCProviderError {
    readonly methodName: string;
    readonly innerError?: unknown | undefined;
    constructor(methodName: string, message: string, data: ObjectErrorData, innerError?: unknown | undefined);
}
/**
 * Invalid default block.
 *
 * WHEN TO USE:
 * * When converting default block to vechain revision
 */
declare class JSONRPCInvalidDefaultBlock extends VechainSDKError<string> {
}
/**
 * Server error.
 *
 * WHEN TO USE:
 * * Reserved for implementation-defined server-errors.
 */
declare class JSONRPCServerError extends JSONRPCProviderError {
    readonly methodName: string;
    readonly innerError?: unknown | undefined;
    constructor(methodName: string, message: string, data: ObjectErrorData, innerError?: unknown | undefined);
}
/**
 * Method not implemented.
 *
 * WHEN TO USE:
 * * When a method is implemented but not yet supported by the provider.
 */
declare class JSONRPCMethodNotImplemented extends JSONRPCProviderError {
    readonly methodName: string;
    readonly innerError?: unknown | undefined;
    constructor(methodName: string, message: string, data: ObjectErrorData, innerError?: unknown | undefined);
}
/**
 * Revert error.
 *
 * WHEN TO USE:
 * * When a Transaction is reverted.
 */
declare class JSONRPCTransactionRevertError extends Error {
    code: number;
    data?: string;
    message: string;
    constructor(message: string, data?: string);
}
export { JSONRPCInternalError, JSONRPCInvalidParams, JSONRPCInvalidRequest, JSONRPCMethodNotFound, JSONRPCMethodNotImplemented, JSONRPCParseError, JSONRPCProviderError, JSONRPCServerError, ProviderMethodError, JSONRPCInvalidDefaultBlock, JSONRPCTransactionRevertError };
//# sourceMappingURL=provider.d.ts.map