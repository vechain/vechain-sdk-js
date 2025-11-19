"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugTraceBlockByHash = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const debug_traceTransaction_1 = require("../debug_traceTransaction");
const eth_getBlockByHash_1 = require("../eth_getBlockByHash");
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
const debugTraceBlockByHash = async (thorClient, params) => {
    // Input validation
    if (params.length !== 2 ||
        typeof params[0] !== 'string' ||
        !sdk_core_1.ThorId.isValid(params[0]) ||
        typeof params[1] !== 'object')
        throw new sdk_errors_1.JSONRPCInvalidParams('debug_traceBlockByHash', `Invalid input params for "debug_traceBlockByHash" method. See https://www.quicknode.com/docs/ethereum/debug_traceBlockByHash for details.`, { params });
    // Init params
    const [blockHash, traceOptions] = params;
    try {
        // Get block and transaction receipts
        const block = await (0, eth_getBlockByHash_1.ethGetBlockByHash)(thorClient, [blockHash, false]);
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
        throw new sdk_errors_1.JSONRPCInternalError('debug_traceBlockByHash()', 'Method "debug_traceBlockByHash" failed.', {
            params: (0, sdk_errors_1.stringifyData)(params),
            url: thorClient.httpClient.baseURL,
            innerError: (0, sdk_errors_1.stringifyData)(e)
        });
    }
};
exports.debugTraceBlockByHash = debugTraceBlockByHash;
