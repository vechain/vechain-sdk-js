import { type ProviderInternalWalletAccount } from '../types';
import { type SignTransactionOptions } from '../../../../thor-client';
import {
    type AvailableVeChainProviders,
    type VeChainSigner
} from '../../../../signer/signers/types';
import { AbstractProviderInternalWallet } from '../abstract-wallet/abstract-provider-internal-wallet';

/**
 * Provider internal Base wallet class.
 *
 * This is the most basic wallet implementation we can have:
 * * This wallet is generated by a list of private keys
 */
class ProviderInternalBaseWallet extends AbstractProviderInternalWallet {
    /**
     * Get a signer into the internal wallet provider
     * for the given address.
     *
     * @param parentProvider - The parent provider of the Internal Wallet.
     * @param addressOrIndex - Address of the account.
     * @returns The signer for the given address.
     */
    async getSigner(
        parentProvider: AvailableVeChainProviders,
        addressOrIndex?: string | number
    ): Promise<VeChainSigner | null> {
        return await Promise.resolve(
            this.getSignerSync(parentProvider, addressOrIndex)
        );
    }

    /**
     * Get the list of addresses in the wallet.
     *
     * @returns The list of addresses in the wallet.
     */
    async getAddresses(): Promise<string[]> {
        return await Promise.resolve(this.getAddressesSync());
    }

    /**
     * Get an account given an address or an index.
     *
     * @param addressOrIndex - Address or index of the account.
     * @returns The account with the given address, or null if not found.
     */
    async getAccount(
        addressOrIndex?: string | number
    ): Promise<ProviderInternalWalletAccount | null> {
        return await Promise.resolve(this.getAccountSync(addressOrIndex));
    }

    /**
     * Get the options for signing a transaction with delegator (if any).
     *
     * @returns The options for signing a transaction with delegator.
     */
    async getDelegator(): Promise<SignTransactionOptions | null> {
        return await Promise.resolve(this.getDelegatorSync());
    }
}

export { ProviderInternalBaseWallet };
