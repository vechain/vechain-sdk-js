import {
    Address,
    Blake2b256,
    InvalidPrivateKeyError,
    Secp256k1,
    VeChainSDKError
} from '@common';
import { TransactionRequest } from '@thor/thor-client/model/transactions';
import { type Signer } from './Signer';
import { TransactionRequestRLPCodec } from '@thor';
import { concatBytes } from '@noble/curves/utils.js';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/sdk/src/thor/signer/PrivateKeySigner.ts!';

/**
 * The class implements the {@link Signer} interface,
 * to sign transaction requests using the provided private key.
 *
 * @remark Call {@link PrivateKeySigner.dispose} method to dispose the private key
 * when the signer is not needed anymore.
 * This will clear the private key from memory, minimizing the risk of leaking it.
 *
 * @remarks Security audited class, depends on
 * - {@link Address.ofPrivateKey};
 * - {@link Blake2b256.of};
 * - {@link Secp256k1.isValidPrivateKey};
 * - {@link Secp256k1.sign}.
 * - Follow links for additional security notes.
 */
class PrivateKeySigner implements Signer {
    /**
     * Represents the private cryptographic key used to sign transaction requests
     *
     * @remark The value should be handled with care, as it may contain sensitive
     * information.
     */
    #privateKey: Uint8Array | null = null;

    /**
     * Represents the address of the signer.
     */
    public readonly address: Address;

