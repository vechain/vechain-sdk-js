/**
 * Simple type for transaction clause.
 * @public
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
 * Type for transaction body.
 * @public
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
    clauses: Clause[];

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
     * Reserved field for future usage.
     * e.g. Fee delegation
     */
    reserved?: {
        /**
         * Tx feature bits
         */
        features?: number;
        unused?: Buffer[];
    };
}

export type { TransactionBody, TransactionClause };
