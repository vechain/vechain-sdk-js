import { type ThorClient } from '../../../../../thor-client';
import { type TransactionReceiptRPC } from '../../../formatter';
/**
 * RPC Method eth_getBlockReceipts implementation
 *
 * @link [eth_getBlockReceipts](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: blockNumber - The block number to get the receipts for as a hex string or "latest".
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
declare const ethGetBlockReceipts: (thorClient: ThorClient, params: unknown[]) => Promise<TransactionReceiptRPC[] | null>;
export { ethGetBlockReceipts };
//# sourceMappingURL=eth_getBlockReceipts.d.ts.map