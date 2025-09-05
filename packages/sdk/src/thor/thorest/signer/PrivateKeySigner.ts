import {
    Address,
    Blake2b256,
    InvalidPrivateKeyError,
    Secp256k1,
    UnsupportedOperationError
} from '@common';
import {
    SignedTransactionRequest,
    SponsoredTransactionRequest,
    type TransactionRequest
} from '@thor/thorest/model';
import { RLPCodec } from './RLPCodec';
import { type Signer } from './Signer';
import * as nc_utils from '@noble/curves/abstract/utils';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/sdk/src/thor/thorest/signer/PrivateKeySigner.ts!';

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
     * Signs a transaction request using the private key associated with the signer.
     *
     * @param {TransactionRequest} transactionRequest - The transaction request to be signed.
     * @return {SignedTransactionRequest} A signed transaction request containing the original transaction details along with the generated signatures and the signing origin.
     * @throws {InvalidPrivateKeyError} Throws an error if the private key is not set or invalid.
     *
     * @remarks Security audited class, depends on
     * - {@link Blake2b256.of};
     * - {@link Secp256k1.sign}.
     * - Follow links for additional security notes.
     */
    private signTransactionRequest(
        transactionRequest: TransactionRequest
    ): SignedTransactionRequest {
        if (this.#privateKey !== null) {
            const hash = Blake2b256.of(
                RLPCodec.encode(transactionRequest)
            ).bytes;
            const signature = Secp256k1.sign(hash, this.#privateKey);
            return new SignedTransactionRequest({
                blockRef: transactionRequest.blockRef,
                chainTag: transactionRequest.chainTag,
                clauses: transactionRequest.clauses,
                dependsOn: transactionRequest.dependsOn,
                expiration: transactionRequest.expiration,
                gas: transactionRequest.gas,
                gasPriceCoef: transactionRequest.gasPriceCoef,
                nonce: transactionRequest.nonce,
                isIntendedToBeSponsored:
                    transactionRequest.isIntendedToBeSponsored,
                origin: this.address,
                originSignature: signature,
                signature
            });
        }
        throw new InvalidPrivateKeyError(
            `${FQP}PrivateKeySigner.sign(transactionRequest: TransactionRequest): SignedTransactionRequest`,
            'no private key'
        );
    }

    /**
     * Signs a given transaction request and returns the appropriate signed or sponsored transaction request.
     *
     * @param {TransactionRequest | SignedTransactionRequest} transactionRequest - The transaction request to be signed.
     * It can be either an unsigned transaction request or an already signed transaction request.
     * - If the request is an unsigned transaction request, it will be signed using the private key associated with the signer as origin/sender of the transaction.
     * - If the request is already signed, it will be sponsored and signed as gas payer, if it is eligible for sponsorship.
     * @return {SignedTransactionRequest | SponsoredTransactionRequest} A signed or sponsored transaction request resulting from the provided transaction request.
     *
     * @throws {InvalidPrivateKeyError} If the private key is null or invalid for signing the transaction.
     * @throws {UnsupportedOperationError} If the transaction request is not intended to be sponsored.
     *
     * @remarks Security audited class, depends on
     * - {@link Blake2b256.of};
     * - {@link Secp256k1.sign}.
     * - Follow links for additional security notes.
     */
    public sign(
        transactionRequest: TransactionRequest | SignedTransactionRequest
    ): SignedTransactionRequest | SponsoredTransactionRequest {
        if (transactionRequest instanceof SignedTransactionRequest) {
            return this.sponsorTransactionRequest(transactionRequest);
        }
        return this.signTransactionRequest(transactionRequest);
    }

    /**
     * Signs and sponsors as gas-payer a given transaction request if it is eligible for sponsorship.
     *
     * @param {SignedTransactionRequest} signedTransactionRequest - The signed transaction request to be sponsored.
     * This request must already include all necessary fields and signatures from the transaction originator.
     * @return {SponsoredTransactionRequest} The sponsored transaction request, which includes the signature from the gas payer,
     * as well as all relevant transaction details.
     *
     * @throws {InvalidPrivateKeyError} If the private key is null or invalid for signing the transaction.
     * @throws {UnsupportedOperationError} If the transaction request is not intended to be sponsored.
     *
     * @remarks Security audited class, depends on
     * - {@link Blake2b256.of};
     * - {@link Secp256k1.sign}.
     * - Follow links for additional security notes.
     */
    private sponsorTransactionRequest(
        signedTransactionRequest: SignedTransactionRequest
    ): SponsoredTransactionRequest {
        if (this.#privateKey !== null) {
            if (signedTransactionRequest.isIntendedToBeSponsored) {
                const hash = Blake2b256.of(
                    nc_utils.concatBytes(
                        Blake2b256.of(RLPCodec.encode(signedTransactionRequest))
                            .bytes,
                        signedTransactionRequest.origin.bytes
                    )
                ).bytes;
                const gasPayerSignature = Secp256k1.sign(
                    hash,
                    this.#privateKey
                );
                return new SponsoredTransactionRequest({
                    blockRef: signedTransactionRequest.blockRef,
                    chainTag: signedTransactionRequest.chainTag,
                    clauses: signedTransactionRequest.clauses,
                    dependsOn: signedTransactionRequest.dependsOn,
                    expiration: signedTransactionRequest.expiration,
                    gas: signedTransactionRequest.gas,
                    gasPriceCoef: signedTransactionRequest.gasPriceCoef,
                    nonce: signedTransactionRequest.nonce,
                    isIntendedToBeSponsored: true,
                    origin: signedTransactionRequest.origin,
                    originSignature: signedTransactionRequest.originSignature,
                    gasPayer: this.address,
                    gasPayerSignature,
                    signature: nc_utils.concatBytes(
                        signedTransactionRequest.originSignature,
                        gasPayerSignature
                    )
                });
            }
            throw new UnsupportedOperationError(
                `${FQP}PrivateKeySigner.sign(signedTransactionRequest: SignedTransactionRequest): DelegatedSignedTransactionRequest`,
                'transaction request is not intended to be sponsored'
            );
        }
        throw new InvalidPrivateKeyError(
            `${FQP}PrivateKeySigner.sign(signedTransactionRequest: SignedTransactionRequest): DelegatedSignedTransactionRequest`,
            'no private key'
        );
    }
}

export { PrivateKeySigner };
