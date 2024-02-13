import { type VechainProvider } from '../../../../providers';

/**
 * RPC Method eth_accounts implementation
 *
 * @param wallet - Wallet instance to use.
 */
const ethAccounts = async (provider?: VechainProvider): Promise<string[]> => {
    // Wallet exists
    if (provider?.wallet !== undefined)
        return await provider?.wallet.getAddresses();

    // In error case (if wallet is not defined), return an empty array
    return [];
};

export { ethAccounts };
