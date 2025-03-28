import { type BaseTransactionObjectInput } from '../types';

/**
 * Transaction object input type
 */
interface TransactionObjectInput extends BaseTransactionObjectInput {
    from: string;
    to?: string;
    chainId?: string;
}

export type { TransactionObjectInput };
