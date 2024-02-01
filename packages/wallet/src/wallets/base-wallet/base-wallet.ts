import { type Wallet, type WalletAccount } from './types';

/**
 * Base wallet class.
 *
 * This is the most basic wallet implementation we can have.
 */
class BaseWallet implements Wallet {
    accounts: WalletAccount[];

    /**
     * Create a new wallet.
     *
     * ----- TEMPORARY COMMENT -----
     * This is the most basic wallet implementation we can have.
     * Probably we can add later a factory method to create a wallet from a list of private keys.
     * Or, even better user into provider will use HDWallet.
     * -----------------------------
     *
     * @param accounts List of accounts in the wallet.
     */
    constructor(accounts: WalletAccount[]) {
        this.accounts = accounts;
    }

    /**
     * Get the list of accounts in the wallet.
     */
    async getAddresses(): Promise<string[]> {
        const addresses = this.accounts.map((account) => account.address);
        return await Promise.resolve(addresses);
    }
}

export { BaseWallet };
