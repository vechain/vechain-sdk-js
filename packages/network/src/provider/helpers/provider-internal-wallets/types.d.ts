import {
    type SignTransactionOptions,
    type ThorClient
} from '@vechain/sdk-network';
import { type Transaction, type TransactionBody } from '@vechain/sdk-core';

/**
 * Represent a single account in a provider internal wallet.
 * Basically an account is a triple of **address**, **private key** and **public key**.
 */
interface ProviderInternalWalletAccount {
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
 * Represent a provider internal base wallet.
 * Basically it is a list {@link ProviderInternalWalletAccount} used to contain account data into provider.
 * A provider internal wallet is able to generate a signer when it is needed by the provider.
 *
 * e.g., Provider can need the Signer with methods like eth_sendTransaction, ...
 *
 * @note To be compatible with provider-internal-wallet stack it is better
 * to implement this interface for each kind of provider internal wallet you want to use.
 */
interface ProviderInternalWallet {
    /**
     * Options for signing a transaction with delegator.
     */
    delegator?: SignTransactionOptions;

    /**
     * List of accounts in the wallet.
     */
    accounts: ProviderInternalWalletAccount[];

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
    getAccount: (
        address: string
    ) => Promise<ProviderInternalWalletAccount | null>;

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
}

export { type ProviderInternalWallet, type ProviderInternalWalletAccount };
