import {
    type SignTransactionOptions,
    type ThorClient
} from '@vechain/sdk-network';
import { type Transaction, type TransactionBody } from '@vechain/sdk-core';

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
    privateKey?: Buffer;

    /**
     * Public key of the account.
     */
    publicKey?: Buffer;
}

/**
 * Represent a wallet.
 * Basically a wallet is a list of {@link WalletAccount}.
 *
 * @note To be compatible with sdk-wallet stack it is better
 * to implement this interface for each kind of wallet you want to use.
 *
 * Basically, this interface contains all data needed for a wallet that others can use.
 * e.g., Provider can use this interface to get the list of accounts in a wallet.
 */
interface Wallet {
    /**
     * Options for signing a transaction with delegator.
     */
    delegator?: SignTransactionOptions;

    /**
     * List of accounts in the wallet.
     */
    accounts: WalletAccount[];

    /**
     * Get the list of addresses in the wallet.
     *
     * @returns The list of addresses in the wallet.
     */
    getAddresses: () => Promise<string[]>;

    /**
     * Get an account by address.
     *
     * @param address - Address of the account.
     * @returns The account with the given address, or null if not found.
     */
    getAccount: (address: string) => Promise<WalletAccount | null>;

    /**
     * Get the options for signing a transaction with delegator (if any).
     *
     * @returns The options for signing a transaction with delegator.
     */
    getDelegator: () => Promise<SignTransactionOptions | null>;

    /**
     * Sign a transaction.
     * This method must be implemented to define how to sign a transaction with the wallet.
     *
     * @param transactionOrigin - The origin address of the transaction (the 'from' field).
     * @param transactionToSign - The transaction to sign.
     * @returns The signed transaction.
     */
    signTransaction: (
        transactionOrigin: string,
        transactionToSign: TransactionBody
    ) => Promise<Transaction>;

    /**
     * Sign a transaction with the delegator.
     * This method must be implemented to define how to sign a transaction with the delegator.
     *
     * @param transactionOrigin - The origin address of the transaction (the 'from' field).
     * @param transactionToSign - The transaction to sign.
     * @param thorClient - The ThorClient instance used to sign using the url
     * @returns The transaction signed by the delegator.
     */
    signTransactionWithDelegator: (
        transactionOrigin: string,
        transactionToSign: TransactionBody,
        thorClient: ThorClient
    ) => Promise<Transaction>;

    /**
     * Here we can add all useful methods for wallet.
     * Currently, we have only getAddresses (needed by provider)
     */
    // ... e.g. addAccount, removeAccount, ...
}

export { type Wallet, type WalletAccount };
