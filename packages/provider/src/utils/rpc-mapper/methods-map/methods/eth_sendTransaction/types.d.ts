/**
 * Transaction object input type
 */
interface TransactionObjectInput {
    from: string;
    to?: string;
    gas?: string;
    gasPrice?: string;
    value?: string;
    data?: string;

    // Not supported
    maxFeePerGas?: string;
    maxPriorityFeePerGas?: string;
}

export type { TransactionObjectInput };
