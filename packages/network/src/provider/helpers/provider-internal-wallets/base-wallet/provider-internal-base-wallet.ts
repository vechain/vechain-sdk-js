import {
    type ProviderInternalWallet,
    type ProviderInternalWalletAccount
} from '../types';
import { assert, DATA } from '@vechain/sdk-errors';
import { addressUtils } from '@vechain/sdk-core';
import {
    DelegationHandler,
    type SignTransactionOptions
} from '../../../../thor-client';
import {
    type AvailableVechainProviders,
    VechainBaseSigner,
    type VechainSigner
} from '../../../../signer';

/**
 * Provider internal Base wallet class.
 *
 * This is the most basic wallet implementation we can have:
 * * This wallet is generated by a list of private keys
 */
class ProviderInternalBaseWallet implements ProviderInternalWallet {
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
     * @param address - Address of the account.
     * @returns The signer for the given address.
     */
    async getSigner(
        parentProvider: AvailableVechainProviders,
        addressOrIndex?: string | number
    ): Promise<VechainSigner | null> {
        // Get the account from the wallet
        const signerAccount = await this.getAccount(addressOrIndex);

        // Return a new signer (if exists)
        if (signerAccount?.privateKey !== undefined) {
            return await Promise.resolve(
                new VechainBaseSigner(signerAccount.privateKey, parentProvider)
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
    async getAddresses(): Promise<string[]> {
        return await Promise.resolve(
            this.accounts.map((account) => account.address)
        );
    }

    /**
     * Get an account by address.
     *
     * @param addressOrIndex - Address or index of the account.
     * @returns The account with the given address, or null if not found.
     */
    async getAccount(
        addressOrIndex?: string | number
    ): Promise<ProviderInternalWalletAccount | null> {
        if (
            addressOrIndex === undefined ||
            typeof addressOrIndex === 'number'
        ) {
            return this.accounts[addressOrIndex ?? 0] ?? null;
        }

        // Check if the address is valid
        assert(
            'getAccount',
            addressUtils.isAddress(addressOrIndex),
            DATA.INVALID_DATA_TYPE,
            'Invalid params expected an address.',
            { addressOrIndex }
        );

        // Get the account by address
        const account = this.accounts.find(
            (account) =>
                addressUtils.toERC55Checksum(account.address) ===
                addressUtils.toERC55Checksum(addressOrIndex)
        );
        return await Promise.resolve(account ?? null);
    }

    /**
     * Get the options for signing a transaction with delegator (if any).
     *
     * @returns The options for signing a transaction with delegator.
     */
    async getDelegator(): Promise<SignTransactionOptions | null> {
        return await Promise.resolve(
            DelegationHandler(this.delegator).delegatorOrNull()
        );
    }
}

export { ProviderInternalBaseWallet };
