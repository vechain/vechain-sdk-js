import { type VeChainProvider } from '../../../../../providers';

/**
 * RPC Method eth_accounts implementation
 *
 * @param provider - Provider with ProviderInternalWallet instance to use.
 */
const ethAccounts = async (provider?: VeChainProvider): Promise<string[]> => {
    // ProviderInternalWallet exists
    if (provider?.wallet !== undefined)
        return await provider?.wallet.getAddresses();

    // In error case (if wallet is not defined), return an empty array
    return [];
};

export { ethAccounts };
