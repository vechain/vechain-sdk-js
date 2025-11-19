"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugTraceTransaction = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const utils_1 = require("../../../../../utils");
const formatter_1 = require("../../../formatter");
const eth_getTransactionReceipt_1 = require("../eth_getTransactionReceipt");
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
const debugTraceTransaction = async (thorClient, params) => {
    // Input validation
    if (params.length !== 2 ||
        typeof params[0] !== 'string' ||
        typeof params[1] !== 'object')
        throw new sdk_errors_1.JSONRPCInvalidParams('debug_traceTransaction', `Invalid input params for "debug_traceTransaction" method. See ${utils_1.RPC_DOCUMENTATION_URL} for details.`, { params });
    // Init params
    const [transactionId, traceOptions] = params;
    // Invalid transaction ID
    if (!sdk_core_1.ThorId.isValid(transactionId)) {
        throw new sdk_errors_1.InvalidDataType('debug_traceTransaction()', 'Invalid transaction ID given as input. Input must be an hex string of length 64.', { transactionId });
    }
    // Tracer to use
    const tracerToUse = traceOptions.tracer === 'callTracer' ? 'call' : 'prestate';
    try {
        const transactionReceipt = await (0, eth_getTransactionReceipt_1.ethGetTransactionReceipt)(thorClient, [
            transactionId
        ]);
        const trace = (await thorClient.debug.traceTransactionClause({
            target: {
                blockId: sdk_core_1.ThorId.of(transactionReceipt?.blockHash),
                transaction: sdk_core_1.ThorId.of(transactionReceipt?.transactionHash),
                clauseIndex: 0
            },
            config: {}
        }, tracerToUse));
        return formatter_1.debugFormatter.formatToRPCStandard(tracerToUse, trace);
    }
    catch (e) {
        throw new sdk_errors_1.JSONRPCInternalError('debug_traceTransaction()', 'Method "debug_traceTransaction" failed.', {
            params: (0, sdk_errors_1.stringifyData)(params),
            url: thorClient.httpClient.baseURL,
            innerError: (0, sdk_errors_1.stringifyData)(e)
        });
    }
};
exports.debugTraceTransaction = debugTraceTransaction;
