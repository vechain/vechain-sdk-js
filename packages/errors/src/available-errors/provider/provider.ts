import { VechainSDKError } from '../sdk-error';
import { type ObjectErrorData } from '../types';

/**
 * Provider generic error.
 *
 * WHEN TO USE:
 * * It is a subclass of all provider errors
 *
 * @see{https://www.jsonrpc.org/specification#error_object}
 */
class JSONRPCProviderError<
    TJSONRpcErrorCode extends
        | -32700
        | -32600
        | -32601
        | -32602
        | -32603
        | -32000
> extends VechainSDKError<{
    code: TJSONRpcErrorCode;
    message: string;
    data: ObjectErrorData;
}> {
    constructor(
        readonly methodName: string,
        code: TJSONRpcErrorCode,
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
class JSONRPCParseError extends JSONRPCProviderError<-32700> {}

/**
 * Invalid request.
 *
 * WHEN TO USE:
 * * The JSON sent is not a valid Request object.
 */
class JSONRPCInvalidRequest extends JSONRPCProviderError<-32600> {}

/**
 * Method not found.
 *
 * WHEN TO USE:
 * * The method does not exist / is not available.
 */
class JSONRPCMethodNotFound extends JSONRPCProviderError<-32601> {}

/**
 * Invalid params.
 *
 * WHEN TO USE:
 * * Invalid method parameter(s).
 */
class JSONRPCInvalidParams extends JSONRPCProviderError<-32602> {}

/**
 * Internal JSON-RPC error.
 *
 * WHEN TO USE:
 * * Internal JSON-RPC error.
 */
class JSONRPCInternalError extends JSONRPCProviderError<-32603> {}

/**
 * Server error.
 *
 * WHEN TO USE:
 * * Reserved for implementation-defined server-errors.
 */
class JSONRPCServerError extends JSONRPCProviderError<-32000> {}

export {
    JSONRPCProviderError,
    JSONRPCParseError,
    JSONRPCInvalidRequest,
    JSONRPCMethodNotFound,
    JSONRPCInvalidParams,
    JSONRPCInternalError,
    JSONRPCServerError
};
