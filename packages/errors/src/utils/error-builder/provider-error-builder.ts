import {
    EIP1193,
    getEIP1193ErrorCode,
    getJSONRPCErrorCode,
    type JSONRPC,
    ProviderRpcError
} from '../../model';
import { type DataType, ErrorClassMap, type ErrorCode } from '../../types';

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

export { buildProviderError };
