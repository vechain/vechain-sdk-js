import {
    type AvailableVechainProviders,
    type TransactionRequestInput,
    type VechainSigner
} from '../types';
import {
    DelegationHandler,
    type SignTransactionOptions,
    type ThorClient
} from '../../../thor-client';
import {
    addressUtils,
    clauseBuilder,
    Hex0x,
    secp256k1,
    type TransactionBody,
    type TransactionClause
} from '../../../../../core';
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
        return await this._sign(
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
        return await this._sign(
            transactionToSign,
            delegator,
            (this.provider as TProviderType).thorClient,
            this.privateKey
        );
    }

    /**
     * Signs a transaction internal method
     *
     * @param transaction - The transaction to sign
     * @param delegator - The delegator to use
     * @param thorClient - The ThorClient instance
     * @param privateKey - The private key of the signer
     * @returns The fully signed transaction
     */
    async _sign(
        transaction: TransactionRequestInput,
        delegator: SignTransactionOptions | null,
        thorClient: ThorClient,
        privateKey: Buffer
    ): Promise<string> {
        // 1 - Initiate the transaction clauses
        // @NOTE: implement multiple clauses support here
        const transactionClauses: TransactionClause[] =
            transaction.to !== undefined
                ? // Normal transaction
                  [
                      {
                          to: transaction.to,
                          data: transaction.data ?? '0x',
                          value: transaction.value ?? '0x0'
                      } satisfies TransactionClause
                  ]
                : // If 'to' address is not provided, it will be assumed that the transaction is a contract creation transaction.
                  [clauseBuilder.deployContract(transaction.data ?? '0x')];

        // 2 - Estimate gas
        const gasResult = await thorClient.gas.estimateGas(
            transactionClauses,
            transaction.from
        );

        // 3 - Create transaction body
        const transactionBody =
            await thorClient.transactions.buildTransactionBody(
                transactionClauses,
                gasResult.totalGas,
                {
                    isDelegated: DelegationHandler(delegator).isDelegated()
                }
            );

        // 5 - Generate nonce.
        // @NOTE: To be compliant with the standard and to avoid nonce overflow, we generate a random nonce of 6 bytes

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { nonce, ...transactionBodyWithoutNonce } = transactionBody;
        const newNonce = Hex0x.of(secp256k1.randomBytes(6));

        const finalTransactionBody: TransactionBody = {
            nonce: newNonce,
            ...transactionBodyWithoutNonce
        };

        // 6 - Sign the transaction

        const signedTransaction = await thorClient.transactions.signTransaction(
            finalTransactionBody,
            privateKey.toString('hex'),
            DelegationHandler(delegator).delegatorOrUndefined()
        );

        return Hex0x.of(signedTransaction.encoded);
    }
}

export { VechainBaseSigner };
