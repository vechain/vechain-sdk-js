import { type Clause } from './Clause';
import {
    type Address,
    Blake2b256,
    type Hex,
    HexUInt,
    InvalidTransactionField,
    log
} from '@common';
import { TransactionRequestRLPCodec } from '@thor/thor-client/rlp/TransactionRequestRLPCodec';
import { type TransactionRequestJSON } from '@thor/thorest/json';

const FQP =
    'packages/sdk/src/thor/thor-client/model/transactions/TransactionRequest.ts!';

/**
 * Represents the parameters required to create a {@link TransactionRequest} instance.
 */
interface TransactionRequestParam {
    /**
     * The origin account, only set if the transaction is intended to be sponsored.
     */
    gasSponsorshipRequester?: Address;

    /**
     * The remote gas payer service URL.
     */
    gasPayerServiceUrl?: URL;

    /**
     * The first 8 bytes of the referenced block ID.
     */
    blockRef: Hex;

    /**
     * The last byte of the genesis block ID.
     */
    chainTag: number;

    /**
     * An array of clauses that are executed by the transaction.
     */
    clauses: Clause[];

    /**
     * The transaction ID that this transaction depends on.
     */
    dependsOn: Hex | null;

    /**
     * The expiration of the transaction, represented as the number of blocks after the blockRef
     */
    expiration: number;

    /**
     * The max amount of gas that can be used by the transaction.
     */
    gas: bigint;

    /**
     * The coefficient used to calculate the final gas price of the transaction.
     */
    gasPriceCoef?: bigint;

    /**
     * The maximum fee per gas the sender is willing to pay (EIP-1559 dynamic fees).
     * If specified, this transaction uses dynamic fee pricing instead of gasPriceCoef.
     */
    maxFeePerGas?: bigint;

    /**
     * The maximum priority fee per gas the sender is willing to pay (EIP-1559 dynamic fees).
     * This is the tip paid to validators for transaction inclusion priority.
     */
    maxPriorityFeePerGas?: bigint;

    /**
     * The transaction nonce is a 64-bit unsigned integer that is determined by the transaction sender.
     */
    nonce: number;
}

/**
 * Represents a transaction request to **Thor** blockchain system.
 * Encapsulates all information required to process and execute a transaction.
 */
class TransactionRequest implements TransactionRequestParam {
    // Inherited from TransactionRequestParam, used to compute the transaction request signature.

    /**
     * The address of the account begging to pay the gas fee.
     */
    public readonly gasSponsorshipRequester?: Address;

    /**
     * The remote gas payer service URL.
     */
    public readonly gasPayerServiceUrl?: URL;

    /**
     * The first 8 bytes of the referenced block ID.
     */
    public readonly blockRef: Hex;

    /**
     * The last byte of the genesis block ID.
     */
    public readonly chainTag: number;

    /**
     * An array of clauses that are executed by the transaction.
     */
    public readonly clauses: Clause[];

    /**
     * The transaction ID that this transaction depends on.
     */
    public readonly dependsOn: Hex | null;

    /**
     * The expiration of the transaction, represented as the number of blocks after the blockRef
     */
    public readonly expiration: number;

    /**
     * The max amount of gas that can be used by the transaction.
     */
    public readonly gas: bigint;

    /**
     * The coefficient used to calculate the final gas price of the transaction.
     */
    public readonly gasPriceCoef?: bigint;

    /**
     * The transaction nonce is a 64-bit unsigned integer that is determined by the transaction sender.
     */
    public readonly nonce: number;

    /**
     * The maximum fee per gas the sender is willing to pay (EIP-1559 dynamic fees).
     * If specified, this transaction uses dynamic fee pricing instead of gasPriceCoef.
     */
    public readonly maxFeePerGas?: bigint;

    /**
     * The maximum priority fee per gas the sender is willing to pay (EIP-1559 dynamic fees).
     * This is the tip paid to validators for transaction inclusion priority.
     */
    public readonly maxPriorityFeePerGas?: bigint;

    // TransactionRequest specific properties

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
     * - originSignature, if the transaction is not intended to be sponsored, hence gasSponsorshipRequester is undefined;
     * - originSignature concatenated with gasPayerSignature, if the transaction is intended to be sponsored, hence gasSponsorshipRequester is defined.
     */
    public readonly signature: Uint8Array;

