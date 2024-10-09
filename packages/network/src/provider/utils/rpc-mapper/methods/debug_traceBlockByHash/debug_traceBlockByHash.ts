import { ThorId } from '@vechain/sdk-core';
import {
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    stringifyData
} from '@vechain/sdk-errors';
import { type ThorClient } from '../../../../../thor-client';
import {
    debugTraceTransaction,
    type TraceOptionsRPC
} from '../debug_traceTransaction';
import { ethGetBlockByHash } from '../eth_getBlockByHash';
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
const debugTraceBlockByHash = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<
    Array<{
        txHash: string;
        result: TracerReturnTypeRPC<'call'> | TracerReturnTypeRPC<'prestate'>;
    }>
> => {
    // Input validation
    if (
        params.length !== 2 ||
        typeof params[0] !== 'string' ||
        !ThorId.isValid(params[0]) ||
        typeof params[1] !== 'object'
    )
        throw new JSONRPCInvalidParams(
            'debug_traceBlockByHash',
            `Invalid input params for "debug_traceBlockByHash" method. See https://www.quicknode.com/docs/ethereum/debug_traceBlockByHash for details.`,
            { params }
        );

    // Init params
    const [blockHash, traceOptions] = params as [
        string,
        Omit<TraceOptionsRPC, 'timeout'>
    ];

    try {
        // Get block and transaction receipts
        const block = await ethGetBlockByHash(thorClient, [blockHash, false]);

        // if block does not exist
        if (block === null) {
            return [];
        }

        // Block exist, get traces
        const traces = [];

        // Trace each transaction in the block
        for (const transaction of block.transactions as string[]) {
            const trace = await debugTraceTransaction(thorClient, [
                transaction,
                { ...traceOptions, timeout: '5s' }
            ]);
            traces.push({
                txHash: transaction,
                result: trace
            });
        }

        // Return traces
        return traces;
    } catch (e) {
        throw new JSONRPCInternalError(
            'debug_traceBlockByHash()',
            'Method "debug_traceBlockByHash" failed.',
            {
                params: stringifyData(params),
                url: thorClient.httpClient.baseURL,
                innerError: stringifyData(e)
            }
        );
    }
};

export { debugTraceBlockByHash };
