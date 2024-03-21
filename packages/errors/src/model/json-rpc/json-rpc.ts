/**
 * Errors implementation of JSON-RPC standard.
 *
 * @see https://docs.infura.io/networks/ethereum/json-rpc-methods
 * @see https://github.com/ethereum/go-ethereum/blob/master/rpc/errors.go
 */
import { ErrorBase } from '../base';

/**
 * HTTP Client Error.
 *
 * @NOTE: code parameter is required to be fully compatible with EIP-1193.
 * When we will throw error, we will use EIP1193.CODE_..., but for syntactic sugar
 * we will have code as number into error data.
 */
interface JSONRPCErrorData {
    code: -32700 | -32600 | -32601 | -32602 | -32603 | -32000;
    message: string;
}

/**
 * JSON is not a valid request object
 */
class JSONRPCInvalidRequest extends ErrorBase<
    JSONRPC.INVALID_REQUEST,
    JSONRPCErrorData
> {}

/**
 * Invalid method parameters
 */
class JSONRPCInvalidParams extends ErrorBase<
    JSONRPC.INVALID_PARAMS,
    JSONRPCErrorData
> {}

/**
 * Internal JSON-RPC error
 */
class JSONRPCInternalError extends ErrorBase<
    JSONRPC.INTERNAL_ERROR,
    JSONRPCErrorData
> {}

/**
 * Default error
 *
 * @see https://github.com/ethereum/go-ethereum/blob/master/rpc/errors.go
 */
class JSONRPCDefaultError extends ErrorBase<
    JSONRPC.DEFAULT,
    JSONRPCErrorData
> {}

/**
 * Errors enum.
 *
 * @see https://eips.ethereum.org/EIPS/eip-1193#rpc-errors
 */
enum JSONRPC {
    // Standard errors
    INVALID_REQUEST = 'INVALID_REQUEST',
    INVALID_PARAMS = 'INVALID_PARAMS',
    INTERNAL_ERROR = 'INTERNAL_ERROR',

    // Default error
    DEFAULT = 'DEFAULT'
}

/**
 * Get correct error code by error message enum.
 */
const getJSONRPCErrorCode = (
    error: JSONRPC
): -32600 | -32602 | -32603 | -32000 => {
    switch (error) {
        case JSONRPC.INVALID_REQUEST:
            return -32600;
        case JSONRPC.INVALID_PARAMS:
            return -32602;
        case JSONRPC.INTERNAL_ERROR:
            return -32603;
        case JSONRPC.DEFAULT:
            return -32000;
    }
};

export {
    type JSONRPCErrorData,
    JSONRPCInvalidRequest,
    JSONRPCInvalidParams,
    JSONRPCInternalError,
    JSONRPCDefaultError,
    JSONRPC,
    getJSONRPCErrorCode
};
