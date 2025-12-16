import { type TransactionRequest } from '@thor/thor-client/model/transactions';
import { type Address } from '@common';
import { VIP191Client } from '@thor/gas-payers';

/**
 * Abstract class representing a signer, capable of signing
 * transaction requests and holding address details.
 */
abstract class Signer {
    /**
     * Represents the address of the signer.
     */
    public abstract address: Address;

    /**
     * Represents the VIP-191 client the signer will use for gas sponsorship.
     */
    protected abstract vip191Client?: VIP191Client;

    /**
     * Signs a given transaction request
     * If the transaction is delegated, and the signer supports VIP-191 gas sponsorship,
     * the signer will use the VIP-191 client to sign the transaction as gas payer.
     *
     * @param {TransactionRequest} transactionRequest - The transaction request object to be signed.
     * @returns {TransactionRequest} The signed transaction request object.
     */
    public abstract sign(
        transactionRequest: TransactionRequest
    ): Promise<TransactionRequest>;

    /**
     * Checks if the signer supports VIP-191 gas sponsorship.
     *
     * @returns {boolean} `true` if the signer supports VIP-191 gas sponsorship, `false` otherwise.
     */
    public get isVIP191Supported(): boolean {
        return this.vip191Client !== undefined;
    }
}

export { Signer };
