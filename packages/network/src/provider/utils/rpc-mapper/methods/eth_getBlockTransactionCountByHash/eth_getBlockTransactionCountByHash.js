"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethGetBlockTransactionCountByHash = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const eth_getBlockByHash_1 = require("../eth_getBlockByHash");
const sdk_core_1 = require("@vechain/sdk-core");
const utils_1 = require("../../../../../utils");
/**
 * RPC Method eth_getBlockTransactionCountByHash implementation
 *
 * @link [eth_getBlockTransactionCountByHash](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The block hash of block to get.
 * @returns The number of transactions in the block with the given block hash.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
const ethGetBlockTransactionCountByHash = async (thorClient, params) => {
    // Input validation
    if (params.length !== 1 ||
        typeof params[0] !== 'string' ||
        !sdk_core_1.ThorId.isValid(params[0]))
        throw new sdk_errors_1.JSONRPCInvalidParams('eth_getBlockTransactionCountByHash', `Invalid input params for "eth_getBlockTransactionCountByHash" method. See ${utils_1.RPC_DOCUMENTATION_URL} for details.`, { params });
    const block = await (0, eth_getBlockByHash_1.ethGetBlockByHash)(thorClient, [params[0], false]);
    if (block !== null)
        return block.transactions.length;
    return 0;
};
exports.ethGetBlockTransactionCountByHash = ethGetBlockTransactionCountByHash;
