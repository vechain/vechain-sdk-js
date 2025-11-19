"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugTraceCall = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const formatter_1 = require("../../../formatter");
const utils_1 = require("../../../../../utils");
const sdk_core_1 = require("@vechain/sdk-core");
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
const debugTraceCall = async (thorClient, params) => {
    // Input validation
    if (params.length !== 3 ||
        typeof params[0] !== 'object' ||
        typeof params[1] !== 'string' ||
        typeof params[2] !== 'object')
        throw new sdk_errors_1.JSONRPCInvalidParams('debug_traceCall', `Invalid input params for "debug_traceCall" method. See ${utils_1.RPC_DOCUMENTATION_URL} for details.`, { params });
    // Init params
    const transactionOptions = params[0];
    const tracerOptions = params[2];
    // Tracer to use
    const tracerToUse = tracerOptions.tracer === 'callTracer' ? 'call' : 'prestate';
    try {
        const trace = (await thorClient.debug.traceContractCall({
            options: {
                caller: transactionOptions.from,
                gas: transactionOptions.gas !== undefined
                    ? parseInt(transactionOptions.gas, 16)
                    : undefined,
                gasPrice: transactionOptions.gasPrice
            },
            target: {
                to: typeof transactionOptions.to === 'string'
                    ? sdk_core_1.Address.of(transactionOptions.to)
                    : transactionOptions.to,
                data: typeof transactionOptions.data === 'string'
                    ? sdk_core_1.HexUInt.of(transactionOptions.data)
                    : undefined
            },
            config: tracerOptions.tracerConfig
        }, tracerToUse));
        return formatter_1.debugFormatter.formatToRPCStandard(tracerToUse, trace);
    }
    catch (e) {
        throw new sdk_errors_1.JSONRPCInternalError('debug_traceCall()', 'Method "debug_traceCall" failed.', {
            params: (0, sdk_errors_1.stringifyData)(params),
            url: thorClient.httpClient.baseURL,
            innerError: (0, sdk_errors_1.stringifyData)(e)
        });
    }
};
exports.debugTraceCall = debugTraceCall;
