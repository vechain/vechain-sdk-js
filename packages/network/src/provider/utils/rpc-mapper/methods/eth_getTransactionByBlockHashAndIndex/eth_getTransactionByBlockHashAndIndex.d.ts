import { type ThorClient } from '../../../../../thor-client';
import { type TransactionRPC } from '../../../formatter';
/**
 * RPC Method eth_getTransactionByBlockHashAndIndex implementation
 *
 * @link [eth_getTransactionByBlockHashAndIndex](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
declare const ethGetTransactionByBlockHashAndIndex: (thorClient: ThorClient, params: unknown[]) => Promise<TransactionRPC | null>;
export { ethGetTransactionByBlockHashAndIndex };
//# sourceMappingURL=eth_getTransactionByBlockHashAndIndex.d.ts.map