import { type Clause } from './Clause';
import { type Address, type Hex, HexUInt } from '@common';
import { type TransactionRequestJSON } from '@thor/thorest/json';

/**
 * Represents the parameters required to create a {@link TransactionRequest} instance.
 */
interface TransactionRequestParam {
    /**
     * The address of the account begging to pay the gas fee.
     */
    beggar?: Address;

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
    gasPriceCoef: bigint;

    /**
     * The transaction nonce is a 64-bit unsigned integer that is determined by the transaction sender.
     */
    nonce: number;

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
    public readonly beggar?: Address;

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
    public readonly gasPriceCoef: bigint;

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
     * The address of the sponsor delegated to pay the gas to execute the transaction request.
     */
    public readonly gasPayerSignature: Uint8Array;

    /**
     * The address of the origin account sending and signing the transaction.
     */
    public readonly originSignature: Uint8Array;

    /**
     * The transaction signature, equal to
     * - originSignature, if the transaction is not inteded to be sponsored, hence beggar is undefined;
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
     * - If `beggar` is defined, the transaction is signed if both `originSignature` and `gasPayerSignature` are present.
     * - If `beggar` is undefined, the transaction is signed if `originSignature` is present.
     */
    public constructor(
        params: TransactionRequestParam,
        originSignature?: Uint8Array,
        gasPayerSignature?: Uint8Array,
        signature?: Uint8Array
    ) {
        this.beggar = params.beggar;
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
    }

    /**
     * Determines if this is a dynamic fee transaction (EIP-1559).
     * A transaction is considered dynamic if it has maxFeePerGas or maxPriorityFeePerGas set.
     *
     * @return {boolean} `true` if this is a dynamic fee transaction, `false` for legacy.
     */
    public get isDynamicFee(): boolean {
        return (
            this.maxFeePerGas !== undefined ||
            this.maxPriorityFeePerGas !== undefined
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
            maxFeePerGas:
                this.maxFeePerGas === undefined
                    ? undefined
                    : this.maxFeePerGas > 0n
                      ? this.maxFeePerGas
                      : undefined,
            maxPriorityFeePerGas:
                this.maxPriorityFeePerGas === undefined
                    ? undefined
                    : this.maxPriorityFeePerGas > 0n
                      ? this.maxPriorityFeePerGas
                      : undefined,
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
