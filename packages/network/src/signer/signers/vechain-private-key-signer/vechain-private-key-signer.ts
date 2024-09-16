import * as n_utils from '@noble/curves/abstract/utils';
import {
    Address,
    Hex,
    HexUInt,
    Keccak256,
    Secp256k1,
    Transaction,
    type TransactionBody,
    TransactionHandler,
    Txt,
    vechain_sdk_core_ethers
} from '@vechain/sdk-core';
import {
    InvalidSecp256k1PrivateKey,
    JSONRPCInvalidParams
} from '@vechain/sdk-errors';
import { RPC_METHODS } from '../../../provider';
import {
    DelegationHandler,
    type SignTransactionOptions,
    type ThorClient
} from '../../../thor-client';
import {
    type AvailableVeChainProviders,
    type TransactionRequestInput
} from '../types';
import { VeChainAbstractSigner } from '../vechain-abstract-signer';

/**
 * Basic VeChain signer with the private key.
 * This signer can be initialized using a private key.
 */
class VeChainPrivateKeySigner extends VeChainAbstractSigner {
    private readonly MESSAGE_PREFIX = Txt.of('\x19Ethereum Signed Message:\n')
        .bytes;

    /**
     * Create a new VeChainPrivateKeySigner.
     * A signer can be initialized using a private key.
     *
     * @param privateKey - The private key of the signer
     * @param provider - The provider to connect to
     */
    constructor(
        private readonly privateKey: Buffer,
        provider: AvailableVeChainProviders | null
    ) {
        // Assert if the transaction can be signed
        if (!Secp256k1.isValidPrivateKey(privateKey)) {
            throw new InvalidSecp256k1PrivateKey(
                `VeChainPrivateKeySigner.constructor()`,
                "Invalid private key used to sign initialize the signer. Ensure it's a valid Secp256k1 private key.",
                undefined
            );
        }

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
    connect(provider: AvailableVeChainProviders | null): this {
        return new VeChainPrivateKeySigner(this.privateKey, provider) as this;
    }

    /**
     * Get the address of the Signer.
     *
     * @returns the address of the signer
     */
    async getAddress(): Promise<string> {
        return Address.checksum(
            HexUInt.of(
                await Promise.resolve(
                    Address.ofPrivateKey(this.privateKey).toString()
                )
            )
        );
    }

    /**
     * Signs %%transactionToSign%%, returning the fully signed transaction. This does not
     * populate any additional properties with eth_getTransactionCount: RPC_METHODS, p0: (string | undefined)[], args: EIP1193RequestArguments* @param transactionToSign - The transaction to sign
     * @returns The fully signed transaction
     */
    async signTransaction(
        transactionToSign: TransactionRequestInput
    ): Promise<string> {
        // Check the provider (needed to sign the transaction)
        if (this.provider === null) {
            throw new JSONRPCInvalidParams(
                'VeChainPrivateKeySigner.signTransaction()',
                -32602,
                'Thor provider is not found into the signer. Please attach a Provider to your signer instance.',
                { transactionToSign }
            );
        }

        // Sign the transaction
        return await this._signFlow(
            transactionToSign,
            DelegationHandler(
                await this.provider?.wallet?.getDelegator()
            ).delegatorOrNull(),
            this.provider.thorClient
        );
    }

    /**
     *  Sends %%transactionToSend%% to the Network. The ``signer.populateTransaction(transactionToSend)``
     *  is called first to ensure all necessary properties for the
     *  transaction to be valid have been populated first.
     *
     *  @param transactionToSend - The transaction to send
     *  @returns The transaction response
     * @throws {JSONRPCInvalidParams}
     */
    async sendTransaction(
        transactionToSend: TransactionRequestInput
    ): Promise<string> {
        // 1 - Get the provider (needed to send the raw transaction)
        if (this.provider === null) {
            throw new JSONRPCInvalidParams(
                'VeChainPrivateKeySigner.sendTransaction()',
                -32602,
                'Thor provider is not found into the signer. Please attach a Provider to your signer instance.',
                { transactionToSend }
            );
        }

        const provider = this.provider;

        // 2 - Sign the transaction
        const signedTransaction = await this.signTransaction(transactionToSend);

        // 3 - Send the signed transaction
        return (await provider.request({
            method: RPC_METHODS.eth_sendRawTransaction,
            params: [signedTransaction]
        })) as string;
    }

    /**
     * Signs an [EIP-191](https://eips.ethereum.org/EIPS/eip-191) prefixed a personal message.
     *
     * This function is a drop-in replacement for {@link ethers.BaseWallet.signMessage} function.
     *
     * @param {string|Uint8Array} message - The message to be signed.
     *                                      If the %%message%% is a string, it is signed as UTF-8 encoded bytes.
     *                                      It is **not** interpreted as a [[BytesLike]];
     *                                      so the string ``"0x1234"`` is signed as six characters, **not** two bytes.
     * @return {Promise<string>} - A Promise that resolves to the signature as a string.
     */
    async signMessage(message: string | Uint8Array): Promise<string> {
        return await new Promise((resolve, reject) => {
            try {
                const body =
                    typeof message === 'string'
                        ? Txt.of(message).bytes
                        : message;
                const sign = Secp256k1.sign(
                    Keccak256.of(
                        n_utils.concatBytes(
                            this.MESSAGE_PREFIX,
                            Txt.of(body.length).bytes,
                            body
                        )
                    ).bytes,
                    new Uint8Array(this.privateKey)
                );
                // SCP256K1 encodes the recovery flag in the last byte. EIP-191 adds 27 to it.
                sign[sign.length - 1] += 27;
                resolve(Hex.of(sign).toString());
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Signs the [[link-eip-712]] typed data.
     *
     * This function is a drop-in replacement for {@link ethers.BaseWallet.signTypedData} function,
     * albeit Ethereum Name Services are not resolved because he resolution depends on **ethers** provider implementation.
     *
     * @param {ethers.TypedDataDomain} domain - The domain parameters used for signing.
     * @param {Record<string, ethers.TypedDataField[]>} types - The types used for signing.
     * @param {Record<string, unknown>} value - The value data to be signed.
     *
     * @return {Promise<string>} - A promise that resolves with the signature string.
     */
    async signTypedData(
        domain: vechain_sdk_core_ethers.TypedDataDomain,
        types: Record<string, vechain_sdk_core_ethers.TypedDataField[]>,
        value: Record<string, unknown>
    ): Promise<string> {
        return await new Promise((resolve, reject) => {
            try {
                const hash = Hex.of(
                    vechain_sdk_core_ethers.TypedDataEncoder.hash(
                        domain,
                        types,
                        value
                    )
                ).bytes;
                const sign = Secp256k1.sign(
                    hash,
                    new Uint8Array(this.privateKey)
                );
                // SCP256K1 encodes the recovery flag in the last byte. EIP-712 adds 27 to it.
                sign[sign.length - 1] += 27;
                resolve(Hex.of(sign).toString());
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Signs a transaction internal method
     *
     * @param transaction - The transaction to sign
     * @param delegator - The delegator to use
     * @param thorClient - The ThorClient instance
     * @returns The fully signed transaction
     * @throws {InvalidSecp256k1PrivateKey, InvalidDataType}
     */
    async _signFlow(
        transaction: TransactionRequestInput,
        delegator: SignTransactionOptions | null,
        thorClient: ThorClient
    ): Promise<string> {
        // Populate the call, to get proper from and to address (compatible with multi-clause transactions)
        const populatedTransaction =
            await this.populateTransaction(transaction);

        // Sign the transaction
        return delegator !== null
            ? await this._signWithDelegator(
                  populatedTransaction,
                  this.privateKey,
                  thorClient,
                  delegator
              )
            : Hex.of(
                  TransactionHandler.sign(populatedTransaction, this.privateKey)
                      .encoded
              ).toString();
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
     * @returns A promise that resolves to the signed transaction.
     * @throws {NotDelegatedTransaction}
     */
    private async _signWithDelegator(
        unsignedTransactionBody: TransactionBody,
        originPrivateKey: Buffer,
        thorClient: ThorClient,
        delegatorOptions?: SignTransactionOptions
    ): Promise<string> {
        // Address of the origin account
        const originAddress = Address.ofPrivateKey(originPrivateKey).toString();

        const unsignedTx = new Transaction(unsignedTransactionBody);

        // Sign transaction with origin private key and delegator private key
        if (delegatorOptions?.delegatorPrivateKey !== undefined)
            return Hex.of(
                TransactionHandler.signWithDelegator(
                    unsignedTransactionBody,
                    originPrivateKey,
                    Buffer.from(delegatorOptions?.delegatorPrivateKey, 'hex')
                ).encoded
            ).toString();

        // Otherwise, get the signature of the delegator from the delegator endpoint
        const delegatorSignature = await DelegationHandler(
            delegatorOptions
        ).getDelegationSignatureUsingUrl(
            unsignedTx,
            originAddress,
            thorClient.httpClient
        );

        // Sign transaction with origin private key
        const originSignature = Secp256k1.sign(
            unsignedTx.getSignatureHash(),
            originPrivateKey
        );

        // Sign the transaction with both signatures. Concat both signatures to get the final signature
        const signature = Buffer.concat([originSignature, delegatorSignature]);

        // Return new signed transaction
        return Hex.of(
            new Transaction(unsignedTx.body, signature).encoded
        ).toString();
    }
}

export { VeChainPrivateKeySigner };
