"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethGetTransactionByBlockHashAndIndex = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const utils_1 = require("../../../../../utils");
const eth_getBlockByHash_1 = require("../eth_getBlockByHash");
const eth_getTransactionByHash_1 = require("../eth_getTransactionByHash");
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
const ethGetTransactionByBlockHashAndIndex = async (thorClient, params) => {
    if (params.length !== 2 ||
        typeof params[0] !== 'string' ||
        typeof params[1] !== 'string')
        throw new sdk_errors_1.JSONRPCInvalidParams('eth_getTransactionByBlockHashAndIndex', `Invalid input params for "eth_getTransactionByBlockHashAndIndex" method. See ${utils_1.RPC_DOCUMENTATION_URL} for details.`, { params });
    try {
        const [blockHash, index] = params;
        // Get the block containing the transactions
        const block = (await (0, eth_getBlockByHash_1.ethGetBlockByHash)(thorClient, [
            blockHash,
            false
        ]));
        for (const transactionHash of block.transactions) {
            const transaction = (await (0, eth_getTransactionByHash_1.ethGetTransactionByHash)(thorClient, [
                transactionHash
            ]));
            if (transaction.transactionIndex === index) {
                return transaction;
            }
        }
        return null;
    }
    catch (e) {
        throw new sdk_errors_1.JSONRPCInternalError('eth_getTransactionByBlockHashAndIndex()', 'Method "eth_getTransactionByBlockHashAndIndex" failed.', {
            params: (0, sdk_errors_1.stringifyData)(params),
            url: thorClient.httpClient.baseURL,
            innerError: (0, sdk_errors_1.stringifyData)(e)
        });
    }
};
exports.ethGetTransactionByBlockHashAndIndex = ethGetTransactionByBlockHashAndIndex;
