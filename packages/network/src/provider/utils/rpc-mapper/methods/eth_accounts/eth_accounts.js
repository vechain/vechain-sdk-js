"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethAccounts = void 0;
/**
 * RPC Method eth_accounts implementation
 *
 * @param provider - Provider with ProviderInternalWallet instance to use.
 */
const ethAccounts = async (provider) => {
    // ProviderInternalWallet exists
    if (provider?.wallet !== undefined)
        return await provider?.wallet.getAddresses();
    // In error case (if wallet is not defined), return an empty array
    return [];
};
exports.ethAccounts = ethAccounts;
