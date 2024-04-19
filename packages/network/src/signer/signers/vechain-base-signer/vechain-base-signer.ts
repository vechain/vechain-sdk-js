import {
    type AvailableVechainProviders,
    type TransactionRequestInput,
    type VechainSigner
} from '../types';
import { type SignTransactionOptions } from '../../../thor-client';
import { signTransactionWithPrivateKey } from '../helpers';

/**
 * Basic vechain signer.
 * This signer can be initialized using a private key.
 */
class VechainBaseSigner<TProviderType extends AvailableVechainProviders>
    implements VechainSigner<TProviderType>
{
    /**
     * The provider attached to this Signer (if any).
     */
    provider: TProviderType | null;

    /**
     * Create a new VechainBaseSigner.
     * A signer can be initialized using a private key.
     *
     * @param privateKey - The private key of the signer
     * @param provider - The provider to connect to
     */
    constructor(
        private readonly privateKey: Buffer,
        provider: TProviderType | null
    ) {
        // Store provider and delegator
        this.provider = provider;
    }

    /**
     * Signs %%transactionToSign%%, returning the fully signed transaction. This does not
     * populate any additional properties within the transaction.
     *
     * @param transactionToSign - The transaction to sign
     * @returns The fully signed transaction
     */
    async signTransaction(
        transactionToSign: TransactionRequestInput
    ): Promise<string> {
        return await signTransactionWithPrivateKey(
            transactionToSign,
            null,
            (this.provider as TProviderType).thorClient,
            this.privateKey
        );
    }

    /**
     * Sign a transaction with the delegator
     *
     * @param transactionToSign - the transaction to sign
     * @param delegator - the delegator to use
     * @returns the fully signed transaction
     */
    async signTransactionWithDelegator(
        transactionToSign: TransactionRequestInput,
        delegator: SignTransactionOptions
    ): Promise<string> {
        return await signTransactionWithPrivateKey(
            transactionToSign,
            delegator,
            (this.provider as TProviderType).thorClient,
            this.privateKey
        );
    }
}

export { VechainBaseSigner };
