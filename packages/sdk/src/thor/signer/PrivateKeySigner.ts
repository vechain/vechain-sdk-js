import {
    Address,
    Blake2b256,
    InvalidPrivateKeyError,
    InvalidSignatureError,
    Secp256k1
} from '@common';
import { TransactionRequest } from '@thor/thor-client/model/transactions';
import { Signer } from './Signer';
import { concatBytes } from '@noble/curves/utils.js';
import { log } from '@common/logging';

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
class PrivateKeySigner extends Signer {
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
     */
    constructor(privateKey: Uint8Array) {
        super();
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
     * Signs a transaction request.
     * - If the transaction is intended to be sponsored,
     *   - if the gas sponsorship requester address is equal to the signer address, signs as origin/sender;
     *   - if the gas sponsorship requester address differs from the signer address, signs as gas payer.
     * - If the transaction is not intended to be sponsored, signs as origin/sender.
     *
     * @param {TransactionRequest} transactionRequest - The transaction request object to be signed.
     * @return {TransactionRequest} The signed transaction request object.
     * @throws {InvalidSignatureError} Throws an error if the signing process fails.
     *
     * @security Security auditable method, depends on
     * - {@link PrivateKeySigner.finalize};
     * - {@link PrivateKeySigner.signAsGasPayer};
     * - {@link PrivateKeySigner.signAsOrigin}.
     */
    public sign(transactionRequest: TransactionRequest): TransactionRequest {
        try {
            if (transactionRequest.gasSponsorshipRequester !== undefined) {
                if (
                    transactionRequest.gasSponsorshipRequester.isEqual(
                        this.address
                    )
                ) {
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
            log.error({
                message: 'unable to sign transaction request',
                source: FQP,
                context: { transactionRequest }
            });
            throw new InvalidSignatureError(
                `${FQP}PrivateKeySigner.sign(transactionRequest: TransactionRequest): TransactionRequest`,
                'unable to sign',
                { transactionRequest },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Signs the given transaction request as a gas payer using a private key.
     *
     * @param {TransactionRequest} transactionRequest - The transaction request to sign,
     * which includes all necessary transaction details.
     * @return {TransactionRequest} The signed transaction request with updated gas payer signature.
     * @throws {InvalidPrivateKeyError} Throws an error if the private key is not available.
     *
     * @remarks Security auditable method, depends on
     * - {@link Blake2b256.of};
     * - `concatBytes` from [noble-curves](https://github.com/paulmillr/noble-curves);
     * - {@link Secp256k1.sign}.
     */
    private signAsGasPayer(
        transactionRequest: TransactionRequest
    ): TransactionRequest {
        if (this.#privateKey !== null) {
            const gasPayerHash = Blake2b256.of(
                concatBytes(
                    transactionRequest.hash.bytes, // Origin hash.
                    transactionRequest.gasSponsorshipRequester?.bytes ??
                        new Uint8Array()
                )
            ).bytes;
            return new TransactionRequest(
                { ...transactionRequest },
                transactionRequest.originSignature,
                Secp256k1.sign(gasPayerHash, this.#privateKey),
                transactionRequest.signature
            );
        }
        log.error({
            message:
                'no private key available to sign transaction request as gas payer',
            source: FQP
        });
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
     * - `concatBytes` from [noble-curves](https://github.com/paulmillr/noble-curves);
     * - {@link Secp256k1.sign}.
     */
    private signAsOrigin(
        transactionRequest: TransactionRequest
    ): TransactionRequest {
        if (this.#privateKey !== null) {
            return new TransactionRequest(
                { ...transactionRequest },
                Secp256k1.sign(
                    transactionRequest.hash.bytes, // Origin hash.
                    this.#privateKey
                ),
                transactionRequest.gasPayerSignature,
                transactionRequest.signature
            );
        }
        log.error({
            message:
                'no private key available to sign transaction request as origin',
            source: FQP
        });
        throw new InvalidPrivateKeyError(
            `${FQP}PrivateKeySigner.signAsOrigin(transactionRequest: TransactionRequest): TransactionRequest`,
            'no private key'
        );
    }
}

export { PrivateKeySigner };
