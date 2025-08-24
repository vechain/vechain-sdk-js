import { type Clause } from '@thor';
import { type Hex } from '@vcdm';

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
    isSponsored?: boolean;
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
    public readonly isSponsored: boolean;

    /**
     * Constructs an instance of the class with the given transaction request parameters.
     *
     * @param {TransactionRequestParam} params - An object containing the parameters for the transaction request.
     * @param {Hex} params.blockRef - Reference to the specific block.
     * @param {number} params.chainTag - Identifier for the blockchain network.
     * @param {Array} params.clauses - Array of clauses representing transaction actions.
     * @param {Hex|null} params.dependsOn - Reference to a dependent transaction if present.
     * @param {number} params.expiration - Number of blocks after which the transaction expires.
     * @param {bigint} params.gas - The gas limit for the transaction.
     * @param {bigint} params.gasPriceCoef - Coefficient for the gas price.
     * @param {number} params.nonce - Unique value to ensure transaction uniqueness.
     * @param {boolean} params.isSponsored - Indicates if the transaction is sponsored, `false` by default.
     */
    public constructor({
        blockRef,
        chainTag,
        clauses,
        dependsOn,
        expiration,
        gas,
        gasPriceCoef,
        nonce,
        isSponsored = false
    }: TransactionRequestParam) {
        this.blockRef = blockRef;
        this.chainTag = chainTag;
        this.clauses = clauses;
        this.dependsOn = dependsOn;
        this.expiration = expiration;
        this.gas = gas;
        this.gasPriceCoef = gasPriceCoef;
        this.nonce = nonce;
        this.isSponsored = isSponsored;
    }

    /**
     * Checks if the transaction request is signed.
     *
     * @return {boolean} `false`, because a `TransactionRequest` instance is not signed yet.
     */
    public isSigned(): boolean {
        return false;
    }
}

export { TransactionRequest, type TransactionRequestParam };
