import { ThorId } from '@vechain/sdk-core';
import { ethGetTransactionReceipt } from '../eth_getTransactionReceipt';
import {
    debugFormatter,
    type TracerReturnTypeRPC
} from '../../../../formatter';
import {
    InvalidDataType,
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    stringifyData
} from '@vechain/sdk-errors';
import {
    type ThorClient,
    type TraceReturnType,
    type TracerName
} from '../../../../../../thor-client';
import { RPC_DOCUMENTATION_URL } from '../../../../../../utils';
import { type TraceOptionsRPC } from './types';

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
const debugTraceTransaction = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<TracerReturnTypeRPC<'call'> | TracerReturnTypeRPC<'prestate'>> => {
    // Input validation
    if (
        params.length !== 2 ||
        typeof params[0] !== 'string' ||
        typeof params[1] !== 'object'
    )
        throw new JSONRPCInvalidParams(
            'debug_traceTransaction',
            -32602,
            `Invalid input params for "debug_traceTransaction" method. See ${RPC_DOCUMENTATION_URL} for details.`,
            { params }
        );

    // Init params
    const [transactionId, traceOptions] = params as [string, TraceOptionsRPC];

    // Invalid transaction ID
    if (!ThorId.isValid(transactionId)) {
        throw new InvalidDataType(
            'debug_traceTransaction()',
            'Invalid transaction ID given as input. Input must be an hex string of length 64.',
            { transactionId }
        );
    }

    // Tracer to use
    const tracerToUse: TracerName =
        traceOptions.tracer === 'callTracer' ? 'call' : 'prestate';

    try {
        const transactionReceipt = await ethGetTransactionReceipt(thorClient, [
            transactionId
        ]);

        const trace = (await thorClient.debug.traceTransactionClause(
            {
                target: {
                    blockID: transactionReceipt?.blockHash as string,
                    transaction: transactionReceipt?.transactionHash as string,
                    clauseIndex: 0
                },
                config: {}
            },
            tracerToUse
        )) as TraceReturnType<'call'> | TraceReturnType<'prestate'>;

        return debugFormatter.formatToRPCStandard(
            tracerToUse as 'call' | 'prestate',
            trace
        );
    } catch (e) {
        throw new JSONRPCInternalError(
            'debug_traceTransaction()',
            -32603,
            'Method "debug_traceTransaction" failed.',
            {
                params: stringifyData(params),
                url: thorClient.httpClient.baseURL,
                innerError: stringifyData(e)
            }
        );
    }
};

export { debugTraceTransaction };
