import { type SignTransactionOptions } from '../../../thor-client';
import {
    type AvailableVeChainProviders,
    type VeChainSigner
} from '../../../signer';

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
     * @param addressOrIndex - Address or index of the account.
     * @returns The signer for the given address.
     */
    getSigner: (
        parentProvider: AvailableVeChainProviders,
        addressOrIndex?: string | number
    ) => Promise<VeChainSigner | null>;

    /**
     * SYNC Version of getSigner()
     *
     * Get a signer into the internal wallet provider
     * for the given address.
     *
     * @param parentProvider - The parent provider of the Internal Wallet.
     * @param addressOrIndex - Address or index of the account.
     * @returns The signer for the given address.
     */
    getSignerSync: (
        parentProvider: AvailableVeChainProviders,
        addressOrIndex?: string | number
    ) => VeChainSigner | null;

    /**
     * Get the list of addresses in the wallet.
     *
     * @returns The list of addresses in the wallet.
     */
    getAddresses: () => Promise<string[]>;

    /**
     * SYNC Version of getAddresses()
     *
     * Get the list of addresses in the wallet.
     *
     * @returns The list of addresses in the wallet.
     */
    getAddressesSync: () => string[];

    /**
     * Get an account given an address or an index.
     *
     * @param addressOrIndex - Address or index of the account.
     * @returns The account with the given address, or null if not found.
     */
    getAccount: (
        addressOrIndex?: string | number
    ) => Promise<ProviderInternalWalletAccount | null>;

    /**
     * SYNC Version of getAccount()
     *
     * Get an account given an address or an index.
     *
     * @param addressOrIndex - Address or index of the account.
     * @returns The account with the given address, or null if not found.
     */
    getAccountSync: (
        addressOrIndex?: string | number
    ) => ProviderInternalWalletAccount | null;

    /**
     * Get the options for signing a transaction with delegator (if any).
     *
     * @returns The options for signing a transaction with delegator.
     */
    getDelegator: () => Promise<SignTransactionOptions | null>;

    /**
     * SYNC Version of getDelegator()
     *
     * Get the options for signing a transaction with delegator (if any).
     *
     * @returns The options for signing a transaction with delegator.
     */
    getDelegatorSync: () => SignTransactionOptions | null;
}

export { type ProviderInternalWallet, type ProviderInternalWalletAccount };
