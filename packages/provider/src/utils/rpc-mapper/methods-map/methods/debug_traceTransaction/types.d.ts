/**
 * Type for trace options
 */
interface TraceOptionsRPC {
    tracer: 'callTracer' | 'prestateTracer';
    tracerConfig?: { onlyTopCall?: boolean };
    // Not supported yet
    timeout?: string;
}

export type { TraceOptionsRPC };
