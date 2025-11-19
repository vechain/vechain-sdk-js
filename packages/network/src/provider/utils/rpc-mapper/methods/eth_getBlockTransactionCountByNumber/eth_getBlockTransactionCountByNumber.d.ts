import type { ThorClient } from '../../../../../thor-client';
/**
 * RPC Method eth_getBlockTransactionCountByNumber implementation
 *
 * @link [eth_getBlockTransactionCountByNumber](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The block hash of block to get.
 * @returns The number of transactions in the block with the given block hash.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
declare const ethGetBlockTransactionCountByNumber: (thorClient: ThorClient, params: unknown[]) => Promise<number>;
export { ethGetBlockTransactionCountByNumber };
//# sourceMappingURL=eth_getBlockTransactionCountByNumber.d.ts.map