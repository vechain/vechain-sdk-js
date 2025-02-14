import {
    Address,
    Hex,
    HexUInt,
    Secp256k1,
    Transaction,
    type TransactionBody
} from '@vechain/sdk-core';
import {
    InvalidSecp256k1PrivateKey,
    JSONRPCInvalidParams
} from '@vechain/sdk-errors';
import { RPC_METHODS } from '../../../provider/utils/const/rpc-mapper/rpc-methods';
import {
    DelegationHandler,
    type SignTransactionOptions,
    type ThorClient
} from '../../../thor-client';
import {
    type AvailableVeChainProviders,
    type TransactionRequestInput
} from '../types';
import { VeChainAbstractSigner } from '../vechain-abstract-signer/vechain-abstract-signer';

/**
 * Basic VeChain signer with the private key.
 * This signer can be initialized using a private key.
 */
class VeChainPrivateKeySigner extends VeChainAbstractSigner {
    /**
     * Create a new VeChainPrivateKeySigner.
     * A signer can be initialized using a private key.
     *
     * @param privateKey - The private key of the signer
     * @param provider - The provider to connect to
     */
    constructor(
        private readonly privateKey: Uint8Array,
        provider?: AvailableVeChainProviders
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
    connect(provider: AvailableVeChainProviders): this {
        return new VeChainPrivateKeySigner(this.privateKey, provider) as this;
    }

    /**
     * Get the address checksum of the Signer.
     *
     * @returns the address checksum of the signer
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
        if (this.provider === undefined) {
            throw new JSONRPCInvalidParams(
                'VeChainPrivateKeySigner.signTransaction()',
                'Thor provider is not found into the signer. Please attach a Provider to your signer instance.',
                { transactionToSign }
            );
        }

        let gasPayer = DelegationHandler(
            await this.provider.wallet?.getGasPayer()
        ).gasPayerOrNull();

        // Override the gasPayer if the transaction has a delegation URL
        if (transactionToSign.delegationUrl !== undefined) {
            gasPayer = {
                gasPayerServiceUrl: transactionToSign.delegationUrl
            };
        }

        // Sign the transaction
        return await this._signFlow(
            transactionToSign,
            gasPayer,
            this.provider.thorClient
        );
    }

    /**
     * Sends a transaction to the blockchain.
     *
     * @param {TransactionRequestInput} transactionToSend - The transaction object to be sent.
     * This includes all the necessary details such as `to`, `value`, `data`, `gasLimit`, etc.
     * @return {Promise<string>} A promise that resolves to the transaction hash as a string
     * once the transaction is successfully sent.
     * @throws {JSONRPCInvalidParams} Throws an error if the provider is not attached
     * to the signer, indicating the signer's inability to send the transaction.
     */
    async sendTransaction(
        transactionToSend: TransactionRequestInput
    ): Promise<string> {
        // 1 - Get the provider (needed to send the raw transaction)
        if (this.provider === undefined) {
            throw new JSONRPCInvalidParams(
                'VeChainPrivateKeySigner.sendTransaction()',
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
     * Signs a payload.
     *
     * @param {Uint8Array} payload - The payload to be signed as a byte array
     * @return {Promise<string>} - A Promise that resolves to the signature as a string.
     */
    async signPayload(payload: Uint8Array): Promise<string> {
        const sign = Secp256k1.sign(payload, new Uint8Array(this.privateKey));
        // SCP256K1 encodes the recovery flag in the last byte. EIP-191 adds 27 to it.
        sign[sign.length - 1] += 27;
        return await Promise.resolve(Hex.of(sign).toString());
    }

    /**
     * Signs a transaction internal method
     *
     * @param transaction - The transaction to sign
     * @param gasPayer - The gasPayer to use
     * @param thorClient - The ThorClient instance
     * @returns The fully signed transaction
     * @throws {InvalidSecp256k1PrivateKey, InvalidDataType}
     */
    async _signFlow(
        transaction: TransactionRequestInput,
        gasPayer: SignTransactionOptions | null,
        thorClient: ThorClient
    ): Promise<string> {
        // Populate the call, to get proper from and to address (compatible with multi-clause transactions)
        const populatedTransaction =
            await this.populateTransaction(transaction);

        // Sign the transaction
        return gasPayer !== null
            ? await this._signWithGasPayer(
                  populatedTransaction,
                  this.privateKey,
                  thorClient,
                  gasPayer
              )
            : Hex.of(
                  Transaction.of(populatedTransaction).sign(this.privateKey)
                      .encoded
              ).toString();
    }

    /**
     * Signs a transaction where the gas fee is paid by a gasPayer.
     *
     * @param unsignedTransactionBody - The unsigned transaction body to sign.
     * @param originPrivateKey - The private key of the origin account.
     * @param thorClient - The ThorClient instance.
     * @param gasPayerOptions - Optional parameters for the request. Includes the `gasPayerServiceUrl` and `gasPayerPrivateKey` fields.
     *                  Only one of the following options can be specified: `gasPayerServiceUrl`, `gasPayerPrivateKey`.
     * @returns A promise that resolves to the signed transaction.
     * @throws {NotDelegatedTransaction}
     */
    private async _signWithGasPayer(
        unsignedTransactionBody: TransactionBody,
        originPrivateKey: Uint8Array,
        thorClient: ThorClient,
        gasPayerOptions?: SignTransactionOptions
    ): Promise<string> {
        // Address of the origin account
        const originAddress = Address.ofPrivateKey(originPrivateKey).toString();

        const unsignedTx = Transaction.of(unsignedTransactionBody);

        // Sign transaction with origin private key and gasPayer private key
        if (gasPayerOptions?.gasPayerPrivateKey !== undefined)
            return Hex.of(
                Transaction.of(unsignedTransactionBody).signAsSenderAndGasPayer(
                    originPrivateKey,
                    HexUInt.of(gasPayerOptions?.gasPayerPrivateKey).bytes
                ).encoded
            ).toString();

        // Otherwise, get the signature of the gasPayer from the gasPayer endpoint
        const gasPayerSignature = await DelegationHandler(
            gasPayerOptions
        ).getDelegationSignatureUsingUrl(
            unsignedTx,
            originAddress,
            thorClient.httpClient
        );

        // Sign transaction with origin private key
        const originSignature = Secp256k1.sign(
            unsignedTx.getTransactionHash().bytes,
            originPrivateKey
        );

        // Sign the transaction with both signatures. Concat both signatures to get the final signature
        const signature = new Uint8Array(
            originSignature.length + gasPayerSignature.length
        );
        signature.set(originSignature);
        signature.set(gasPayerSignature, originSignature.length);

        // Return new signed transaction
        return Hex.of(
            Transaction.of(unsignedTx.body, signature).encoded
        ).toString();
    }
}

export { VeChainPrivateKeySigner };
