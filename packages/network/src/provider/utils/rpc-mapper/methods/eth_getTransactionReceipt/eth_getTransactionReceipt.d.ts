import { type ThorClient } from '../../../../../thor-client';
import { type TransactionReceiptRPC } from '../../../formatter';
/**
 * RPC Method eth_getTransactionReceipt implementation
 *
 * @link [eth_getTransactionReceipt](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @param thorClient - The thor client instance to use.
 *
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The transaction hash to get as a hex string.
 *
 * @throws {ProviderRpcError} - Will throw an error if the retrieval of the transaction fails.
 */
declare const ethGetTransactionReceipt: (thorClient: ThorClient, params: unknown[]) => Promise<TransactionReceiptRPC | null>;
export { ethGetTransactionReceipt };
//# sourceMappingURL=eth_getTransactionReceipt.d.ts.map