import { type ThorClient } from '../../../../../thor-client';
import { type TransactionRPC } from '../../../formatter';
/**
 * RPC Method eth_getTransactionByHash implementation
 *
 * @link [eth_getTransactionByHash](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_gettransactionbyhash)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The transaction hash to get as a hex string.
 * @returns the transaction at the given hash formatted to the RPC standard or null if the transaction does not exist.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
declare const ethGetTransactionByHash: (thorClient: ThorClient, params: unknown[]) => Promise<TransactionRPC | null>;
export { ethGetTransactionByHash };
//# sourceMappingURL=eth_getTransactionByHash.d.ts.map