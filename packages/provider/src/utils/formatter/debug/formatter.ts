import { type TraceReturnType } from '@vechain/sdk-network/src/thor-client/debug';
import { type TracerNameRPC, type TracerReturnTypeRPC } from './types';

/**
 * Output formatter for RPC debug endpoints:
 * * debug_traceTransaction
 * * debug_traceCall
 * It converts our endpoint calls output to the RPC standard output.
 *
 * @param tracerName - Tracer name used for the debug endpoint.
 * @param debugDetails - Debug details to be formatted.
 */
function formatToRPCStandard<TDebugType extends TracerNameRPC>(
    tracerName: TDebugType,
    debugDetails: TraceReturnType<TDebugType>
): TracerReturnTypeRPC<'call'> | TracerReturnTypeRPC<'prestate'> {
    if (tracerName === 'call') {
        return {
            ...(debugDetails as TraceReturnType<'call'>),

            // Empty revert reason
            revertReason: ''
        } satisfies TracerReturnTypeRPC<'call'>;
    }

    return Object.fromEntries(
        Object.entries(debugDetails as TraceReturnType<'prestate'>).map(
            ([key, value]) => {
                const valueWithoutEnergy = {
                    balance: value.balance,
                    code: value.code,
                    storage: value.storage
                } satisfies Omit<
                    {
                        balance: string;
                        energy: string;
                        code?: string;
                        storage?: Record<string, string>;
                    },
                    'energy'
                >;

                return [key, { ...valueWithoutEnergy, nonce: 0 }];
            }
        )
    ) satisfies TracerReturnTypeRPC<'prestate'>;
}

export { formatToRPCStandard };
