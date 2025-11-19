"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethGetBalance = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const const_1 = require("../../../const");
const utils_1 = require("../../../../../utils");
const sdk_core_1 = require("@vechain/sdk-core");
/**
 * RPC Method eth_getBalance implementation
 *
 * @link [eth_getBalance](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @note Only 'latest' and 'finalized' block numbers are supported.
 *
 * @param thorClient - ThorClient instance.
 * @param params - The standard array of rpc call parameters.
 *                * params[0]: The address to get the balance for as a hex string.
 *                * params[1]: The block number to get the balance at as a hex string or "latest".
 * @returns the balance of the account at the given address formatted to the RPC standard.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
const ethGetBalance = async (thorClient, params) => {
    // Input validation
    if (params.length !== 2 ||
        typeof params[0] !== 'string' ||
        (typeof params[1] !== 'object' && typeof params[1] !== 'string'))
        throw new sdk_errors_1.JSONRPCInvalidParams('eth_getBalance', `Invalid input params for "eth_getBalance" method. See ${utils_1.RPC_DOCUMENTATION_URL} for details.`, { params });
    try {
        const [address, block] = params;
        // Get the account details
        const accountDetails = await thorClient.accounts.getAccount(sdk_core_1.Address.of(address), {
            revision: (0, const_1.DefaultBlockToRevision)(block)
        });
        return accountDetails.balance;
    }
    catch (e) {
        throw new sdk_errors_1.JSONRPCInternalError('eth_getBalance()', 'Method "eth_getBalance" failed.', {
            params: (0, sdk_errors_1.stringifyData)(params),
            url: thorClient.httpClient.baseURL,
            innerError: (0, sdk_errors_1.stringifyData)(e)
        });
    }
};
exports.ethGetBalance = ethGetBalance;
