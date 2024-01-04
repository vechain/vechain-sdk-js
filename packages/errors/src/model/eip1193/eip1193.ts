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
 *
 * @example
 * ```typescript
 * // ... some code that throw errors ...
 *
 * throw buildError(
 *     EIP1193.CODE_4001,
 *     4001, // <- this is required to be fully compatible with EIP-1193
 *     { ... User Rejected Request ... },
 * );
 *
 * ```
 */
interface EIP1193ProviderRpcErrorData {
    code: number;
    data?: unknown;
}

/**
 * The user rejected the request.
 */
class EIP1193UserRejectedRequest extends ErrorBase<
    EIP1193.CODE_4001,
    EIP1193ProviderRpcErrorData
> {}

/**
 * The requested method and/or account has not been authorized by the user.
 */
class EIP1193Unauthorized extends ErrorBase<
    EIP1193.CODE_4100,
    EIP1193ProviderRpcErrorData
> {}

/**
 * The Provider does not support the requested method.
 */
class EIP1193UnsupportedMethod extends ErrorBase<
    EIP1193.CODE_4200,
    EIP1193ProviderRpcErrorData
> {}

/**
 * The Provider is disconnected from all chains.
 */
class EIP1193Disconnected extends ErrorBase<
    EIP1193.CODE_4900,
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
    EIP1193.CODE_4901,
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
    CODE_4001 = 'User Rejected Request',

    /**
     * The requested method and/or account has not been authorized by the user.
     */
    CODE_4100 = 'Unauthorized',

    /**
     * The Provider does not support the requested method.
     */
    CODE_4200 = 'Unsupported Method',

    /**
     * The Provider is disconnected from all chains.
     */
    CODE_4900 = 'Disconnected',

    /**
     * The Provider is not connected to the requested chain.
     *
     * @NOTE 4900 is intended to indicate that the Provider is disconnected from all chains,
     * while 4901 is intended to indicate that the Provider is disconnected from a specific chain only.
     * In other words, 4901 implies that the Provider is connected to other chains, just not the requested one.
     */
    CODE_4901 = 'Chain Disconnected'
}

export {
    type EIP1193ProviderRpcErrorData,
    EIP1193UserRejectedRequest,
    EIP1193Unauthorized,
    EIP1193UnsupportedMethod,
    EIP1193Disconnected,
    EIP1193ChainDisconnected,
    EIP1193
};
