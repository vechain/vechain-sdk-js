import { type BlocksRPC } from '../../../formatter';
import { type ThorClient } from '../../../../../thor-client';
/**
 * RPC Method eth_getBlockByHash implementation
 *
 * @link [eth_getBlockByHash](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The block hash of block to get.
 *                 * params[1]: The transaction hydrated detail flag. If true, the block will contain the transaction details, otherwise it will only contain the transaction hashes.
 * @returns the block at the given block hash formatted to the RPC standard or null if the block does not exist.
 * @note Ethereum block hash is passed to Thor as the block id.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
declare const ethGetBlockByHash: (thorClient: ThorClient, params: unknown[]) => Promise<BlocksRPC | null>;
export { ethGetBlockByHash };
//# sourceMappingURL=eth_getBlockByHash.d.ts.map