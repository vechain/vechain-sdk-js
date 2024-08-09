import { ethAccounts } from '../eth_accounts/eth_accounts';
import { JSONRPCInvalidParams, stringifyData } from '@vechain/sdk-errors';
import { type VeChainProvider } from '../../../../../providers';

/**
 * RPC Method eth_requestAccounts implementation
 *
 * @param provider - Provider with ProviderInternalWallet instance to use.
 * @throws {JSONRPCInvalidParams}
 */
const ethRequestAccounts = async (
    provider?: VeChainProvider
): Promise<string[]> => {
    // Get the accounts from the wallet
    const accounts = await ethAccounts(provider);

    // If there are no accounts, throw error
    // @NOTE: eth_accounts returns an empty array if there are no accounts OR wallet is not defined.
    // Here, instead, if there are no accounts into wallet OR wallet is not defined, we throw an error
    if (accounts.length === 0)
        throw new JSONRPCInvalidParams(
            'eth_getTransactionReceipt()',
            -32602,
            'Method "ethRequestAccounts" failed.',
            {
                provider: stringifyData(provider)
            }
        );

    // Otherwise, return the accounts
    return accounts;
};

export { ethRequestAccounts };
