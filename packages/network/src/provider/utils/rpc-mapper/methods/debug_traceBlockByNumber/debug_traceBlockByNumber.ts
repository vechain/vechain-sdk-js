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
import { type TracerReturnTypeRPC } from '../../../formatter';
import { ethGetBlockByNumber } from '../eth_getBlockByNumber';

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
const debugTraceBlockByNumber = async (
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
        typeof params[1] !== 'object'
    )
        throw new JSONRPCInvalidParams(
            'debug_traceBlockByNumber',
            `Invalid input params for "debug_traceBlockByNumber" method. See https://www.quicknode.com/docs/ethereum/debug_traceBlockByNumber for details.`,
            { params }
        );

    // Init params
    const [blockNumber, traceOptions] = params as [
        string,
        Omit<TraceOptionsRPC, 'timeout'>
    ];

    try {
        // Get block and transaction receipts
        const block = await ethGetBlockByNumber(thorClient, [
            blockNumber,
            false
        ]);

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
            'debug_traceBlockByNumber()',
            'Method "debug_traceBlockByNumber" failed.',
            {
                params: stringifyData(params),
                url: thorClient.httpClient.baseURL,
                innerError: stringifyData(e)
            }
        );
    }
};

export { debugTraceBlockByNumber };
