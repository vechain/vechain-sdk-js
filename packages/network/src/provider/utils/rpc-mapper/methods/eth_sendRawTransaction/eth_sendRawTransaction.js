"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethSendRawTransaction = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const utils_1 = require("../../../../../utils");
/**
 * RPC Method eth_sendRawTransaction implementation
 *
 * @link [eth_sendrawtransaction](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The signed transaction data as a hex string.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
const ethSendRawTransaction = async (thorClient, params) => {
    // Input validation
    if (params.length !== 1 || typeof params[0] !== 'string')
        throw new sdk_errors_1.JSONRPCInvalidParams('eth_sendRawTransaction()', `Invalid input params for "eth_sendRawTransaction" method. See ${utils_1.RPC_DOCUMENTATION_URL} for details.`, { params });
    // Invalid transaction encoded data
    if (!sdk_core_1.Hex.isValid0x(params[0])) {
        throw new sdk_errors_1.JSONRPCInvalidParams('eth_sendRawTransaction()', 'Invalid transaction encoded data given as input. Input must be a hex string.', { params });
    }
    try {
        const [signedTransactionData] = params;
        const sentTransaction = await thorClient.transactions.sendRawTransaction(signedTransactionData);
        return sentTransaction.id;
    }
    catch (error) {
        throw new sdk_errors_1.JSONRPCInternalError('eth_sendRawTransaction()', 'Method "eth_sendRawTransaction" failed.', {
            params: (0, sdk_errors_1.stringifyData)(params),
            url: thorClient.httpClient.baseURL
        }, error);
    }
};
exports.ethSendRawTransaction = ethSendRawTransaction;
