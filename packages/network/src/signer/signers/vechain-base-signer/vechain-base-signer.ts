import {
    type AvailableVechainProviders,
    type TransactionRequestInput,
    type VechainSigner
} from '../types';
import { type SignTransactionOptions } from '../../../thor-client';
import { signTransactionWithPrivateKey } from '../helpers';
import { addressUtils, Hex0x, secp256k1 } from '../../../../../core';
import { RPC_METHODS } from '../../../provider';

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
     *  Returns a new instance of this Signer connected to //provider// or detached
     *  from any Provider if null.
     *
     * @param provider - The provider to connect to
     * @returns a new instance of this Signer connected to //provider// or detached
     */
    connect(provider: TProviderType | null): this {
        return new VechainBaseSigner(this.privateKey, provider) as this;
    }

    /**
     * Get the address of the Signer.
     *
     * @returns the address of the signer
     */
    async getAddress(): Promise<string> {
        return await Promise.resolve(
            addressUtils.fromPrivateKey(this.privateKey)
        );
    }

    /**
     *  Gets the next nonce required for this Signer to send a transaction.
     *
     *  @param blockTag - The blocktag to base the transaction count on, keep in mind
     *         many nodes do not honour this value and silently ignore it [default: ``"latest"``]
     *
     *  @NOTE: This method generates a random number as nonce. It is because the nonce in vechain is a 6-byte number.
     */
    async getNonce(blockTag?: string): Promise<string> {
        // If provider is available, get the nonce from the provider using eth_getTransactionCount
        if (this.provider !== null) {
            return (await this.provider.request({
                method: RPC_METHODS.eth_getTransactionCount,
                params: [await this.getAddress(), blockTag]
            })) as string;
        }

        // Otherwise return a random number
        return await Promise.resolve(Hex0x.of(secp256k1.randomBytes(6)));
    }

    /**
     * Signs %%transactionToSign%%, returning the fully signed transaction. This does not
     * populate any additional properties witheth_getTransactionCount: RPC_METHODS, p0: (string | undefined)[], args: EIP1193RequestArguments* @param transactionToSign - The transaction to sign
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
