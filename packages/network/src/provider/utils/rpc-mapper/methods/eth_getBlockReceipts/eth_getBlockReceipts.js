"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethGetBlockReceipts = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const eth_getBlockByNumber_1 = require("../eth_getBlockByNumber");
const eth_getTransactionReceipt_1 = require("../eth_getTransactionReceipt");
const utils_1 = require("../../../../../utils");
const sdk_core_1 = require("@vechain/sdk-core");
const eth_getBlockByHash_1 = require("../eth_getBlockByHash");
/**
 * RPC Method eth_getBlockReceipts implementation
 *
 * @link [eth_getBlockReceipts](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: blockNumber - The block number to get the receipts for as a hex string or "latest".
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
const ethGetBlockReceipts = async (thorClient, params) => {
    // Input validation
    if (params.length !== 1 || typeof params[0] !== 'string')
        throw new sdk_errors_1.JSONRPCInvalidParams('eth_getBlockReceipts', `Invalid input params for "eth_getBlockReceipts" method. See ${utils_1.RPC_DOCUMENTATION_URL} for details.`, { params });
    try {
        // Initialize the block number from the params
        const [blockIdentifier] = params;
        let block = null;
        if (sdk_core_1.HexUInt.isValid(blockIdentifier) && blockIdentifier.length === 66) {
            block = await (0, eth_getBlockByHash_1.ethGetBlockByHash)(thorClient, [
                blockIdentifier,
                true
            ]);
        }
        else {
            block = await (0, eth_getBlockByNumber_1.ethGetBlockByNumber)(thorClient, [
                blockIdentifier,
                true
            ]);
        }
        // Return the block receipts
        // Block is null, return null
        if (block === null)
            return null;
        // Block is not null, return the block receipts
        const transactionsIntoTheBlock = block.transactions;
        const transactionReceipts = [];
        for (const tx of transactionsIntoTheBlock) {
            const receipt = (await (0, eth_getTransactionReceipt_1.ethGetTransactionReceipt)(thorClient, [
                tx.hash
            ]));
            transactionReceipts.push(receipt);
        }
        return transactionReceipts;
    }
    catch (e) {
        throw new sdk_errors_1.JSONRPCInternalError('eth_getBlockReceipts()', 'Method "eth_getBlockReceipts" failed.', {
            params: (0, sdk_errors_1.stringifyData)(params),
            url: thorClient.httpClient.baseURL,
            innerError: (0, sdk_errors_1.stringifyData)(e)
        });
    }
};
exports.ethGetBlockReceipts = ethGetBlockReceipts;
