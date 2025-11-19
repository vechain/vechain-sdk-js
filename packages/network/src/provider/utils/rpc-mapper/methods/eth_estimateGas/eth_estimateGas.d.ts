import { type ThorClient } from '../../../../../thor-client';
/**
 * RPC Method eth_estimateGas implementation
 *
 * @link [eth_estimateGas](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @note At the moment only the `to`, `value` and `data` fields are supported.
 *
 * @param thorClient - ThorClient instance.
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The transaction call object.
 *                 * params[1]: A string representing a block number, or one of the string tags latest, earliest, or pending.
 * @returns A hexadecimal number representing the estimation of the gas for a given transaction.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError, JSONRPCTransactionRevertError}
 */
declare const ethEstimateGas: (thorClient: ThorClient, params: unknown[]) => Promise<string>;
export { ethEstimateGas };
//# sourceMappingURL=eth_estimateGas.d.ts.map