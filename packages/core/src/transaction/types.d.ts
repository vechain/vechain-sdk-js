/**
 * Simple type for transaction clause.
 */
interface TransactionClause {
    /**
     * Destination address where:
     * * transfer token to or
     * * invoke contract method on.
     *
     * @note Set null destination to deploy a contract.
     */
    to: string | null;

    /**
     * Amount of token to transfer to the destination
     */
    value: string | number;

    /**
     * Input data for contract method invocation or deployment
     */
    data: string;
}

/**
 * Extended type for transaction clause that includes wallet related properties.
 */
interface ExtendedTransactionClause extends TransactionClause {
    /**
     * Optional comment for the clause, helpful for displaying what the clause is doing.
     */
    comment?: string;

    /**
     * Optional ABI for the contract method invocation.
     */
    abi?: string;
}

/**
 * Options for creating a clause.
 */
interface ClauseOptions {
    /**
     * Optional comment for the clause, helpful for displaying what the clause is doing.
     */
    comment?: string;

    /**
     * Optional ABI for the contract method invocation.
     */
    includeABI?: boolean;
}

/**
 * Type for transaction body.
 */
interface TransactionBody {
    /**
     * Last byte of genesis block ID
     */
    chainTag: number;

    /**
     * 8 bytes prefix of some block's ID
     */
    blockRef: string;

    /**
     * Constraint of time bucket
     */
    expiration: number;

    /**
     * Array of clauses
     */
    clauses: TransactionClause[];

    /**
     * Coefficient applied to base gas price [0,255]
     */
    gasPriceCoef: number;

    /**
     * Max gas provided for execution
     */
    gas: string | number;

    /**
     * ID of another tx that is depended
     */
    dependsOn: string | null;

    /**
     * Nonce value for various purposes.
     * Basic is to prevent replay attack by make transaction unique.
     * Every transaction with same chainTag, blockRef, ... must have different nonce.
     */
    nonce: string | number;

    /**
     * A reserved field intended for features use.
     *
     * In standard EVM transactions, this reserved field typically is not present.
     * However, it's been designed to cater to VIP-191, which deals with fee delegation.
     *
     * If the `features` within the `reserved` field is set as `1111...111`, it indicates that the transaction has been delegated.
     * The method to check if the transaction is delegated is:
     *
     * ```typescript
     * reserved.features & 1 === 1
     * ```
     *
     * @example
     *
     * 1.
     * ```typescript
     * feature = 111101;
     * isDelegated = (111101 & 111111) === 111101; // false (not delegated)
     * ```
     *
     * 2.
     * ```typescript
     * feature = 111111;
     * isDelegated = (111111 & 111111) === 111111; // true (delegated)
     * ```
     *
     * @remarks
     * For more information on the subject, refer to {@link https://github.com/vechain/VIPs/blob/master/vips/VIP-191.md | VIP-191}.
     */
    reserved?: {
        /**
         * Tx feature bits
         */
        features?: number;
        /**
         * Unused
         */
        unused?: Buffer[];
    };
}

export type {
    TransactionBody,
    TransactionClause,
    ExtendedTransactionClause,
    ClauseOptions
};
