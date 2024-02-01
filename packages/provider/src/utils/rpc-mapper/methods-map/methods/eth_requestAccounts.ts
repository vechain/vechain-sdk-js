import { type Wallet } from '@vechain/vechain-sdk-wallet';
import { ethAccounts } from './eth_accounts';
import { buildProviderError, JSONRPC } from '@vechain/vechain-sdk-errors';

/**
 * RPC Method eth_requestAccounts implementation
 *
 * @param wallet - Wallet instance to use.
 */
const ethRequestAccounts = async (wallet?: Wallet): Promise<string[]> => {
    const accounts = await ethAccounts(wallet);

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
