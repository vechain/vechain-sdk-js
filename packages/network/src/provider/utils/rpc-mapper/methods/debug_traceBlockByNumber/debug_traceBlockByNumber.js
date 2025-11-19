"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugTraceBlockByNumber = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const debug_traceTransaction_1 = require("../debug_traceTransaction");
const eth_getBlockByNumber_1 = require("../eth_getBlockByNumber");
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
const debugTraceBlockByNumber = async (thorClient, params) => {
    // Input validation
    if (params.length !== 2 ||
        typeof params[0] !== 'string' ||
        typeof params[1] !== 'object')
        throw new sdk_errors_1.JSONRPCInvalidParams('debug_traceBlockByNumber', `Invalid input params for "debug_traceBlockByNumber" method. See https://www.quicknode.com/docs/ethereum/debug_traceBlockByNumber for details.`, { params });
    // Init params
    const [blockNumber, traceOptions] = params;
    try {
        // Get block and transaction receipts
        const block = await (0, eth_getBlockByNumber_1.ethGetBlockByNumber)(thorClient, [
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
        for (const transaction of block.transactions) {
            const trace = await (0, debug_traceTransaction_1.debugTraceTransaction)(thorClient, [
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
    }
    catch (e) {
        throw new sdk_errors_1.JSONRPCInternalError('debug_traceBlockByNumber()', 'Method "debug_traceBlockByNumber" failed.', {
            params: (0, sdk_errors_1.stringifyData)(params),
            url: thorClient.httpClient.baseURL,
            innerError: (0, sdk_errors_1.stringifyData)(e)
        });
    }
};
exports.debugTraceBlockByNumber = debugTraceBlockByNumber;
