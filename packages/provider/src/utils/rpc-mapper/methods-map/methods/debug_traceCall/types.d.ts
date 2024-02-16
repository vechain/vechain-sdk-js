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
interface TransactionObjectInput {
    from?: string;
    to: string;
    gas?: string;
    gasPrice?: string;
    value?: string;
    data?: string;
}

export type { TraceCallRPC, TransactionObjectInput };
