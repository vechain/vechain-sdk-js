"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethGetBlockTransactionCountByNumber = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const utils_1 = require("../../../../../utils");
const eth_getBlockByNumber_1 = require("../eth_getBlockByNumber");
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
const ethGetBlockTransactionCountByNumber = async (thorClient, params) => {
    // Input validation
    if (params.length !== 1 || typeof params[0] !== 'string')
        throw new sdk_errors_1.JSONRPCInvalidParams('eth_getBlockTransactionCountByNumber', `Invalid input params for "eth_getBlockTransactionCountByNumber" method. See ${utils_1.RPC_DOCUMENTATION_URL} for details.`, { params });
    const block = await (0, eth_getBlockByNumber_1.ethGetBlockByNumber)(thorClient, [params[0], true]);
    if (block !== null)
        return block.transactions.length;
    return 0;
};
exports.ethGetBlockTransactionCountByNumber = ethGetBlockTransactionCountByNumber;
