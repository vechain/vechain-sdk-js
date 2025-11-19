import { type ThorClient } from '../../../../../thor-client';
import { type TracerReturnTypeRPC } from '../../../formatter/debug/types';
/**
 * RPC Method debug_traceBlockByHash implementation
 *
 * @link [debug_traceBlockByHash](https://www.quicknode.com/docs/ethereum/debug_traceBlockByHash)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The block hash of block to get.
 *                 * params[1]: options - object - This describes the options for the trace. It has the following parameters:
 *                    * tracer - string to specify the type of tracer. Currently, it supports callTracer and prestateTracer.
 *                    * tracerConfig - Object to specify configurations for the tracer. It has the following parameter:
 *                       * onlyTopCall - boolean Setting this to true will only trace the main (top-level) call and none of the sub-calls.
 *                         This avoids extra processing for each call frame if only the top-level call info are required (useful for getting revertReason).
 *
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
declare const debugTraceBlockByHash: (thorClient: ThorClient, params: unknown[]) => Promise<Array<{
    txHash: string;
    result: TracerReturnTypeRPC<"call"> | TracerReturnTypeRPC<"prestate">;
}>>;
export { debugTraceBlockByHash };
//# sourceMappingURL=debug_traceBlockByHash.d.ts.map