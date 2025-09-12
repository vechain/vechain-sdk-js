import { type Clause } from '@thor';
import { type Hex } from '@common';

/**
 * Represents the parameters required to create a {@link TransactionRequest} instance.
 */
interface TransactionRequestParam {
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
     * Indicates if the gas cost transaction is sponsored by a "gas payer".
     */
    isIntendedToBeSponsored?: boolean;

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
     * Indicates if the gas cost transaction is sponsored by a "gas payer".
     */
    isIntendedToBeSponsored?: boolean;

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

    /**
     * Constructs an instance of the class with the given transaction request parameters.
     *
     * @param {TransactionRequestParam} params - An object containing the parameters for the transaction request.
     * @param {string} params.blockRef - Reference to the specific block.
     * @param {string} params.chainTag - Identifier for the blockchain network.
     * @param {Array} params.clauses - Array of clauses representing transaction actions.
     * @param {string|null} params.dependsOn - Reference to a dependent transaction if present.
     * @param {number} params.expiration - Number of blocks after which the transaction expires.
     * @param {number} params.gas - The gas limit for the transaction.
     * @param {number} params.gasPriceCoef - Coefficient for the gas price.
     * @param {string} params.nonce - Unique value to ensure transaction uniqueness.
     * @param {boolean} params.isIntendedToBeSponsored: boolean; - Indicates if the transaction is sponsored.
     *
     * @return {void} This constructor does not return a value.
     */
    public constructor(params: TransactionRequestParam) {
        this.blockRef = params.blockRef;
        this.chainTag = params.chainTag;
        this.clauses = params.clauses;
        this.dependsOn = params.dependsOn;
        this.expiration = params.expiration;
        this.gas = params.gas;
        this.gasPriceCoef = params.gasPriceCoef;
        this.nonce = params.nonce;
        this.isIntendedToBeSponsored = params.isIntendedToBeSponsored ?? false;
        this.maxFeePerGas = params.maxFeePerGas;
        this.maxPriorityFeePerGas = params.maxPriorityFeePerGas;
    }

    /**
     * Checks if the transaction request is signed.
     *
     * @return {boolean} `false`, because a `TransactionRequest` instance is not signed yet.
     */
    public isSigned(): boolean {
        return false;
    }

    /**
     * Determines if this is a dynamic fee transaction (EIP-1559).
     * A transaction is considered dynamic if it has maxFeePerGas or maxPriorityFeePerGas set.
     *
     * @return {boolean} `true` if this is a dynamic fee transaction, `false` for legacy.
     */
    public isDynamicFee(): boolean {
        return (
            this.maxFeePerGas !== undefined ||
            this.maxPriorityFeePerGas !== undefined
        );
    }
}

export { TransactionRequest, type TransactionRequestParam };
