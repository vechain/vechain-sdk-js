import { type ThorClient } from '../../../../../thor-client';
import { type TransactionRPC } from '../../../formatter';
/**
 * RPC Method eth_getTransactionByBlockNumberAndIndex implementation
 *
 * @link [eth_getTransactionByBlockNumberAndIndex](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: block parameter, a hexadecimal block number (or best, latest, finalized).
 * * params[1]: transaction index position, a hexadecimal of the integer representing the position in the block.
 * @returns A transaction object, or null when no transaction was found.
 */
declare const ethGetTransactionByBlockNumberAndIndex: (thorClient: ThorClient, params: unknown[]) => Promise<TransactionRPC | null>;
export { ethGetTransactionByBlockNumberAndIndex };
//# sourceMappingURL=eth_getTransactionByBlockNumberAndIndex.d.ts.map