    /**
     * Constructs a new instance of the class with the provided parameters.
     *
     * @param {TransactionRequestParam} params - The transaction request parameters.
     * @param {Uint8Array} [originSignature] - Optional origin signature for the transaction.
     * @param {Uint8Array} [gasPayerSignature] - Optional gas payer signature for the transaction.
     * @param {Uint8Array} [signature] - Optional transaction signature
     * - If `gasSponsorshipRequester` is defined, the transaction is signed when both `originSignature` and `gasPayerSignature` are present.
     * - If `gasSponsorshipRequester` is undefined, the transaction is signed when `originSignature` is present.
     */
    public constructor(
        params: TransactionRequestParam,
        originSignature?: Uint8Array,
        gasPayerSignature?: Uint8Array,
        signature?: Uint8Array
    ) {
        // check if gas payer service url provided but no requester address
        if (
            params.gasPayerServiceUrl !== undefined &&
            params.gasSponsorshipRequester === undefined
        ) {
            log.error({
                message:
                    'Invalid parameters: gas payer service url provided but no requester address',
                source: 'TransactionRequest.constructor',
                context: { params }
            });
            throw new InvalidTransactionField(
                `${FQP}constructor(params: TransactionRequestParam, originSignature? Uint8Array, gasPayerSignature? Uint8Array, signature?: Uint8Array)`,
                'Invalid parameters: gas payer service url provided but no requester address',
                { params }
            );
        }
        if (
            TransactionRequest.isLegacy(params) ||
            TransactionRequest.isDynamicFee(params)
        ) {
            // set the properties from the parameters
            this.gasSponsorshipRequester = params.gasSponsorshipRequester;
            this.gasPayerServiceUrl = params.gasPayerServiceUrl;
            this.blockRef = params.blockRef;
            this.chainTag = params.chainTag;
            this.clauses = params.clauses;
            this.dependsOn = params.dependsOn;
            this.expiration = params.expiration;
            this.gas = params.gas;
            this.gasPriceCoef = params.gasPriceCoef;
            this.nonce = params.nonce;
            this.maxFeePerGas = params.maxFeePerGas;
            this.maxPriorityFeePerGas = params.maxPriorityFeePerGas;
            // Defensive copy of the signatures to prevent accidental mutation.
            this.originSignature = new Uint8Array(originSignature ?? []);
            // Defensive copy of the signatures to prevent accidental mutation.
            this.gasPayerSignature = new Uint8Array(gasPayerSignature ?? []);
            // Defensive copy of the signatures to prevent accidental mutation.
            this.signature = new Uint8Array(signature ?? []);
        } else {
            log.error({
                message:
                    'Invalid parameters: or gasPriceCoef >= 0 or maxFeePerGas > 0 or maxPriorityFeePerGas >= 0',
                source: 'TransactionRequest.constructor',
                context: { params }
            });
            throw new InvalidTransactionField(
                `${FQP}constructor(params: TransactionRequestParam, originSignature? Uint8Array, gasPayerSignature? Uint8Array, signature?: Uint8Array)`,
                'Invalid parameters: or gasPriceCoef >= 0 or maxFeePerGas > 0 or maxPriorityFeePerGas >= 0',
                { params }
            );
        }
    }

    /**
     * Decodes an encoded transaction request into a TransactionRequest object.
     *
     * @param {Uint8Array} encoded - The encoded transaction request as a Uint8Array.
     * @return {TransactionRequest} The decoded transaction request.
     * @throws {InvalidEncodingError} If the encoded data does not match the expected format.
     */
    public static decode(encoded: Uint8Array): TransactionRequest {
        return TransactionRequestRLPCodec.decode(encoded);
    }

    /**
     * Encodes a given transaction request into a RLP serialized format.
     *
     * @return {Uint8Array} The serialized and encoded transaction request.
     */
    public get encoded(): Uint8Array {
        return TransactionRequestRLPCodec.encode(this);
    }

    /**
     * Computes and retrieves the Blake2b256 hash of the transaction request.
     *
     * The hash ignores the `gasSponsorshipRequester`, `gasPayerSignature`, `originSignature` and `signature` fields
     * because the signature fields need the hash to be computed beforehand;
     * the `gasSponsorshipRequester` field is not part of the Thor protocol to accept a transaction request,
     * the `gasSponsorshipRequester` address is encoded in the `signature` field once the transaction is signed.
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
     * Indicates if the `gasSponsorshipRequester` address is set.
     */
    public get isIntendedToBeSponsored(): boolean {
        return this.gasSponsorshipRequester !== undefined;
    }

    /**
     * Determines whether the instance is signed by verifying the presence of signatures.
     *
     * @return {boolean} True if the required signatures are present, otherwise false.
     * - If `gasSponsorshipRequester` is defined, the transaction is signed if both `originSignature` and `gasPayerSignature` are present.
     * - If `gasSponsorshipRequester` is undefined, the transaction is signed if `originSignature` is present.
     */
    public get isSigned(): boolean {
        if (this.gasSponsorshipRequester === undefined) {
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
     * Converts the TransactionRequest object into a JSON representation.
     *
     * @return {TransactionRequestJSON} The JSON representation of the TransactionRequest object.
     */
    public toJSON(): TransactionRequestJSON {
        return {
            gasSponsorshipRequester: this.gasSponsorshipRequester?.toString(),
            gasPayerServiceUrl: this.gasPayerServiceUrl?.toString(),
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
            nonce: this.nonce,
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
