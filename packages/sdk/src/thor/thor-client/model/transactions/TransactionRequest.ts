import { type Clause } from './Clause';
import {
    type Address,
    Blake2b256,
    Hex,
    HexUInt,
    InvalidTransactionField
} from '@common';
import { TransactionRequestRLPCodec } from '@thor/thor-client/rlp/TransactionRequestRLPCodec';
import { type TransactionRequestJSON } from '@thor/thorest/json';
import { BaseTransaction, type BaseTransactionParams } from './BaseTransaction';
import { PrivateKeySigner } from '@thor/signer';

const FQP =
    'packages/sdk/src/thor/thor-client/model/transactions/TransactionRequest.ts!';

/**
 * Represents the parameters required to create a {@link TransactionRequest} instance.
 * Extends BaseTransactionParams with TransactionRequest-specific fields.
 */
interface TransactionRequestParam extends BaseTransactionParams {
    /**
     * The address of the account begging to pay the gas fee.
     * If specified, this transaction requires sponsored transaction (VIP-191).
     */
    beggar?: Address;
}

/**
 * Represents a transaction request to **Thor** blockchain system.
 * Encapsulates all information required to process and execute a transaction.
 */
class TransactionRequest
    extends BaseTransaction
    implements TransactionRequestParam
{
    // Inherited from TransactionRequestParam, used to compute the transaction request signature.

    /**
     * The address of the account begging to pay the gas fee.
     */
    public readonly beggar?: Address;

    /**
     * The signature of the sponsor delegated to pay the gas to execute the transaction request.
     */
    public readonly gasPayerSignature: Uint8Array;

    /**
     * The signature of the origin account sending and signing the transaction.
     */
    public readonly originSignature: Uint8Array;

    /**
     * The transaction signature, equal to
     * - originSignature, if the transaction is not intended to be sponsored, hence beggar is undefined;
     * - originSignature concatenated with gasPayerSignature, if the transaction is intended to be sponsored, hence beggar is defined.
     */
    public readonly signature: Uint8Array;

    /**
     * Constructs a new instance of the class with the provided parameters.
     *
     * @param {TransactionRequestParam} params - The transaction request parameters.
     * @param {Uint8Array} [originSignature] - Optional origin signature for the transaction.
     * @param {Uint8Array} [gasPayerSignature] - Optional gas payer signature for the transaction.
     * @param {Uint8Array} [signature] - Optional transaction signature
     * - If `beggar` is defined, the transaction is signed when both `originSignature` and `gasPayerSignature` are present.
     * - If `beggar` is undefined, the transaction is signed when `originSignature` is present.
     */
    public constructor(
        params: TransactionRequestParam,
        originSignature?: Uint8Array,
        gasPayerSignature?: Uint8Array,
        signature?: Uint8Array
    ) {
        super(params);
        if (
            TransactionRequest.isLegacy(params) ||
            TransactionRequest.isDynamicFee(params)
        ) {
            this.beggar = params.beggar;
            // Defensive copy of the signatures to prevent accidental mutation.
            this.originSignature = new Uint8Array(originSignature ?? []);
            // Defensive copy of the signatures to prevent accidental mutation.
            this.gasPayerSignature = new Uint8Array(gasPayerSignature ?? []);
            // Defensive copy of the signatures to prevent accidental mutation.
            this.signature = new Uint8Array(signature ?? []);
        } else {
            throw new InvalidTransactionField(
                `${FQP}constructor(params: TransactionRequestParam, originSignature? Uint8Array, gasPayerSignature? Uint8Array, signature?: Uint8Array)`,
                'Invalid parameters: or gasPriceCoef >= 0 or maxFeePerGas > 0 or maxPriorityFeePerGas >= 0',
                { params }
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
     * Computes and retrieves the Blake2b256 hash of the transaction request.
     *
     * The hash ignores the `beggar`, `gasPayerSignature`, `originSignature` and `signature` fields
     * because the signature fields need the hash to be computed beforehand;
     * the `beggar` field is not part of the Thor protocol to accept a transaction request,
     * the `beggar` address is encoded in the `signature` field once the transaction is signed.
     *
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
     * Determines if the fee configuration of a transaction request is dynamic (EIP-1559).
     *
     * @param {TransactionRequestParam} params - The transaction request parameters to evaluate for fee configuration.
     * @return {boolean} True if the transaction uses dynamic fee configuration, otherwise false.
     */
    private static isDynamicFee(params: TransactionRequestParam): boolean {
        return (
            params.maxFeePerGas !== undefined &&
            params.maxFeePerGas > 0n &&
            params.maxPriorityFeePerGas !== undefined &&
            params.maxPriorityFeePerGas >= 0n &&
            params.gasPriceCoef === undefined
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
    private static isLegacy(params: TransactionRequestParam): boolean {
        return (
            params.maxFeePerGas === undefined &&
            params.maxPriorityFeePerGas === undefined &&
            params.gasPriceCoef !== undefined &&
            params.gasPriceCoef >= 0n
        );
    }

    /**
     * Indicates if the `beggar` address asks the gas cost transaction is sponsored by a "gas payer".
     */
    public get isIntendedToBeSponsored(): boolean {
        return this.beggar !== undefined;
    }

    /**
     * Determines whether the instance is signed by verifying the presence of signatures.
     *
     * @return {boolean} True if the required signatures are present, otherwise false.
     * - If `beggar` is defined, the transaction is signed if both `originSignature` and `gasPayerSignature` are present.
     * - If `beggar` is undefined, the transaction is signed if `originSignature` is present.
     */
    public get isSigned(): boolean {
        if (this.beggar === undefined) {
            return (
                this.originSignature.length > 0 &&
                this.signature.length === this.originSignature.length
            );
        }
        return (
            this.originSignature.length > 0 &&
            this.gasPayerSignature.length > 0 &&
            this.signature.length ===
                this.originSignature.length + this.gasPayerSignature.length
        );
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
            beggar: this.beggar?.toString(),
            blockRef: this.blockRef.toString(),
            chainTag: this.chainTag,
            clauses: this.clauses.map((clause: Clause) => clause.toJSON()),
            dependsOn: this.dependsOn?.toString() ?? null,
            expiration: this.expiration,
            gas: this.gas,
            gasPayerSignature:
                this.gasPayerSignature.length > 0
                    ? HexUInt.of(this.gasPayerSignature).toString()
                    : undefined,
            gasPriceCoef: this.gasPriceCoef,
            maxFeePerGas: this.maxFeePerGas,
            maxPriorityFeePerGas: this.maxPriorityFeePerGas,
            nonce: HexUInt.of(this.nonce).toString(),
            originSignature:
                this.originSignature.length > 0
                    ? HexUInt.of(this.originSignature).toString()
                    : undefined,
            signature:
                this.signature.length > 0
                    ? HexUInt.of(this.signature).toString()
                    : undefined
        } satisfies TransactionRequestJSON;
    }
}

export { TransactionRequest, type TransactionRequestParam };
