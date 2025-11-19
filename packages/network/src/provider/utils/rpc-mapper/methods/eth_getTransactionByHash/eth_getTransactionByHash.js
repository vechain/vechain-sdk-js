"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethGetTransactionByHash = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const utils_1 = require("../../../../../utils");
const formatter_1 = require("../../../formatter");
const helpers_1 = require("../../../helpers");
const eth_chainId_1 = require("../eth_chainId");
const eth_getBlockByHash_1 = require("../eth_getBlockByHash");
/**
 * RPC Method eth_getTransactionByHash implementation
 *
 * @link [eth_getTransactionByHash](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_gettransactionbyhash)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The transaction hash to get as a hex string.
 * @returns the transaction at the given hash formatted to the RPC standard or null if the transaction does not exist.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
const ethGetTransactionByHash = async (thorClient, params) => {
    // Input validation
    if (params.length !== 1 || typeof params[0] !== 'string')
        throw new sdk_errors_1.JSONRPCInvalidParams('eth_getTransactionByHash', `Invalid input params for "eth_getTransactionByHash" method. See ${utils_1.RPC_DOCUMENTATION_URL} for details.`, { params });
    try {
        const [hash] = params;
        // Get the VeChainThor transaction
        const tx = await thorClient.transactions.getTransaction(hash);
        if (tx === null)
            return null;
        // Get the block containing the transaction
        const block = await (0, eth_getBlockByHash_1.ethGetBlockByHash)(thorClient, [
            tx.meta.blockID,
            false
        ]);
        if (block === null)
            return null;
        // Get the index of the transaction in the block
        const txIndex = (0, helpers_1.getTransactionIndexIntoBlock)(block, hash);
        // Get the chain id
        const chainId = await (0, eth_chainId_1.ethChainId)(thorClient);
        return formatter_1.transactionsFormatter.formatToRPCStandard(tx, chainId, txIndex);
    }
    catch (e) {
        throw new sdk_errors_1.JSONRPCInternalError('eth_getTransactionByHash()', 'Method "eth_getTransactionByHash" failed.', {
            params: (0, sdk_errors_1.stringifyData)(params),
            url: thorClient.httpClient.baseURL,
            innerError: (0, sdk_errors_1.stringifyData)(e)
        });
    }
};
exports.ethGetTransactionByHash = ethGetTransactionByHash;
