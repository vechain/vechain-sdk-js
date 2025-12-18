import {
    Address,
    Blake2b256,
    IllegalArgumentError,
    InvalidPrivateKeyError,
    InvalidSignatureError,
    Secp256k1
} from '@common';
import { TransactionRequest } from '@thor/thor-client/model/transactions';
import { Signer, SignerOptions } from './Signer';
import { concatBytes } from '@noble/curves/utils.js';
import { log } from '@common/logging';
import { VIP191Client } from '@thor/gas-payers';

/**
 * The class implements the {@link Signer} interface,
 *
 * @remark Call {@link PrivateKeySigner.dispose} method to dispose the private key
 * when the signer is not needed anymore.
 * This will clear the private key from memory, minimizing the risk of leaking it.
 */
class PrivateKeySigner extends Signer {
    /**
     * Represents the private key used to sign with.
     *
     * @remark The value should be handled with care, as it may contain sensitive
     * information.
     */
    #privateKey: Uint8Array | null = null;

    /**
     * The address of the signer.
     */
    public readonly address: Address;

    /**
     * The VIP-191 client the signer will use for gas sponsorship.
     */
    public readonly vip191Client?: VIP191Client;

    /**
     * Constructs a new instance of the PrivateKeySigner using the provided private key.
     * Initializes the address and validates the private key during construction.
     *
     * @param {Uint8Array} privateKey The private key to be used for signing. Must be a valid Secp256k1 private key.
     * @param {SignerOptions} [options] The options for constructing the signer.
     * @throws {InvalidPrivateKeyError} Throws an error if the provided private key is invalid.
     */
    constructor(privateKey: Uint8Array, options?: SignerOptions) {
        super();
        // if vip191 client is provided, use it
        if (options?.vip191Client !== undefined) {
            this.vip191Client = options.vip191Client;
        } else if (options?.vip191ServiceURL !== undefined) {
            this.vip191Client = VIP191Client.of(options.vip191ServiceURL);
        } else {
            this.vip191Client = undefined;
        }
        if (Secp256k1.isValidPrivateKey(privateKey)) {
            // Defensive copies to avoid external mutation.
            this.#privateKey = new Uint8Array(privateKey);
            this.address = Address.ofPrivateKey(privateKey);
        } else {
            throw new InvalidPrivateKeyError(
                'PrivateKeySigner.constructor',
                'invalid private key'
            );
        }
    }

    /**
     * Clears the existing private key data by overwriting it with zeroes
     * and sets the private key to null to be its memory recovered by the garbage collector.
     *
     * @return {void} This method does not return a value.
     *
     * @remark Call {@link PrivateKeySigner.dispose} method to dispose the private key
     * when the signer is not needed anymore.
     * This will clear the private key from memory, minimizing the risk of leaking it.
     * After this call this {@link Signer} instance can't be used anymore.
     */
    public dispose(): void {
        if (this.#privateKey !== null) {
            this.#privateKey.fill(0);
        }
        this.#privateKey = null;
    }

