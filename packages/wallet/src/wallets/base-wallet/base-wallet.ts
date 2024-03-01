import { type Wallet, type WalletAccount } from '../types';
import { assert, DATA } from '@vechain/vechain-sdk-errors';
import { addressUtils } from '@vechain/vechain-sdk-core';
import {
    DelegationHandler,
    type SignTransactionOptions
} from '@vechain/vechain-sdk-network';

/**
 * Base wallet class.
 *
 * This is the most basic wallet implementation we can have.
 */
class BaseWallet implements Wallet {
    /**
     * List of accounts in the wallet.
     */
    readonly accounts: WalletAccount[];

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
        accounts: WalletAccount[],
        options?: {
            delegator?: SignTransactionOptions;
        }
    ) {
        this.accounts = accounts;
        this.delegator = options?.delegator;
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
     * @param address - Address of the account.
     * @returns The account with the given address, or null if not found.
     */
    async getAccount(address: string): Promise<WalletAccount | null> {
        // Check if the address is valid
        assert(
            addressUtils.isAddress(address),
            DATA.INVALID_DATA_TYPE,
            'Invalid params expected an address.',
            { address }
        );

        // Get the account by address
        const account = this.accounts.find(
            (account) =>
                addressUtils.toChecksummed(account.address) ===
                addressUtils.toChecksummed(address)
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

export { BaseWallet };