    /**
     * Constructs a new instance of the PrivateKeySigner using the provided private key.
     * Initializes the address and validates the private key during construction.
     *
     * @param {Uint8Array} privateKey The private key to be used for signing. Must be a valid Secp256k1 private key.
     * @throws {InvalidPrivateKeyError} Throws an error if the provided private key is invalid.
     * @return {PrivateKeySigner} A new instance of PrivateKeySigner.
     */
    constructor(privateKey: Uint8Array) {
        if (Secp256k1.isValidPrivateKey(privateKey)) {
            // Defensive copies to avoid external mutation.
            this.#privateKey = new Uint8Array(privateKey);
            this.address = Address.ofPrivateKey(privateKey);
        } else {
            throw new InvalidPrivateKeyError(
                `${FQP}PrivateKeySigner.constructor(privateKey: Uint8Array)`,
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
     * Finalizes the transaction request based on its sponsorship intent and signature availability.
     *
     * - If the `transactionRequest` is intended to be sponsored and has both origin and gas payer signatures,
     *   a new `TransactionRequest` is created, combining these signatures;
     *   if only one or neither signature is present, the original `transactionRequest` is returned unmodified.
     *
     * - If the `transactionRequest` is not intended to be sponsored,
     *   if the origin signature is present, a new `TransactionRequest` is created based on the origin signature;
     *   otherwise, the original request is returned as-is.
     *
     * @param {TransactionRequest} transactionRequest - The transaction request to be finalized, which includes
     * details of the transaction, its signatures (if available), and its sponsorship intent.
     * @return {TransactionRequest} The finalized `TransactionRequest` object, updated based on the sponsorship
     * intent and available signatures.
     *
     * @remarks Security auditable method, depends on
     * - concatBytes from [noble-curves](https://github.com/paulmillr/noble-curves).
     */
    private static finalize(
        transactionRequest: TransactionRequest
    ): TransactionRequest {
        if (transactionRequest.isIntendedToBeSponsored) {
            // Intended to be sponsored.
            if (
                transactionRequest.originSignature.length > 0 &&
                transactionRequest.gasPayerSignature.length > 0
            ) {
                // Both origin and gas payer signed.
                return new TransactionRequest(
                    { ...transactionRequest },
                    transactionRequest.originSignature,
                    transactionRequest.gasPayerSignature,
                    concatBytes(
                        transactionRequest.originSignature,
                        transactionRequest.gasPayerSignature
                    )
                );
            }
            // Not both origin and gas payer signed.
            return transactionRequest;
        }
        // Not intended to be sponsored.
        if (transactionRequest.originSignature.length > 0) {
            // Origin signed.
            return new TransactionRequest(
                { ...transactionRequest },
                transactionRequest.originSignature,
                transactionRequest.gasPayerSignature,
                transactionRequest.originSignature
            );
        }
        // Not intended to be sponsored, no origin signature.
        return transactionRequest;
    }

    /**
     * Signs a transaction request.
     * - If the transaction is intended to be sponsored,
     *   - if the beggar address is equal to the signer address, signs as origin/sender;
     *   - if the beggar address differs from the signer address, signs as gas payer.
     * - If the transaction is not intended to be sponsored, signs as origin/sender.
     *
     * @param {TransactionRequest} transactionRequest - The transaction request object to be signed.
     * @return {TransactionRequest} The signed transaction request object.
     * @throws {VeChainSDKError} Throws an error if the signing process fails.
     *
     * @security Security auditable method, depends on
     * - {@link PrivateKeySigner.finalize};
     * - {@link PrivateKeySigner.signAsGasPayer};
     * - {@link PrivateKeySigner.signAsOrigin}.
     */
    public sign(transactionRequest: TransactionRequest): TransactionRequest {
        try {
            if (transactionRequest.beggar !== undefined) {
                if (transactionRequest.beggar.isEqual(this.address)) {
                    return PrivateKeySigner.finalize(
                        this.signAsOrigin(transactionRequest)
                    );
                }
                return PrivateKeySigner.finalize(
                    this.signAsGasPayer(transactionRequest)
                );
            }
            return PrivateKeySigner.finalize(
                this.signAsOrigin(transactionRequest)
            );
        } catch (error) {
            throw new VeChainSDKError(
                `${FQP}PrivateKeySigner.sign(transactionRequest: TransactionRequest): TransactionRequest`,
                'unable to sign',
                { transactionRequest },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Signs a transaction request as a gas payer using a private key.
     *
     * @param {TransactionRequest} transactionRequest - The transaction request to sign,
     * which includes all necessary transaction details.
     * @return {TransactionRequest} The signed transaction request with updated gas payer signature.
     * @throws {InvalidPrivateKeyError} Throws an error if the private key is not available.
     *
     * @remarks Security auditable method, depends on
     * - {@link Blake2b256.of};
     * - concatBytes from [noble-curves](https://github.com/paulmillr/noble-curves);
     * - {@link Secp256k1.sign}.
     */
    private signAsGasPayer(
        transactionRequest: TransactionRequest
    ): TransactionRequest {
        if (this.#privateKey !== null) {
            const originHash = Blake2b256.of(
                TransactionRequestRLPCodec.encode(transactionRequest, true)
            ).bytes;
            const gasPayerHash = Blake2b256.of(
                concatBytes(
                    originHash,
                    transactionRequest.beggar?.bytes ?? new Uint8Array()
                )
            ).bytes;
            const gasPayerSignature = Secp256k1.sign(
                gasPayerHash,
                this.#privateKey
            );
            return new TransactionRequest(
                { ...transactionRequest },
                transactionRequest.originSignature,
                gasPayerSignature,
                transactionRequest.signature
            );
        }
        throw new InvalidPrivateKeyError(
            `${FQP}PrivateKeySigner.signAsGasPayer(transactionRequest: TransactionRequest): TransactionRequest`,
            'no private key'
        );
    }

    /**
     * Signs the given transaction request as the origin using the private key.
     *
     * @param {TransactionRequest} transactionRequest - The transaction request to be signed.
     * @return {TransactionRequest} A new instance of TransactionRequest with the origin signature included.
     * @throws {InvalidPrivateKeyError} If no private key is available for signing.
     *
     * @remarks Security auditable method, depends on
     * - {@link Blake2b256.of};
     * - concatBytes from [noble-curves](https://github.com/paulmillr/noble-curves);
     * - {@link Secp256k1.sign}.
     */
    private signAsOrigin(
        transactionRequest: TransactionRequest
    ): TransactionRequest {
        if (this.#privateKey !== null) {
            const originHash = Blake2b256.of(
                TransactionRequestRLPCodec.encode(transactionRequest, true)
            ).bytes;
            const originSignature = Secp256k1.sign(
                originHash,
                this.#privateKey
            );
            return new TransactionRequest(
                { ...transactionRequest },
                originSignature,
                transactionRequest.gasPayerSignature,
                transactionRequest.signature
            );
        }
        throw new InvalidPrivateKeyError(
            `${FQP}PrivateKeySigner.signAsOrigin(transactionRequest: TransactionRequest): TransactionRequest`,
            'no private key'
        );
    }
}

export { PrivateKeySigner };
