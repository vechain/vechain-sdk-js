import { type BaseTransactionObjectInput } from '../types';

/**
 * Type for trace options
 */
interface TraceCallRPC {
    tracer: 'callTracer' | 'prestateTracer';
    tracerConfig?: { onlyTopCall?: boolean };
}

/**
 * Transaction object input type
 */
interface TransactionObjectInput extends BaseTransactionObjectInput {
    from?: string;
    to: string;
}

export type { TraceCallRPC, TransactionObjectInput };
