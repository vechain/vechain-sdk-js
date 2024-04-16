/**
 * Transaction object input type
 */
interface BaseTransactionObjectInput {
    gas?: string;
    gasPrice?: string;
    value?: string;
    data?: string;
}

export type { BaseTransactionObjectInput };
