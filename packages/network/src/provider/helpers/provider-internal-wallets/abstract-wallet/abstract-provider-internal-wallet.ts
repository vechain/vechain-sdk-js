import { Address, HexUInt } from '@vechain/sdk-core';
import { InvalidDataType } from '@vechain/sdk-errors';
import {
    type AvailableVeChainProviders,
    VeChainPrivateKeySigner,
    type VeChainSigner
} from '../../../../signer';
import {
    DelegationHandler,
    type SignTransactionOptions
} from '../../../../thor-client';
import {
    type ProviderInternalWallet,
    type ProviderInternalWalletAccount
} from '../types';

/**
 * Abstract implementation of Provider internal wallet class.
 */
abstract class AbstractProviderInternalWallet
    implements ProviderInternalWallet
{
    /**
     * List of accounts in the wallet.
     */
    readonly accounts: ProviderInternalWalletAccount[];

    /**
     * Options for signing a transaction with delegator.
     */
    readonly delegator?: SignTransactionOptions;

    /**
     * Create a new wallet.
     *
     * @param accounts List of accounts in the wallet.
     * @param options Optional options for signing a transaction with delegator.
     */
    constructor(
        accounts: ProviderInternalWalletAccount[],
        options?: {
            delegator?: SignTransactionOptions;
        }
    ) {
        this.accounts = accounts;
        this.delegator = options?.delegator;
    }

    /**
     * Get a signer into the internal wallet provider
     * for the given address.
     *
     * @param parentProvider - The parent provider of the Internal Wallet.
     * @param addressOrIndex - Address of the account.
     * @returns The signer for the given address.
     */
    abstract getSigner(
        parentProvider: AvailableVeChainProviders,
        addressOrIndex?: string | number
    ): Promise<VeChainSigner | null>;

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
    getSignerSync(
        parentProvider: AvailableVeChainProviders,
        addressOrIndex?: string | number
    ): VeChainSigner | null {
        // Get the account from the wallet
        const signerAccount = this.getAccountSync(addressOrIndex);

        // Return a new signer (if exists)
        if (signerAccount?.privateKey !== undefined) {
            return new VeChainPrivateKeySigner(
                signerAccount.privateKey,
                parentProvider
            );
        }

        // Return null if the account is not found
        return null;
    }

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
    getAddressesSync(): string[] {
        return this.accounts.map((account) => account.address);
    }

    /**
     * Get an account given an address or an index.
     *
     * @param addressOrIndex - Address or index of the account.
     * @returns The account with the given address, or null if not found.
     */
    abstract getAccount(
        addressOrIndex?: string | number
    ): Promise<ProviderInternalWalletAccount | null>;

    /**
     * SYNC Version of getAccount()
     *
     * Get an account given an address or an index.
     *
     * @param addressOrIndex - Address or index of the account.
     * @returns The account with the given address, or null if not found.
     * @throws {InvalidDataType}
     */
    getAccountSync(
        addressOrIndex?: string | number
    ): ProviderInternalWalletAccount | null {
        if (
            addressOrIndex === undefined ||
            typeof addressOrIndex === 'number'
        ) {
            return this.accounts[addressOrIndex ?? 0] ?? null;
        }

        // Check if the address is valid
        if (!Address.isValid(addressOrIndex)) {
            throw new InvalidDataType(
                'AbstractProviderInternalWallet.getAccountSync()',
                'Invalid params expected an address.',
                { addressOrIndex }
            );
        }

        // Get the account by address
        const account = this.accounts.find(
            (account) =>
                Address.checksum(HexUInt.of(account.address)) ===
                Address.checksum(HexUInt.of(addressOrIndex))
        );
        return account ?? null;
    }

    /**
     * Get the options for signing a transaction with delegator (if any).
     *
     * @returns The options for signing a transaction with delegator.
     */
    abstract getDelegator(): Promise<SignTransactionOptions | null>;

    /**
     * SYNC Version of getDelegator()
     *
     * Get the options for signing a transaction with delegator (if any).
     *
     * @returns The options for signing a transaction with delegator.
     */
    getDelegatorSync(): SignTransactionOptions | null {
        return DelegationHandler(this.delegator).delegatorOrNull();
    }
}

export { AbstractProviderInternalWallet };
