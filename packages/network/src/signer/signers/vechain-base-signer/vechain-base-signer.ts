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
    Transaction,
    type TransactionBody,
    type TransactionClause,
    TransactionHandler
} from '../../../../../core';
import { RPC_METHODS } from '../../../provider';
import { assert, JSONRPC, TRANSACTION } from '@vechain/sdk-errors';

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
        return await this._signFlow(
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
     * @returns the fully signed transaction
     */
    async signTransactionWithDelegator(
        transactionToSign: TransactionRequestInput
    ): Promise<string> {
        // Get the delegator
        const delegator = DelegationHandler(
            await this.provider?.wallet?.getDelegator()
        ).delegatorOrNull();

        // Throw an error if the delegator is not available
        assert(
            'signTransactionWithDelegator',
            delegator !== null,
            JSONRPC.INVALID_PARAMS,
            'Delegator not found. Ensure that the provider contains the delegator used to sign the transaction.'
        );

        return await this._signFlow(
            transactionToSign,
            DelegationHandler(
                await this.provider?.wallet?.getDelegator()
            ).delegatorOrNull(),
            (this.provider as TProviderType).thorClient,
            this.privateKey
        );
    }

    /**
     * Build the transaction clauses
     * form a transaction given as input
     *
     * @param transaction - The transaction to sign
     * @returns The transaction clauses
     */
    private _buildClauses(
        transaction: TransactionRequestInput
    ): TransactionClause[] {
        return transaction.to !== undefined
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
    async _signFlow(
        transaction: TransactionRequestInput,
        delegator: SignTransactionOptions | null,
        thorClient: ThorClient,
        privateKey: Buffer
    ): Promise<string> {
        // 1 - Initiate the transaction clauses
        const transactionClauses: TransactionClause[] =
            transaction.clauses ?? this._buildClauses(transaction);

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
                    isDelegated: DelegationHandler(delegator).isDelegated(),

                    // @NOTE: To be compliant with the standard and to avoid nonce overflow, we generate a random nonce of 6 bytes
                    nonce: Hex0x.of(secp256k1.randomBytes(6))
                }
            );

        // 6 - Sign the transaction
        return delegator !== null
            ? await this._signWithDelegator(
                  transactionBody,
                  privateKey,
                  thorClient,
                  delegator
              )
            : Hex0x.of(
                  TransactionHandler.sign(transactionBody, privateKey).encoded
              );
    }

    /**
     * Signs a transaction where the gas fee is paid by a delegator.
     *
     * @param unsignedTransactionBody - The unsigned transaction body to sign.
     * @param originPrivateKey - The private key of the origin account.
     * @param  - (Optional) The private key of the delegator account.
     * @param thorClient - The ThorClient instance.
     * @param delegatorOptions - Optional parameters for the request. Includes the `delegatorUrl` and `delegatorPrivateKey` fields.
     *                  Only one of the following options can be specified: `delegatorUrl`, `delegatorPrivateKey`.
     *
     * @returns A promise that resolves to the signed transaction.
     *
     * @throws an error if the delegation fails.
     */
    private async _signWithDelegator(
        unsignedTransactionBody: TransactionBody,
        originPrivateKey: Buffer,
        thorClient: ThorClient,
        delegatorOptions?: SignTransactionOptions
    ): Promise<string> {
        // Only one of the `SignTransactionOptions` options can be specified
        assert(
            '_signWithDelegator',
            !(
                delegatorOptions?.delegatorUrl !== undefined &&
                delegatorOptions?.delegatorPrivateKey !== undefined
            ),
            TRANSACTION.INVALID_DELEGATION,
            'Only one of the following options can be specified: delegatorUrl, delegatorPrivateKey'
        );

        // Address of the origin account
        const originAddress = addressUtils.fromPublicKey(
            Buffer.from(secp256k1.derivePublicKey(originPrivateKey))
        );

        const unsignedTx = new Transaction(unsignedTransactionBody);

        // Sign transaction with origin private key and delegator private key
        if (delegatorOptions?.delegatorPrivateKey !== undefined)
            return Hex0x.of(
                TransactionHandler.signWithDelegator(
                    unsignedTransactionBody,
                    originPrivateKey,
                    Buffer.from(delegatorOptions?.delegatorPrivateKey, 'hex')
                ).encoded
            );

        // Otherwise, get the signature of the delegator from the delegator endpoint
        const delegatorSignature = await DelegationHandler(
            delegatorOptions
        ).getDelegationSignatureUsingUrl(
            unsignedTx,
            originAddress,
            thorClient.httpClient
        );

        // Sign transaction with origin private key
        const originSignature = secp256k1.sign(
            unsignedTx.getSignatureHash(),
            originPrivateKey
        );

        // Sign the transaction with both signatures. Concat both signatures to get the final signature
        const signature = Buffer.concat([originSignature, delegatorSignature]);

        // Return new signed transaction
        return Hex0x.of(new Transaction(unsignedTx.body, signature).encoded);
    }
}

export { VechainBaseSigner };
