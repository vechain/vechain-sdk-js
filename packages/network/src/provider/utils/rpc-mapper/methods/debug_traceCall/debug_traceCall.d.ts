import { type ThorClient } from '../../../../../thor-client';
import { type TracerReturnTypeRPC } from '../../../formatter';
/**
 * RPC Method debug_traceCall implementation
 *
 * @link [debug_traceCall](https://www.quicknode.com/docs/ethereum/debug_traceCall)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *                * params[0]: transaction - object - This describes the transaction info with following properties:
 *                   * from - 20 bytes - Address the transaction is sent from.
 *                   * to - 20 bytes [Required] - Address the transaction is directed to.
 *                   * gas - Hexadecimal value of the gas provided for the transaction execution as hex string.
 *                   * gasPrice - Hexadecimal value of the gasPrice used for each paid gas.
 *                   * value - Hexadecimal of the value sent with this transaction.
 *                   * data - Hash of the method signature and encoded parameters.
 *                * params[1]: blockNumber - string - The block number parameter. A hexadecimal number or (latest, earliest or pending). (NOT SUPPORTED YET)
 *                * params[2]: options - object - This describes the options for the trace. It has the following parameters:
 *                   * tracer - string to specify the type of tracer. Currently, it supports callTracer and prestateTracer.
 *                   * tracerConfig - Object to specify configurations for the tracer. It has the following parameters:
 *                      * onlyTopCall - boolean Setting this to true will only trace the main (top-level) call and none of the sub-calls. This avoids extra processing for each call frame if only the top-level call info are required (useful for getting revertReason).
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
declare const debugTraceCall: (thorClient: ThorClient, params: unknown[]) => Promise<TracerReturnTypeRPC<"call"> | TracerReturnTypeRPC<"prestate">>;
export { debugTraceCall };
//# sourceMappingURL=debug_traceCall.d.ts.map