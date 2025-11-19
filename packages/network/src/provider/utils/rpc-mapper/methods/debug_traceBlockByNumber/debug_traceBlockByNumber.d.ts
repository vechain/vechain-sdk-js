import { type ThorClient } from '../../../../../thor-client';
import { type TracerReturnTypeRPC } from '../../../formatter';
/**
 * RPC Method debug_traceBlockByNumber implementation
 *
 * @link [debug_traceBlockByNumber](https://www.quicknode.com/docs/ethereum/debug_traceBlockByNumber)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The block number to get as a hex string or "latest" or "finalized".
 *                 * params[1]: options - object - This describes the options for the trace. It has the following parameters:
 *                    * tracer - string to specify the type of tracer. Currently, it supports callTracer and prestateTracer.
 *                    * tracerConfig - Object to specify configurations for the tracer. It has the following parameter:
 *                       * onlyTopCall - boolean Setting this to true will only trace the main (top-level) call and none of the sub-calls.
 *                         This avoids extra processing for each call frame if only the top-level call info are required (useful for getting revertReason).
 *
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
declare const debugTraceBlockByNumber: (thorClient: ThorClient, params: unknown[]) => Promise<Array<{
    txHash: string;
    result: TracerReturnTypeRPC<"call"> | TracerReturnTypeRPC<"prestate">;
}>>;
export { debugTraceBlockByNumber };
//# sourceMappingURL=debug_traceBlockByNumber.d.ts.map