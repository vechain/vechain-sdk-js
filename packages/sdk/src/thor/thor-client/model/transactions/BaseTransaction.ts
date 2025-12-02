import { type Clause } from './Clause';
import { type Hex } from '@common/vcdm';
// Forward reference to avoid circular dependency with TransactionRequest
// TransactionRequest is only mentioned in JSDoc comments, not used in code
import { TransactionRequestRLPCodec } from '@thor/thor-client/rlp';

/**
 * Common parameters shared by all transaction types:
 * - TransactionRequest - A transaction request to **Thor** blockchain system.
 * - Transaction - A transaction read from the blockchain.
 */
interface BaseTransactionParams {
    /**
     * The last byte of the genesis block ID.
     */
    chainTag: number;

    /**
     * The first 8 bytes of the referenced block ID.
     */
    blockRef: Hex;

    /**
     * The expiration of the transaction, represented as the number of blocks after the blockRef
     */
    expiration: number;

    /**
     * An array of clauses that are executed by the transaction.
     */
    clauses: Clause[];

    /**
     * The max amount of gas that can be used by the transaction.
     */
    gas: bigint;

    /**
     * The coefficient used to calculate the final gas price of the transaction.
     * Used for legacy transactions (pre-EIP-1559).
     * Mutually exclusive with maxFeePerGas and maxPriorityFeePerGas.
     */
    gasPriceCoef?: bigint;

    /**
     * The maximum fee per gas the sender is willing to pay (EIP-1559 dynamic fees).
     * Used for dynamic fee transactions.
     * Mutually exclusive with gasPriceCoef.
     */
    maxFeePerGas?: bigint;

    /**
     * The maximum priority fee per gas the sender is willing to pay (EIP-1559 dynamic fees).
     * This is the tip paid to validators for transaction inclusion priority.
     * Used for dynamic fee transactions.
     * Mutually exclusive with gasPriceCoef.
     */
    maxPriorityFeePerGas?: bigint;

    /**
     * The transaction ID that this transaction depends on.
     */
    dependsOn: Hex | null;

    /**
     * The transaction nonce - a 64-bit unsigned integer.
     */
    nonce: bigint;
}

/**
 * Abstract base class for all transaction types in the VeChain Thor blockchain.
 * Contains common fields and validation logic shared by both transaction requests
 * and transactions read from the blockchain.
 */
abstract class BaseTransaction implements TransactionBody {
    /**
     * The last byte of the genesis block ID.
     */
    public readonly chainTag: number;

    /**
     * The first 8 bytes of the referenced block ID.
     */
    public readonly blockRef: Hex;

    /**
     * The expiration of the transaction, represented as the number of blocks after the blockRef
     */
    public readonly expiration: number;

    /**
     * An array of clauses that are executed by the transaction.
     */
    public readonly clauses: Clause[];

    /**
     * The max amount of gas that can be used by the transaction.
     */
    public readonly gas: bigint;

    /**
     * The coefficient used to calculate the final gas price of the transaction.
     * null for dynamic fee transactions.
     */
    public readonly gasPriceCoef?: bigint;

    /**
     * The maximum fee per gas the sender is willing to pay (EIP-1559 dynamic fees).
     * null for legacy transactions.
     */
    public readonly maxFeePerGas?: bigint;

    /**
     * The maximum priority fee per gas the sender is willing to pay (EIP-1559 dynamic fees).
     * null for legacy transactions.
     */
    public readonly maxPriorityFeePerGas?: bigint;

    /**
     * The transaction ID that this transaction depends on.
     */
    public readonly dependsOn: Hex | null;

    /**
     * The transaction nonce - a 64-bit unsigned integer stored as bigint.
     */
    public readonly nonce: bigint;

    /**
     * The reserved field for the transaction.
     */
    public readonly reserved?: {
        features?: number;
        unused?: Uint8Array[];
    };

    /**
     * Protected constructor to initialize common transaction fields.
     * Only accessible by subclasses.
     * @param {BaseTransactionParams} params - Common transaction parameters
     */
    protected constructor(params: TransactionBody) {
        this.chainTag = params.chainTag;
        this.blockRef = params.blockRef;
        this.expiration = params.expiration;
        this.clauses = params.clauses;
        this.gas = params.gas;
        this.gasPriceCoef = params.gasPriceCoef;
        this.maxFeePerGas = params.maxFeePerGas;
        this.maxPriorityFeePerGas = params.maxPriorityFeePerGas;
        this.dependsOn = params.dependsOn;
        this.nonce = params.nonce;
        this.reserved = params.reserved;
    }

    /**
     * Determines if this is a dynamic fee transaction (EIP-1559).
     * A transaction is considered dynamic if it has:
     * - maxFeePerGas > 0
     * - maxPriorityFeePerGas >= 0
     * - gasPriceCoef is null
     *
     * @return {boolean} `true` if this is a dynamic fee transaction, `false` otherwise.
     */
    public get isDynamicFee(): boolean {
        return (
            this.maxFeePerGas !== undefined &&
            this.maxFeePerGas > 0n &&
            this.maxPriorityFeePerGas !== undefined &&
            this.maxPriorityFeePerGas >= 0n &&
            this.gasPriceCoef === undefined
        );
    }

    /**
     * Determines if this is a legacy transaction (pre-EIP-1559).
     * A transaction is considered legacy if it has:
     * - gasPriceCoef >= 0
     * - maxFeePerGas is null
     * - maxPriorityFeePerGas is null
     *
     * @return {boolean} `true` if this is a legacy transaction, `false` otherwise.
     */
    public get isLegacy(): boolean {
        return (
            this.maxFeePerGas === undefined &&
            this.maxPriorityFeePerGas === undefined &&
            this.gasPriceCoef !== undefined &&
            this.gasPriceCoef >= 0n
        );
    }

    /**
     * Decodes an encoded transaction request into a TransactionRequest object.
     *
     * @param {Uint8Array} encoded - The encoded transaction request as a Uint8Array.
     * @return {TransactionRequest} The decoded transaction request.
     * @throws {InvalidEncodingError} If the encoded data does not match the expected format.
     */
    public static decode(
        encoded: Hex
    ): ReturnType<typeof TransactionRequestRLPCodec.decode> {
        return TransactionRequestRLPCodec.decode(encoded.bytes);
    }
}

export { BaseTransaction, type TransactionBody };
