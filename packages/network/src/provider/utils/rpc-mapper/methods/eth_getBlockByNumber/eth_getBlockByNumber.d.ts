import { type ThorClient } from '../../../../../thor-client';
import { type BlocksRPC } from '../../../formatter';
/**
 * RPC Method eth_getBlockByNumber implementation
 *
 * @link [eth_getBlockByNumber](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @note
 *  * Standard RPC method `eth_getBlockByNumber` support following block numbers: hex number of block, 'earliest', 'latest', 'safe', 'finalized', 'pending'. (@see https://ethereum.org/en/developers/docs/apis/json-rpc#default-block)
 *  * Currently, VeChainonly supports hex number of block, 'latest' and 'finalized'.
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The block number to get as a hex string or "latest" or "finalized".
 *                 * params[1]: The transaction detail flag. If true, the block will contain the transaction details, otherwise it will only contain the transaction hashes.
 * @returns the block at the given block number formatted to the RPC standard or null if the block does not exist.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
declare const ethGetBlockByNumber: (thorClient: ThorClient, params: unknown[]) => Promise<BlocksRPC | null>;
export { ethGetBlockByNumber };
//# sourceMappingURL=eth_getBlockByNumber.d.ts.map