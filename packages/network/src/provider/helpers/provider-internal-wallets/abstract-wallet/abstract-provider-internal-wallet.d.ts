import { type AvailableVeChainProviders, type VeChainSigner } from '../../../../signer';
import { type SignTransactionOptions } from '../../../../thor-client';
import { type ProviderInternalWallet, type ProviderInternalWalletAccount } from '../types';
/**
 * Abstract implementation of Provider internal wallet class.
 */
declare abstract class AbstractProviderInternalWallet implements ProviderInternalWallet {
    /**
     * List of accounts in the wallet.
     */
    readonly accounts: ProviderInternalWalletAccount[];
    /**
     * Options for signing a transaction with gasPayer.
     */
    readonly gasPayer?: SignTransactionOptions;
    /**
     * Create a new wallet.
     *
     * @param accounts List of accounts in the wallet.
     * @param options Optional options for signing a transaction with gasPayer.
     */
    constructor(accounts: ProviderInternalWalletAccount[], options?: {
        gasPayer?: SignTransactionOptions;
    });
    /**
     * Get a signer into the internal wallet provider
     * for the given address.
     *
     * @param parentProvider - The parent provider of the Internal Wallet.
     * @param addressOrIndex - Address of the account.
     * @returns The signer for the given address.
     */
    abstract getSigner(parentProvider: AvailableVeChainProviders, addressOrIndex?: string | number): Promise<VeChainSigner | null>;
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
    getSignerSync(parentProvider: AvailableVeChainProviders, addressOrIndex?: string | number): VeChainSigner | null;
    /**
     * Get the list of addresses in the wallet.
     *
     * @returns The list of addresses in the wallet.
     */
    abstract getAddresses(): Promise<string[]>;
    /**
     * SYNC Version of getAddresses()
     *
     * Get the list of addresses in the wallet.
     *
     * @returns The list of addresses in the wallet.
     */
    getAddressesSync(): string[];
    /**
     * Get an account given an address or an index.
     *
     * @param addressOrIndex - Address or index of the account.
     * @returns The account with the given address, or null if not found.
     */
    abstract getAccount(addressOrIndex?: string | number): Promise<ProviderInternalWalletAccount | null>;
    /**
     * SYNC Version of getAccount()
     *
     * Get an account given an address or an index.
     *
     * @param addressOrIndex - Address or index of the account.
     * @returns The account with the given address, or null if not found.
     * @throws {InvalidDataType}
     */
    getAccountSync(addressOrIndex?: string | number): ProviderInternalWalletAccount | null;
    /**
     * Get the options for signing a transaction with gasPayer (if any).
     *
     * @returns The options for signing a transaction with gasPayer.
     */
    abstract getGasPayer(): Promise<SignTransactionOptions | null>;
    /**
     * SYNC Version of getGasPayer()
     *
     * Get the options for signing a transaction with gasPayer (if any).
     *
     * @returns The options for signing a transaction with gasPayer.
     */
    getGasPayerSync(): SignTransactionOptions | null;
}
export { AbstractProviderInternalWallet };
//# sourceMappingURL=abstract-provider-internal-wallet.d.ts.map