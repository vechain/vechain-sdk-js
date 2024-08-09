import {
    type ThorClient,
    type TraceReturnType,
    type TracerName
} from '../../../../../../thor-client';
import {
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    stringifyData
} from '@vechain/sdk-errors';
import {
    debugFormatter,
    type TracerReturnTypeRPC
} from '../../../../formatter';

import { type TraceCallRPC, type TransactionObjectInput } from './types';
import { RPC_DOCUMENTATION_URL } from '../../../../../../utils';

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
const debugTraceCall = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<TracerReturnTypeRPC<'call'> | TracerReturnTypeRPC<'prestate'>> => {
    // Input validation
    if (
        params.length !== 3 ||
        typeof params[0] !== 'object' ||
        typeof params[1] !== 'string' ||
        typeof params[2] !== 'object'
    )
        throw new JSONRPCInvalidParams(
            'debug_traceCall',
            -32602,
            `Invalid input params for "debug_traceCall" method. See ${RPC_DOCUMENTATION_URL} for details.`,
            { params }
        );

    // Init params
    const transactionOptions = params[0] as TransactionObjectInput;
    const tracerOptions = params[2] as TraceCallRPC;

    // Tracer to use
    const tracerToUse: TracerName =
        tracerOptions.tracer === 'callTracer' ? 'call' : 'prestate';

    try {
        const trace = (await thorClient.debug.traceContractCall(
            {
                transactionOptions: {
                    caller: transactionOptions.from,
                    gas:
                        transactionOptions.gas !== undefined
                            ? parseInt(transactionOptions.gas, 16)
                            : undefined,
                    gasPrice: transactionOptions.gasPrice
                },
                contractInput: {
                    to: transactionOptions.to,
                    data: transactionOptions.data
                },
                config: tracerOptions.tracerConfig
            },
            tracerToUse
        )) as TraceReturnType<'call'> | TraceReturnType<'prestate'>;

        return debugFormatter.formatToRPCStandard(
            tracerToUse as 'call' | 'prestate',
            trace
        );
    } catch (e) {
        throw new JSONRPCInternalError(
            'debug_traceCall()',
            -32603,
            'Method "debug_traceCall" failed.',
            {
                params: stringifyData(params),
                url: thorClient.httpClient.baseURL,
                innerError: stringifyData(e)
            }
        );
    }
};

export { debugTraceCall };
