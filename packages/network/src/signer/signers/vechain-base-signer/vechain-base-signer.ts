import { type AvailableVechainProviders, type VechainSigner } from '../types';
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
import type { TransactionObjectInput } from '../../../provider/utils/rpc-mapper/methods-map/methods/eth_sendTransaction/types';

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
        readonly privateKey: Buffer,
        provider: TProviderType | null
    ) {
        // Store provider and delegator
        this.provider = provider ?? null;
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
     * Signs %%transactionToSign%%, returning the fully signed transaction. This does not
     * populate any additional properties within the transaction.
     *
     * @param transactionToSign - The transaction to sign
     * @returns The fully signed transaction
     */
    async signTransaction(
        transactionToSign: TransactionObjectInput
    ): Promise<string> {
        return await this._sign(
            transactionToSign,
            null,
            (this.provider as TProviderType).thorClient
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
        transactionToSign: TransactionObjectInput,
        delegator: SignTransactionOptions
    ): Promise<string> {
        return await this._sign(
            transactionToSign,
            delegator,
            (this.provider as TProviderType).thorClient
        );
    }

    /**
     * Signs a transaction internal method
     */
    private async _sign(
        transaction: TransactionObjectInput,
        delegator: SignTransactionOptions | null,
        thorClient: ThorClient
    ): Promise<string> {
        // 1 - Initiate the transaction clauses
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

        const signedTransaction = DelegationHandler(delegator).isDelegated()
            ? await this._signTransactionBodyWithDelegator(
                  transaction.from,
                  finalTransactionBody,
                  delegator as SignTransactionOptions,
                  thorClient
              )
            : TransactionHandler.sign(finalTransactionBody, this.privateKey);

        return Hex0x.of(signedTransaction.encoded);
    }

    /**
     * Sign a transaction with the delegator.
     * The signature of the delegator into the wallet will be used to sign the transaction.
     *
     * @param transactionOrigin - The origin address of the transaction (the 'from' field).
     * @param transactionToSign - The transaction to sign.
     * @param thorClient - The ThorClient instance used to sign using the url
     * @returns The transaction signed by the delegator.
     *
     */
    private async _signTransactionBodyWithDelegator(
        transactionOrigin: string,
        transactionToSign: TransactionBody,
        delegator: SignTransactionOptions,
        thorClient: ThorClient
    ): Promise<Transaction> {
        // 1 - Sign with delegatorPrivateKey
        if (delegator?.delegatorPrivateKey !== undefined) {
            return TransactionHandler.signWithDelegator(
                transactionToSign,
                this.privateKey,
                Buffer.from(delegator.delegatorPrivateKey, 'hex')
            );
        }

        // 2 - Sign the transaction with the delegator url
        const delegatorSignatureWithUrl = await DelegationHandler(
            delegator
        ).getDelegationSignatureUsingUrl(
            new Transaction(transactionToSign),
            transactionOrigin,
            thorClient.httpClient
        );

        // Sign transaction with origin private key
        const originSignature = secp256k1.sign(
            new Transaction(transactionToSign).getSignatureHash(),
            this.privateKey
        );

        // Sign the transaction with both signatures. Concat both signatures to get the final signature
        const signature = Buffer.concat([
            originSignature,
            delegatorSignatureWithUrl
        ]);

        // Return new signed transaction
        return new Transaction(transactionToSign, signature);
    }
}

export { VechainBaseSigner };
