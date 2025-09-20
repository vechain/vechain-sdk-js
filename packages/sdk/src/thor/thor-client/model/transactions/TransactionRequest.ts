import { type Clause } from './Clause';
import { type Address, type Hex } from '@common';
import { type TransactionRequestJSON } from '@thor/thorest/json';

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

    /**
     * The address of the origin account sending and signing the transaction.
     */
    origin?: Address;
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
     * The address of the origin account sending and signing the transaction.
     */
    public readonly origin?: Address;

    /**
     * Constructs a new instance of the class using the provided transaction parameters.
     *
     * @param {TransactionRequestParam} params - The transaction request parameters.
     * @param {string} params.blockRef - The reference to the block.
     * @param {number} params.chainTag - The chain tag associated with the transaction.
     * @param {Array} params.clauses - The clauses defining the transaction.
     * @param {string} [params.dependsOn] - The ID of a transaction this transaction depends on.
     * @param {number} params.expiration - The number of blocks before the transaction expires.
     * @param {number} params.gas - The gas limit for the transaction.
     * @param {number} params.gasPriceCoef - The gas price coefficient.
     * @param {string} params.nonce - The unique identifier for the transaction.
     * @param {boolean} [params.isIntendedToBeSponsored=false] - Specifies if the transaction is intended to be sponsored.
     * @param {number} [params.maxFeePerGas] - The maximum fee per unit of gas.
     * @param {number} [params.maxPriorityFeePerGas] - The maximum priority fee per unit of gas.
     *
     * @return {void} This is a constructor and does not return a value.
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
        this.origin = params.origin;
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

    /**
     * Checks if the transaction request is signed.
     *
     * @return {boolean} `false`, because a `TransactionRequest` instance is not signed yet.
     */
    public isSigned(): boolean {
        return false;
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
            isIntendedToBeSponsored: this.isIntendedToBeSponsored ?? false,
            gas: this.gas,
            gasPriceCoef: this.gasPriceCoef,
            maxFeePerGasCoef:
                this.maxFeePerGas === undefined
                    ? undefined
                    : this.maxFeePerGas > 0n
                      ? this.maxFeePerGas
                      : undefined,
            maxPriorityFeePerGasCoef:
                this.maxPriorityFeePerGas === undefined
                    ? undefined
                    : this.maxPriorityFeePerGas > 0n
                      ? this.maxPriorityFeePerGas
                      : undefined,
            nonce: this.nonce,
            origin: this.origin?.toString()
        } satisfies TransactionRequestJSON;
    }
}

export { TransactionRequest, type TransactionRequestParam };
