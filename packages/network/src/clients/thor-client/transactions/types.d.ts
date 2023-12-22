/* --- Input options start --- */

/**
 * Options for `waitForTransaction` method.
 */
interface WaitForTransactionOptions {
    /**
     * Timeout in milliseconds.
     * After this time, the method will throw an error.
     */
    timeoutMs?: number;
    /**
     * Interval in milliseconds.
     * The method will check the transaction status every `intervalMs` milliseconds.
     */
    intervalMs?: number;
}

/**
 * Options for `buildTransactionBody` method.
 */
interface TransactionBodyOptions {
    /**
     * Coefficient used to calculate the gas price for the transaction.
     * Value must be between 0 and 255.
     */
    gasPriceCoef?: number;

    /**
     * The expiration time of the transaction.
     * The transaction will expire after the number of blocks specified by this value.
     */
    expiration?: number;

    /**
     * The ID of the transaction that this transaction depends on.
     */
    dependsOn?: string;

    /**
     * Whether the transaction is delegated to another account for gas payment.
     */
    isDelegated?: boolean;
}

/**
 * Options for `signTransaction` method.
 */
interface SignTransactionOptions {
    /**
     * The URL of the endpoint of the delegator.
     */
    delegatorUrl?: string;

    /**
     * The private key of the delegator.
     */
    delegatorPrivatekey?: string;
}

/* --- Input options end --- */

/* --- Responses Outputs start --- */

/**
 * Represents the result of sending a transaction.
 *
 * @interface SendTransactionResult
 */
interface SendTransactionResult {
    /**
     * The unique identifier associated with the transaction.
     *
     * @type {string}
     */
    id: string;
}

/**
 * Represents the result of getting a delegation signature.
 */
interface GetDelegationSignatureResult {
    /**
     * The signature of the transaction.
     */
    signature: string;
}

/* --- Responses Outputs end --- */

export type {
    WaitForTransactionOptions,
    SendTransactionResult,
    TransactionBodyOptions,
    SignTransactionOptions,
    GetDelegationSignatureResult
};
