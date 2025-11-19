"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethRequestAccounts = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const eth_accounts_1 = require("../eth_accounts/eth_accounts");
/**
 * RPC Method eth_requestAccounts implementation
 *
 * @param provider - Provider with ProviderInternalWallet instance to use.
 * @throws {JSONRPCInvalidParams}
 */
const ethRequestAccounts = async (provider) => {
    // Get the accounts from the wallet
    const accounts = await (0, eth_accounts_1.ethAccounts)(provider);
    // If there are no accounts, throw error
    // @NOTE: eth_accounts returns an empty array if there are no accounts OR wallet is not defined.
    // Here, instead, if there are no accounts into wallet OR wallet is not defined, we throw an error
    if (accounts.length === 0)
        throw new sdk_errors_1.JSONRPCInvalidParams('eth_requestAccounts()', 'Method "eth_requestAccounts" failed.', {
            provider: (0, sdk_errors_1.stringifyData)(provider)
        });
    // Otherwise, return the accounts
    return accounts;
};
exports.ethRequestAccounts = ethRequestAccounts;
