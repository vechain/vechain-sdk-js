"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethGetTransactionByBlockNumberAndIndex = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const utils_1 = require("../../../../../utils");
const eth_getBlockByNumber_1 = require("../eth_getBlockByNumber");
const eth_getTransactionByHash_1 = require("../eth_getTransactionByHash");
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
const ethGetTransactionByBlockNumberAndIndex = async (thorClient, params) => {
    if (params.length !== 2 ||
        typeof params[0] !== 'string' ||
        typeof params[1] !== 'string')
        throw new sdk_errors_1.JSONRPCInvalidParams('eth_getTransactionByBlockNumberAndIndex', `Invalid input params for "eth_getTransactionByBlockNumberAndIndex" method. See ${utils_1.RPC_DOCUMENTATION_URL} for details.`, { params });
    try {
        const [blockHash, index] = params;
        // Get the block containing the transactions
        const block = (await (0, eth_getBlockByNumber_1.ethGetBlockByNumber)(thorClient, [
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
        throw new sdk_errors_1.JSONRPCInternalError('eth_getTransactionByBlockNumberAndIndex()', 'Method "eth_getTransactionByBlockNumberAndIndex" failed.', {
            params: (0, sdk_errors_1.stringifyData)(params),
            url: thorClient.httpClient.baseURL,
            innerError: (0, sdk_errors_1.stringifyData)(e)
        });
    }
};
exports.ethGetTransactionByBlockNumberAndIndex = ethGetTransactionByBlockNumberAndIndex;
