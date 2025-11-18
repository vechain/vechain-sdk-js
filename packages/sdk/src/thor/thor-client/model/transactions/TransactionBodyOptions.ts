/**
 * Options for the transaction body creation
 * These options are used for the build transaction body method of the TransactionsModule class.
 */
interface TransactionBodyOptions {
    blockRef?: string;
    chainTag?: number;
    dependsOn?: string;
    expiration?: number;
    gasPriceCoef?: number;
    maxFeePerGas?: string | number;
    maxPriorityFeePerGas?: string | number;
    nonce?: string | number;
    gasSponsorRequester?: string;
}

export type { TransactionBodyOptions };
