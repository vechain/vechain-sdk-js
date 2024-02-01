/**
 * Represent a single account in a wallet.
 * Basically an account is a triple of **address**, **private key** and **public key**.
 */
interface WalletAccount {
    /**
     * Address of the account.
     */
    address: string;

    /**
     * Private key of the account.
     */
    privateKey: Buffer;

    /**
     * Public key of the account.
     */
    publicKey: Buffer;

    /**
     * ----- TEMPORARY COMMENT -----
     * Here we can add all useful methods for WalletAccount.
     * Currently, private key and public key are used by provider.
     * -----------------------------
     */
    // ... e.g. fromPrivateKey, fromPublicKey, ...
}

/**
 * Represent a wallet.
 * Basically a wallet is a list of {@link WalletAccount}.
 *
 * @note TO be compatible with vechain-sdk-wallet stack it is better
 * to implement this interface for each kind of wallet you want to use.
 *
 * Basically, this interface contains all data needed for a wallet that others can use.
 * e.g., Provider can use this interface to get the list of accounts in a wallet.
 */
interface Wallet {
    /**
     * List of accounts in the wallet.
     */
    accounts: WalletAccount[];

    /**
     * Get the list of accounts in the wallet.
     */
    getAddresses: () => Promise<string[]>;

    /**
     * ----- TEMPORARY COMMENT -----
     * Here we can add all useful methods wor wallet.
     * Currently, we have only getAddresses (needed by provider)
     * -----------------------------
     */
    // ... e.g. addAccount, removeAccount, ...
}

export { type Wallet, type WalletAccount };
