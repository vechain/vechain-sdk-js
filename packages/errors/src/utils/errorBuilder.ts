import {
    EIP1193,
    type JSONRPC,
    ProviderRpcError,
    getEIP1193ErrorCode,
    getJSONRPCErrorCode
} from '../model';
import type { DataType, ErrorCode, ErrorType } from '../types';
import { ErrorClassMap } from '../types';

/**
 * Build error object according to the error code provided.
 * The error code determines the error type returned and the data type to be provided.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @param innerError - The inner error.
 * @returns the error object.
 */
function buildError<
    ErrorCodeT extends ErrorCode,
    DataTypeT extends DataType<ErrorCodeT>
>(
    code: ErrorCodeT,
    message: string,
    data?: DataTypeT,
    innerError?: unknown
): ErrorType<ErrorCodeT> {
    const ErrorClass = ErrorClassMap.get(code);

    if (ErrorClass === undefined || ErrorClass === null) {
        throw new Error('Invalid error code');
    }

    const error = new ErrorClass({
        code,
        message,
        data,
        innerError:
            innerError === undefined ? undefined : assertInnerError(innerError)
    });

    return error as ErrorType<ErrorCodeT>;
}

/**
 * Assert that the inner error object is an instance of Error
 * @param error an unknown object to be asserted as an instance of Error
 * @returns an Error object
 */
function assertInnerError(error: unknown): Error {
    if (error instanceof Error) {
        return error;
    }

    throw new Error('Inner error is not an instance of Error');
}

/**
 * Build RPC error object according to the error code provided.
 *
 * @link [Rpc Errors](https://eips.ethereum.org/EIPS/eip-1193#rpc-errors)
 *
 * @param code - The error code as specified in EIP-1193 or EIP-1474
 * @param message - The error message
 * @param data - Contains optional extra information about the error
 *
 * @returns the error object
 */
function buildProviderError<
    ErrorCodeT extends ErrorCode,
    DataTypeT extends DataType<ErrorCodeT>
>(
    code: EIP1193 | JSONRPC,
    message: string,
    data?: DataTypeT
): ProviderRpcError {
    const ErrorClass = ErrorClassMap.get(code);

    const _code: number = isEIP1193Code(code)
        ? getEIP1193ErrorCode(code)
        : getJSONRPCErrorCode(code);

    if (ErrorClass === undefined || ErrorClass === null) {
        throw new Error('Invalid error code');
    }

    return new ProviderRpcError(_code, message, data);
}

/**
 * Check if the code is an EIP1193 code
 * @param code - The code to be checked
 * @returns true if the code is an EIP1193 code
 */
function isEIP1193Code(code: EIP1193 | JSONRPC): code is EIP1193 {
    return Object.values(EIP1193).includes(code as EIP1193);
}

export { buildError, assertInnerError, buildProviderError };
