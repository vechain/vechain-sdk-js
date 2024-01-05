/**
 * Errors implementation of EIP-1193 provider standard.
 *
 * @see https://eips.ethereum.org/EIPS/eip-1193#errors
 * @see https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
import { ErrorBase } from '../base';

/**
 * HTTP Client Error.
 *
 * @NOTE: code parameter is required to be fully compatible with EIP-1193.
 * When we will throw error, we will use EIP1193.CODE_..., but for syntactic sugar
 * we will have code as number into error data.
 */
interface EIP1193ProviderRpcErrorData {
    code: 4001 | 4100 | 4200 | 4900 | 4901;
    data?: unknown;
}

/**
 * The user rejected the request.
 */
class EIP1193UserRejectedRequest extends ErrorBase<
    EIP1193.USER_REJECTED_REQUEST,
    EIP1193ProviderRpcErrorData
> {}

/**
 * The requested method and/or account has not been authorized by the user.
 */
class EIP1193Unauthorized extends ErrorBase<
    EIP1193.UNAUTHORIZED,
    EIP1193ProviderRpcErrorData
> {}

/**
 * The Provider does not support the requested method.
 */
class EIP1193UnsupportedMethod extends ErrorBase<
    EIP1193.UNSUPPORTED_METHOD,
    EIP1193ProviderRpcErrorData
> {}

/**
 * The Provider is disconnected from all chains.
 */
class EIP1193Disconnected extends ErrorBase<
    EIP1193.DISCONNECTED,
    EIP1193ProviderRpcErrorData
> {}

/**
 * The Provider is not connected to the requested chain.
 *
 * @NOTE 4900 is intended to indicate that the Provider is disconnected from all chains,
 * while 4901 is intended to indicate that the Provider is disconnected from a specific chain only.
 * In other words, 4901 implies that the Provider is connected to other chains, just not the requested one.
 */
class EIP1193ChainDisconnected extends ErrorBase<
    EIP1193.CHAIN_DISCONNECTED,
    EIP1193ProviderRpcErrorData
> {}

/**
 * Errors enum.
 *
 * @see https://eips.ethereum.org/EIPS/eip-1193#rpc-errors
 */
enum EIP1193 {
    /**
     * The user rejected the request.
     */
    USER_REJECTED_REQUEST = 'USER_REJECTED_REQUEST',

    /**
     * The requested method and/or account has not been authorized by the user.
     */
    UNAUTHORIZED = 'UNAUTHORIZED',

    /**
     * The Provider does not support the requested method.
     */
    UNSUPPORTED_METHOD = 'UNSUPPORTED METHOD',

    /**
     * The Provider is disconnected from all chains.
     */
    DISCONNECTED = 'DISCONNECTED',

    /**
     * The Provider is not connected to the requested chain.
     *
     * @NOTE 4900 is intended to indicate that the Provider is disconnected from all chains,
     * while 4901 is intended to indicate that the Provider is disconnected from a specific chain only.
     * In other words, 4901 implies that the Provider is connected to other chains, just not the requested one.
     */
    CHAIN_DISCONNECTED = 'CHAIN_DISCONNECTED'
}

/**
 * Get correct error code by error message enum.
 */
const getEIP1193ErrorCode = (
    error: EIP1193
): 4001 | 4100 | 4200 | 4900 | 4901 => {
    switch (error) {
        case EIP1193.USER_REJECTED_REQUEST:
            return 4001;
        case EIP1193.UNAUTHORIZED:
            return 4100;
        case EIP1193.UNSUPPORTED_METHOD:
            return 4200;
        case EIP1193.DISCONNECTED:
            return 4900;
        case EIP1193.CHAIN_DISCONNECTED:
            return 4901;
    }
};

export {
    type EIP1193ProviderRpcErrorData,
    EIP1193UserRejectedRequest,
    EIP1193Unauthorized,
    EIP1193UnsupportedMethod,
    EIP1193Disconnected,
    EIP1193ChainDisconnected,
    EIP1193,
    getEIP1193ErrorCode
};
