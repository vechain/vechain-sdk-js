import { type ThorClient } from '../../../../../thor-client';
import { type TracerReturnTypeRPC } from '../../../formatter';
/**
 * RPC Method debug_traceTransaction implementation
 *
 * @link [debug_traceTransaction](https://www.quicknode.com/docs/ethereum/debug_traceTransaction)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: transactionHash - hex string - This describes the transaction hash of the transaction that needs to be traced.
 *                 * params[1]: options - object - This describes the options for the trace. It has the following parameters:
 *                    * tracer - string to specify the type of tracer. Currently, it supports callTracer and prestateTracer.
 *                    * timeout - string - A duration string of decimal numbers that overrides the default timeout of 5 seconds for JavaScript-based tracing calls.
 *                      Max timeout is "10s". Valid time units are "ns", "us", "ms", "s" each with an optional fraction, such as "300ms" or "2s45ms"
 *                    * tracerConfig - Object to specify configurations for the tracer. It has the following parameter:
 *                       * onlyTopCall - boolean Setting this to true will only trace the main (top-level) call and none of the sub-calls.
 *                         This avoids extra processing for each call frame if only the top-level call info are required (useful for getting revertReason).
 *
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
declare const debugTraceTransaction: (thorClient: ThorClient, params: unknown[]) => Promise<TracerReturnTypeRPC<"call"> | TracerReturnTypeRPC<"prestate">>;
export { debugTraceTransaction };
//# sourceMappingURL=debug_traceTransaction.d.ts.map