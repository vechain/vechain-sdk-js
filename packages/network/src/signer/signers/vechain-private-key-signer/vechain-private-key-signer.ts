import {
    type AvailableVechainProviders,
    type TransactionRequestInput
} from '../types';
import {
    DelegationHandler,
    type SignTransactionOptions,
    type ThorClient
} from '../../../thor-client';
import {
    addressUtils,
    Hex0x,
    secp256k1,
    Transaction,
    type TransactionBody,
    TransactionHandler
} from '@vechain/sdk-core';
import { RPC_METHODS } from '../../../provider';
import { assert, JSONRPC, TRANSACTION } from '@vechain/sdk-errors';
import { assertTransactionCanBeSigned } from '../../../assertions';
import { VechainAbstractSigner } from '../vechain-abstract-signer';

/**
 * Basic vechain signer with the private key.
 * This signer can be initialized using a private key.
 */
class VechainPrivateKeySigner extends VechainAbstractSigner {
    /**
     * Create a new VechainPrivateKeySigner.
     * A signer can be initialized using a private key.
     *
     * @param privateKey - The private key of the signer
     * @param provider - The provider to connect to
     */
    constructor(
        private readonly privateKey: Buffer,
        provider: AvailableVechainProviders | null
    ) {
        // Call the parent constructor
        super(provider);
    }

    /**
     *  Returns a new instance of this Signer connected to //provider// or detached
     *  from any Provider if null.
     *
     * @param provider - The provider to connect to
     * @returns a new instance of this Signer connected to //provider// or detached
     */
    connect(provider: AvailableVechainProviders | null): this {
        return new VechainPrivateKeySigner(this.privateKey, provider) as this;
    }

    /**
     * Get the address of the Signer.
     *
     * @returns the address of the signer
     */
    async getAddress(): Promise<string> {
        return addressUtils.toERC55Checksum(
            await Promise.resolve(addressUtils.fromPrivateKey(this.privateKey))
        );
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
            DelegationHandler(
                await this.provider?.wallet?.getDelegator()
            ).delegatorOrNull(),
            (this.provider as AvailableVechainProviders).thorClient,
            this.privateKey
        );
    }

    /**
     * --- START: TEMPORARY COMMENT ---
     * Probably add in the future with vechain_sdk_core_ethers.TransactionRequest as a return type
     * --- END: TEMPORARY COMMENT ---
     *
     *  Sends %%transactionToSend%% to the Network. The ``signer.populateTransaction(transactionToSend)``
     *  is called first to ensure all necessary properties for the
     *  transaction to be valid have been populated first.
     *
     *  @param transactionToSend - The transaction to send
     *  @returns The transaction response
     */
    async sendTransaction(
        transactionToSend: TransactionRequestInput
    ): Promise<string> {
        // 1 - Get the provider (needed to send the raw transaction)
        assert(
            'sendTransaction',
            this.provider !== null,
            JSONRPC.INVALID_PARAMS,
            'Thor provider is not found into the signer. Please attach a Provider to your signer instance.'
        );
        const provider = this.provider as AvailableVechainProviders;

        // 2 - Sign the transaction
        const signedTransaction = await this.signTransaction(transactionToSend);

        // 3 - Send the signed transaction
        return (await provider.request({
            method: RPC_METHODS.eth_sendRawTransaction,
            params: [signedTransaction]
        })) as string;
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
        // // 1 - Populate the call, to get proper from and to address (compatible with multi-clause transactions)
        const populatedTransaction =
            await this.populateTransaction(transaction);

        // Assert if the transaction can be signed
        assertTransactionCanBeSigned(
            'signTransaction',
            this.privateKey,
            populatedTransaction
        );

        // 6 - Sign the transaction
        return delegator !== null
            ? await this._signWithDelegator(
                  populatedTransaction,
                  privateKey,
                  thorClient,
                  delegator
              )
            : Hex0x.of(
                  TransactionHandler.sign(populatedTransaction, privateKey)
                      .encoded
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

export { VechainPrivateKeySigner };
