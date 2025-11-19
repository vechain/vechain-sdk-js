import { type TracerNameRPC, type TracerReturnTypeRPC } from './types';
import { type TraceReturnType } from '../../../../thor-client';
/**
 * Output formatter for RPC debug endpoints:
 * * debug_traceTransaction
 * * debug_traceCall
 * It converts our endpoint calls output to the RPC standard output.
 *
 * @param tracerName - Tracer name used for the debug endpoint.
 * @param debugDetails - Debug details to be formatted.
 */
declare function formatToRPCStandard<TDebugType extends TracerNameRPC>(tracerName: TDebugType, debugDetails: TraceReturnType<TDebugType>): TracerReturnTypeRPC<'call'> | TracerReturnTypeRPC<'prestate'>;
export { formatToRPCStandard };
//# sourceMappingURL=formatter.d.ts.map