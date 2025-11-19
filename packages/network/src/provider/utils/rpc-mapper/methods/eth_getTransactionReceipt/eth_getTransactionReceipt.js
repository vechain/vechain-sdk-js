"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethGetTransactionReceipt = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const rpc_1 = require("../../../../../utils/const/rpc/rpc");
const formatter_1 = require("../../../formatter");
const eth_chainId_1 = require("../eth_chainId");
/**
 * RPC Method eth_getTransactionReceipt implementation
 *
 * @link [eth_getTransactionReceipt](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @param thorClient - The thor client instance to use.
 *
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The transaction hash to get as a hex string.
 *
 * @throws {ProviderRpcError} - Will throw an error if the retrieval of the transaction fails.
 */
const ethGetTransactionReceipt = async (thorClient, params) => {
    // Input validation
    if (params.length !== 1 || typeof params[0] !== 'string')
        throw new sdk_errors_1.JSONRPCInvalidParams('eth_getTransactionReceipt', `Invalid input params for "eth_getTransactionReceipt" method. See ${rpc_1.RPC_DOCUMENTATION_URL} for details.`, { params });
    // Invalid transaction ID
    if (!sdk_core_1.ThorId.isValid(params[0])) {
        throw new sdk_errors_1.JSONRPCInvalidParams('eth_getTransactionReceipt', 'Invalid transaction ID given as input. Input must be an hex string of length 64.', { params });
    }
    try {
        // Get hash by params
        const [hash] = params;
        // Get transaction receipt
        const receipt = await thorClient.transactions.getTransactionReceipt(hash);
        // Receipt is not null (transaction exists. This implies: Block exists and Transaction details exists)
        if (receipt !== null) {
            // Get the block containing the transaction. @note: It cannot be null!. If some error occurs, it will be thrown.
            const blockContainsTransaction = (await thorClient.blocks.getBlockExpanded(receipt.meta.blockID));
            // Get transaction detail. @note: It cannot be null!. If some error occurs, it will be thrown.
            const transactionDetail = await thorClient.transactions.getTransaction(hash);
            // Get the chain id
            const chainId = await (0, eth_chainId_1.ethChainId)(thorClient);
            // Initialize the result
            if (transactionDetail !== null)
                return formatter_1.transactionsFormatter.formatTransactionReceiptToRPCStandard(hash, receipt, transactionDetail, blockContainsTransaction, chainId);
            else
                return null;
        }
        else {
            return null;
        }
    }
    catch (e) {
        throw new sdk_errors_1.JSONRPCInternalError('eth_getTransactionReceipt()', 'Method "eth_getTransactionReceipt" failed.', {
            params: (0, sdk_errors_1.stringifyData)(params),
            url: thorClient.httpClient.baseURL,
            innerError: (0, sdk_errors_1.stringifyData)(e)
        });
    }
};
exports.ethGetTransactionReceipt = ethGetTransactionReceipt;
