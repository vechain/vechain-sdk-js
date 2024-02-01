import { type Wallet } from '@vechain/vechain-sdk-wallet';

/**
 * RPC Method eth_accounts implementation
 *
 * @param wallet - Wallet instance to use.
 */
const ethAccounts = async (wallet?: Wallet): Promise<string[]> => {
    // Wallet exists
    if (wallet !== undefined) return await wallet.getAddresses();

    // In error case (if wallet is not defined), return an empty array
    return [];
};

export { ethAccounts };
