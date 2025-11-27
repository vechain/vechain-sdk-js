import { type Clause } from './Clause';
import {
    Blake2b256,
    Hex,
    HexUInt,
    InvalidTransactionField,
    Secp256k1
} from '@common';
import { TransactionRequestRLPCodec } from '@thor/thor-client/rlp/TransactionRequestRLPCodec';
import { type TransactionRequestJSON } from '@thor/thorest/json';
import { BaseTransaction, type TransactionBody } from './BaseTransaction';
import { PrivateKeySigner } from '@thor/signer';

/**
 * Represents a transaction request to **Thor** blockchain system.
 * Encapsulates all information required to process and execute a transaction.
 */
class TransactionRequest extends BaseTransaction {
    /**
     * The transaction signature
     */
    public readonly signature?: Uint8Array;

    /**
     * Constructs a new instance of the class with the provided parameters.
     *
     * @param {TransactionBody} body - The transaction request parameters.
     * @param {Uint8Array} [signature] - Optional overall transaction signature
     */
    public constructor(body: TransactionBody, signature?: Uint8Array) {
        super(body);
        if (
            TransactionRequest.isLegacy(body) ||
            TransactionRequest.isDynamicFee(body)
        ) {
            this.signature =
                signature !== undefined ? new Uint8Array(signature) : undefined;
        } else {
            throw new InvalidTransactionField(
                'TransactionRequest.constructor',
                'Invalid parameters: or gasPriceCoef >= 0 or maxFeePerGas > 0 or maxPriorityFeePerGas >= 0',
                { body }
            );
        }
    }

    /**
     * Encodes a given transaction request into a RLP serialized format.
     *
     * @return {Hex} The serialized and encoded transaction request.
     */
    public get encoded(): Hex {
        return Hex.of(TransactionRequestRLPCodec.encode(this));
    }

    /**
     * Computes and retrieves the Blake2b256 hash of the unsigned transaction request.
     * The hash ignores the signature field
     * @return {Blake2b256} The Blake2b256 hash generated from the encoded transaction request.
     */
    public get hash(): Blake2b256 {
        return Blake2b256.of(TransactionRequestRLPCodec.encode(this, true));
    }

    /**
     * Determines if this is a dynamic fee transaction (EIP-1559).
     * A transaction is considered dynamic if it has
     * - `gasPriceCoef` undefined, and
     * - `maxFeePerGas` > 0, and
     * - `maxPriorityFeePerGas` >= 0.
     *
     * @return {boolean} `true` if this is a dynamic fee transaction, `false` for legacy.
     */
    public get isDynamicFee(): boolean {
        return TransactionRequest.isDynamicFee(this);
    }

    /**
     * Return `true` if the signature is complete, otherwise `false`.
     * For delegated transactions, the signature is complete if it has both origin and gas payer signatures.
     * For non-delegated transactions, the signature is complete if it has only one signature.
     *
     * @return {boolean} return `true` if the signature is defined and complete, otherwise `false`.
     */
    public get isSigned(): boolean {
        if (this.signature !== undefined) {
            if (this.isDelegated) {
                return this.signature.length === Secp256k1.SIGNATURE_LENGTH * 2;
            }
            return this.signature.length === Secp256k1.SIGNATURE_LENGTH;
        }
        return false;
    }

    /**
     * Determines if the fee configuration of a transaction request is dynamic (EIP-1559).
     *
     * @param {TransactionRequestParam} params - The transaction request parameters to evaluate for fee configuration.
     * @return {boolean} True if the transaction uses dynamic fee configuration, otherwise false.
     */
    private static isDynamicFee(body: TransactionBody): boolean {
        return (
            body.maxFeePerGas !== undefined &&
            body.maxFeePerGas > 0n &&
            body.maxPriorityFeePerGas !== undefined &&
            body.maxPriorityFeePerGas >= 0n &&
            body.gasPriceCoef === undefined
        );
    }

    /**
     * Determines if this is a legacy transaction (pre-EIP-1559).
     * A transaction is considered legacy if it has
     * - `gasPriceCoef` defined, and
     * - `maxFeePerGas` is undefined, and
     * - `maxPriorityFeePerGas` is undefined.
     */
    public get isLegacy(): boolean {
        return TransactionRequest.isLegacy(this);
    }

    /**
     * Determines whether a given transaction request parameter is using legacy gas pricing.
     *
     * @param {TransactionRequestParam} params - The transaction request parameters to evaluate.
     * @return {boolean} Returns true if the transaction request is considered legacy, otherwise false.
     */
    private static isLegacy(body: TransactionBody): boolean {
        return (
            body.maxFeePerGas === undefined &&
            body.maxPriorityFeePerGas === undefined &&
            body.gasPriceCoef !== undefined &&
            body.gasPriceCoef >= 0n
        );
    }

    /**
     * Return `true` if the transaction request is is delegated, else `false`.
     *
     * @return {boolean} `true` if the transaction is delegated, else `false`.
     */
    public get isDelegated(): boolean {
        // Check if is reserved or not
        const reserved = this.reserved ?? {};
        // Features
        const features = reserved.features ?? 0;
        // Fashion bitwise way to check if a number is even or not
        return (features & 1) === 1;
    }

    /**
     * Signs the transaction request using a raw private key for backward compatibility.
     *
     * Internally instantiates a {@link PrivateKeySigner}, delegates the signing flow,
     * and disposes the signer afterwards to avoid keeping the private key in memory.
     *
     * @param {Uint8Array} privateKey - Secp256k1 private key bytes.
     * @returns {TransactionRequest} A new, signed transaction request.
     */
    public sign(privateKey: Uint8Array): TransactionRequest {
        const signer = new PrivateKeySigner(privateKey);
        try {
            return signer.sign(this);
        } finally {
            signer.dispose();
        }
    }

    /**
     * Converts the TransactionRequest object into a JSON representation.
     *
     * @return {TransactionRequestJSON} The JSON representation of the TransactionRequest object.
     */
    public toJSON(): TransactionRequestJSON {
        return {
            blockRef: this.blockRef.toString(),
            chainTag: this.chainTag,
            clauses: this.clauses.map((clause: Clause) => clause.toJSON()),
            dependsOn: this.dependsOn?.toString() ?? null,
            expiration: this.expiration,
            gas: this.gas,
            gasPriceCoef: this.gasPriceCoef,
            maxFeePerGas: this.maxFeePerGas,
            maxPriorityFeePerGas: this.maxPriorityFeePerGas,
            nonce: HexUInt.of(this.nonce).toString(),
            signature:
                this.signature !== undefined && this.signature.length > 0
                    ? HexUInt.of(this.signature).toString()
                    : undefined
        } satisfies TransactionRequestJSON;
    }
}

export { TransactionRequest };
