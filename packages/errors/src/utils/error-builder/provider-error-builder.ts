import {
    EIP1193,
    getEIP1193ErrorCode,
    getJSONRPCErrorCode,
    type JSONRPC,
    ProviderRpcError
} from '../../model';
import { type DataType, ErrorClassMap, type ErrorCode } from '../../types';

/**
 * Builds a ProviderRpcError object with the given code, message, and data,
 * according [Rpc Errors](https://eips.ethereum.org/EIPS/eip-1193#rpc-errors)
 *
 * @param {EIP1193 | JSONRPC} code - The error code.
 * @param {string} message - The error message.
 * @param {DataTypeT} [data] - Optional data associated with the error.
 * @return {ProviderRpcError} - The constructed ProviderRpcError object.
 *
 * @remarks
 * **IMPORTANT: no sensitive data should be passed as any parameter.**
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
 * Checks if the given code is EIP1193 code.
 *
 * @param {EIP1193 | JSONRPC} code - The code to check.
 *
 * @return {boolean} - True if the code is an instance of EIP1193, otherwise false.
 */
function isEIP1193Code(code: EIP1193 | JSONRPC): code is EIP1193 {
    return Object.values(EIP1193).includes(code as EIP1193);
}

export { buildProviderError };
