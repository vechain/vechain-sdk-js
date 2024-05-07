import { type SignTransactionOptions } from '../../../thor-client';
import { type VechainSigner } from '../../../signer';

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
     * Get a signer into the internal wallet provider
     * for the given address.
     *
     * @param parentProvider - The parent provider of the Internal Wallet.
     * @param address - Address of the account.
     * @returns The signer for the given address.
     */
    getSigner: (
        parentProvider: TProviderType,
        address: string
    ) => Promise<VechainSigner | null>;

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
}

export { type ProviderInternalWallet, type ProviderInternalWalletAccount };
