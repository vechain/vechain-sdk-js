import { ethAccounts } from '../eth_accounts/eth_accounts';
import { buildProviderError, JSONRPC } from '@vechain/sdk-errors';
import { type VechainProvider } from '../../../../../providers';

/**
 * RPC Method eth_requestAccounts implementation
 *
 * @param provider - Provider with ProviderInternalWallet instance to use.
 */
const ethRequestAccounts = async (
    provider?: VechainProvider
): Promise<string[]> => {
    // Get the accounts from the wallet
    const accounts = await ethAccounts(provider);

    // If there are no accounts, throw error
    // @NOTE: eth_accounts returns an empty array if there are no accounts OR wallet is not defined.
    // Here, instead, if there are no accounts into wallet OR wallet is not defined, we throw an error
    if (accounts.length === 0)
        throw buildProviderError(
            JSONRPC.DEFAULT,
            'No wallet is defined. Please, define a wallet before calling eth_requestAccounts.'
        );

    // Otherwise, return the accounts
    return accounts;
};

export { ethRequestAccounts };
