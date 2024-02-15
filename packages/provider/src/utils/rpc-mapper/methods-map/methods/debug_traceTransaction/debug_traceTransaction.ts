import { type ThorClient } from '@vechain/vechain-sdk-network';
import {
    assert,
    buildProviderError,
    DATA,
    JSONRPC
} from '@vechain/vechain-sdk-errors';
import { assertValidTransactionID } from '@vechain/vechain-sdk-core';
import type {
    TraceReturnType,
    TracerName
} from '@vechain/vechain-sdk-network/src/thor-client/debug';
import { ethGetTransactionReceipt } from '../eth_getTransactionReceipt';
import { type TraceOptionsRPC } from './types';
import {
    debugFormatter,
    type TracerReturnTypeRPC
} from '../../../../formatter/debug';

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
 * @throws {ProviderRpcError} - Will throw an error if the debug fails.
 * @throws {InvalidDataTypeError} - Will throw an error if the params are invalid.
 */
const debugTraceTransaction = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<TracerReturnTypeRPC<'call'> | TracerReturnTypeRPC<'prestate'>> => {
    // Check input params
    assert(
        params.length === 2 &&
            typeof params[0] === 'string' &&
            typeof params[1] === 'object',
        DATA.INVALID_DATA_TYPE,
        `Invalid params length, expected the transactionHash and 1 object containing the options for trace: \n {` +
            `\n\ttracer - string to specify the type of tracer. Currently, it supports callTracer and prestateTracer.` +
            `\n\ttimeout - string - A duration string of decimal numbers that overrides the default timeout of 5 seconds for JavaScript-based tracing calls. Max timeout is "10s". Valid time units are "ns", "us", "ms", "s" each with an optional fraction, such as "300ms" or "2s45ms"` +
            `\n\ttracerConfig - Object to specify configurations for the tracer. It has the following parameters:` +
            `\n\tonlyTopCall - boolean Setting this to true will only trace the main (top-level) call and none of the sub-calls. This avoids extra processing for each call frame if only the top-level call info are required (useful for getting revertReason)` +
            `\n}.`
    );

    // Assert valid transaction id
    assertValidTransactionID(params[0] as string);

    // Init params
    const [transactionId, traceOptions] = params as [string, TraceOptionsRPC];

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
        throw buildProviderError(
            JSONRPC.INTERNAL_ERROR,
            `Method 'debug_traceTransaction' failed: Error while debug transaction tracer\n
            Params: ${JSON.stringify(params)}\n
            URL: ${thorClient.httpClient.baseURL}`,
            {
                params,
                innerError: JSON.stringify(e)
            }
        );
    }
};

export { debugTraceTransaction };
