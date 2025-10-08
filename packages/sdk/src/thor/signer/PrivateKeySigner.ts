import {
    Address,
    Blake2b256,
    InvalidPrivateKeyError,
    Secp256k1
} from '@common';
import { TransactionRequest } from '@thor/thor-client/model/transactions';
import { type Signer } from './Signer';
import { TransactionRequestRLPCodec } from '@thor';

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
    private signNotIntendedToBeSponsoredTransactionRequest(
        transactionRequest: TransactionRequest
    ): TransactionRequest {
        if (this.#privateKey !== null) {
            const hash = Blake2b256.of(
                TransactionRequestRLPCodec.encodeToSign(transactionRequest)
            ).bytes;
            const originSignature = Secp256k1.sign(hash, this.#privateKey);
            return new TransactionRequest(
                { ...transactionRequest, beggar: undefined },
                originSignature,
                undefined,
                originSignature
            );
        }
        throw new InvalidPrivateKeyError(
            `${FQP}PrivateKeySigner.sign(transactionRequest: TransactionRequest): SignedTransactionRequest`,
            'no private key'
        );
    }

    public sign(transactionRequest: TransactionRequest): TransactionRequest {
        if (transactionRequest.beggar !== undefined) {
            if (transactionRequest.beggar.isEqual(this.address)) {
                // sign as origin
            }
            // sign as gas payer
        }
        return this.signNotIntendedToBeSponsoredTransactionRequest(
            transactionRequest
        );
    }
}

export { PrivateKeySigner };