    /**
     * Signs a transaction request.
     * - If the transaction is delegated:
     *   - if sender is not specified, signs as origin.
     *   - if sender is specified, signs as gas payer, append signature to the current signature.
     * - If the transaction is not delegated, signs as origin.
     *
     * @param {TransactionRequest} transactionRequest - The transaction request object to be signed.
     * @param {Address} [sender] - The sender address (only for delegated transactions)
     * @return {TransactionRequest} The signed transaction request object.
     * @throws {InvalidSignatureError} Throws an error if the signing process fails.
     */
    public async sign(
        transactionRequest: TransactionRequest,
        sender?: Address
    ): Promise<TransactionRequest> {
        try {
            if (transactionRequest.isDelegated) {
                if (sender === undefined) {
                    // not specified, sign as origin.
                    return this.signAsDelegatedOrigin(transactionRequest);
                } else {
                    // specified, sign as gas payer, append signature to the current signature.
                    return await this.signAsDelegatedGasPayer(
                        sender,
                        transactionRequest
                    );
                }
            }
            // not delegated, replace any signature with the origin signature.
            return this.signAsOrigin(transactionRequest);
        } catch (error) {
            log.error({
                message: `signing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                source: 'PrivateKeySigner.sign',
                context: { transactionRequest }
            });
            throw new InvalidSignatureError(
                'PrivateKeySigner.sign',
                'signing failed',
                { transactionRequest },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Signs the given transaction request as a gas payer
     * If the signer supports VIP-191 gas sponsorship, it will use the VIP-191 client to sign the transaction as gas payer.
     * Otherwise, it will sign the transaction as gas payer using the private key.
     * If current signature is empty, it replaces the signature with the gas payer signature.
     * If current signature is not empty, it concatenates the current signature with the gas payer signature.
     *
     * @param {TransactionRequest} transactionRequest - The transaction request to sign
     * @return {TransactionRequest} The signed transaction request with updated gas payer signature.
     * @throws {InvalidPrivateKeyError} Throws an error if the private key is not available.
     * @throws {VIP191Error} Throws an error if the VIP-191 service returns an error.
     */
    private async signAsDelegatedGasPayer(
        sender: Address,
        transactionRequest: TransactionRequest
    ): Promise<TransactionRequest> {
        // check transaction is delegated
        if (!transactionRequest.isDelegated) {
            log.error({
                message: 'transaction request is not delegated',
                source: 'PrivateKeySigner.signAsDelegatedGasPayer',
                context: { transactionRequest }
            });
            throw new IllegalArgumentError(
                'PrivateKeySigner.signAsDelegatedGasPayer',
                'transaction request is not delegated',
                { transactionRequest }
            );
        }
        // hold signature bytes
        let gasPayerSignature: Uint8Array | null = null;
        // check for VIP-191
        // if transaction request has feel delegation url on it, use it
        if (transactionRequest.feeDelegationUrl !== undefined) {
            const vip191Client = VIP191Client.of(
                transactionRequest.feeDelegationUrl.toString()
            );
            gasPayerSignature = (
                await vip191Client.requestSignature(sender, transactionRequest)
            ).bytes;
        } else if (this.isVIP191Supported && this.vip191Client !== undefined) {
            // if this signer supports VIP-191, use it
            gasPayerSignature = (
                await this.vip191Client.requestSignature(
                    sender,
                    transactionRequest
                )
            ).bytes;
        } else {
            // sign transaction request as using the private key
            if (this.#privateKey !== null) {
                const senderHash = Blake2b256.of(
                    concatBytes(
                        transactionRequest.hash.bytes,
                        sender.bytes ?? new Uint8Array()
                    )
                ).bytes;
                gasPayerSignature = Secp256k1.sign(
                    senderHash,
                    this.#privateKey
                );
            } else {
                // no private key available to sign transaction request as gas payer
                log.error({
                    message:
                        'no private key available to sign transaction request as gas payer',
                    source: 'PrivateKeySigner.signAsDelegatedGasPayer'
                });
                throw new InvalidPrivateKeyError(
                    'PrivateKeySigner.signAsDelegatedGasPayer',
                    'no private key'
                );
            }
        }
        // concatenate signature
        if (gasPayerSignature !== null) {
            if (transactionRequest.signature !== undefined) {
                return TransactionRequest.of(
                    { ...transactionRequest },
                    {
                        signature: concatBytes(
                            transactionRequest.signature.slice(
                                0,
                                Secp256k1.SIGNATURE_LENGTH
                            ),
                            gasPayerSignature
                        )
                    }
                );
            } else {
                return TransactionRequest.of(
                    { ...transactionRequest },
                    {
                        signature: gasPayerSignature
                    }
                );
            }
        } else {
            log.error({
                message: 'no gas payer signature available',
                source: 'PrivateKeySigner.signAsDelegatedGasPayer'
            });
            throw new InvalidSignatureError(
                'PrivateKeySigner.signAsDelegatedGasPayer',
                'no gas payer signature'
            );
        }
    }

    /**
     * Signs the given transaction request as a gas payer using a private key.
     * If current signature is empty, it replaces the signature with the origin signature.
     * If current signature is not empty, it concatenates the current signature with the new signature.
     *
     * @param {TransactionRequest} transactionRequest - The transaction request to sign
     * @return {TransactionRequest} The signed transaction request with updated gas payer signature.
     * @throws {InvalidPrivateKeyError} Throws an error if the private key is not available.
     */
    private signAsDelegatedOrigin(
        transactionRequest: TransactionRequest
    ): TransactionRequest {
        if (this.#privateKey !== null) {
            if (transactionRequest.isDelegated) {
                const originSignature = Secp256k1.sign(
                    transactionRequest.hash.bytes,
                    this.#privateKey
                );
                if (transactionRequest.signature !== undefined) {
                    return TransactionRequest.of(
                        { ...transactionRequest },
                        {
                            signature: concatBytes(
                                originSignature,
                                transactionRequest.signature.slice(
                                    Secp256k1.SIGNATURE_LENGTH
                                )
                            )
                        }
                    );
                } else {
                    return TransactionRequest.of(
                        { ...transactionRequest },
                        {
                            signature: originSignature
                        }
                    );
                }
            }
        }
        log.error({
            message:
                'no private key available to sign transaction request as origin',
            source: 'PrivateKeySigner.signAsDelegatedOrigin'
        });
        throw new InvalidPrivateKeyError(
            'PrivateKeySigner.signAsDelegatedOrigin',
            'no private key'
        );
    }

    /**
     * Signs a delegated transaction request as the origin
     * Replaces the signature with the origin signature.
     *
     * @param {TransactionRequest} transactionRequest - The transaction request to be signed.
     * @return {TransactionRequest} A new instance of TransactionRequest with the origin signature set as the signature.
     * @throws {InvalidPrivateKeyError} If no private key is available for signing.
     */
    private signAsOrigin(
        transactionRequest: TransactionRequest
    ): TransactionRequest {
        if (this.#privateKey !== null) {
            return TransactionRequest.of(
                { ...transactionRequest },
                {
                    signature: Secp256k1.sign(
                        transactionRequest.hash.bytes,
                        this.#privateKey
                    )
                }
            );
        }
        log.error({
            message:
                'no private key available to sign transaction request as origin',
            source: 'PrivateKeySigner.signAsOrigin'
        });
        throw new InvalidPrivateKeyError(
            'PrivateKeySigner.signAsOrigin',
            'no private key'
        );
    }
}

export { PrivateKeySigner };
