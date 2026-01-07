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
    public abstract readonly vip191Client?: VIP191Client;

    /**
     * Signs a given transaction request
     * If the transaction is delegated, and the signer supports VIP-191 gas sponsorship,
     * the signer will use the VIP-191 client to sign the transaction as gas payer.
     *
     * @param {TransactionRequest} transactionRequest - The transaction request object to be signed.
     * @param {Address} [sender] - The sender address (only for delegated transactions)
     * @returns {Promise<TransactionRequest>} The signed transaction request object.
     */
    public abstract sign(
        transactionRequest: TransactionRequest,
        sender?: Address
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

/**
 * Options for constructing a signer.
 */
interface SignerOptions {
    /**
     * The URL of the VIP-191 service to use for gas sponsorship.
     */
    vip191ServiceURL?: string;
    /**
     * The VIP-191 client to use for gas sponsorship.
     * If provided, it will be used instead of the VIP-191 service URL.
     */
    vip191Client?: VIP191Client;
}

export { Signer, type SignerOptions };
