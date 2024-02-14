import { type ThorClient } from '@vechain/vechain-sdk-network';
import {
    assert,
    buildProviderError,
    DATA,
    JSONRPC
} from '@vechain/vechain-sdk-errors';
import type {
    TraceReturnType,
    TracerName
} from '@vechain/vechain-sdk-network/src/thor-client/debug';

/**
 * Type for trace options
 */
interface TraceCallRPC {
    tracer: 'callTracer' | 'prestateTracer';
    tracerConfig?: { onlyTopCall?: boolean };
}

/**
 * Transaction object input type
 */
interface TransactionObjectInput {
    from?: string;
    to: string;
    gas?: string;
    gasPrice?: string;
    value?: string;
    data?: string;
}

/**
 * RPC Method debug_traceCall implementation
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
 *                * params[1]: blockNumber - string - The block number parameter. An hexadecimal number or (latest, earliest or pending). (NOT SUPPORTED YET)
 *                * params[2]: options - object - This describes the options for the trace. It has the following parameters:
 *                   * tracer - string to specify the type of tracer. Currently, it supports callTracer and prestateTracer.
 *                   * tracerConfig - Object to specify configurations for the tracer. It has the following parameters:
 *                      * onlyTopCall - boolean Setting this to true will only trace the main (top-level) call and none of the sub-calls. This avoids extra processing for each call frame if only the top-level call info are required (useful for getting revertReason).
 */
const debugTraceCall = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<TraceReturnType<'call'> | TraceReturnType<'prestate'>> => {
    assert(
        params.length === 3 &&
            typeof params[0] === 'object' &&
            typeof params[1] === 'string' &&
            typeof params[2] === 'object',
        DATA.INVALID_DATA_TYPE,
        `Invalid params length, expected:\n* One transaction object containing transaction info with following properties: \n {` +
            `\tfrom: 20 bytes - Address the transaction is sent from.` +
            `\tto: 20 bytes [Required] - Address the transaction is directed to.` +
            `\tgas: Hexadecimal value of the gas provided for the transaction execution as hex string.` +
            `\tgasPrice: Hexadecimal value of the gasPrice used for each paid gas.` +
            `\tvalue: Hexadecimal of the value sent with this transaction.` +
            `\tdata: Hash of the method signature and encoded parameters` +
            `}.\n\n* the block number parameter. An hexadecimal number or (latest, earliest or pending).` +
            `\n\nAnd lastly, one object containing the options for trace: \n {` +
            `\ttracer - string to specify the type of tracer. Currently, it supports callTracer and prestateTracer.` +
            `\ttracerConfig - Object to specify configurations for the tracer. It has the following parameters:` +
            `\tonlyTopCall - boolean Setting this to true will only trace the main (top-level) call and none of the sub-calls. This avoids extra processing for each call frame if only the top-level call info are required (useful for getting revertReason)`
    );

    // Init params
    const transactionOptions = params[0] as TransactionObjectInput;
    const tracerOptions = params[2] as TraceCallRPC;

    // Tracer to use
    const tracerToUse: TracerName =
        tracerOptions.tracer === 'callTracer' ? 'call' : 'prestate';

    try {
        return (await thorClient.debug.traceContractCall(
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
    } catch (e) {
        throw buildProviderError(
            JSONRPC.INTERNAL_ERROR,
            `Method 'debug_traceCall' failed: Error while debug tracer call\n
            Params: ${JSON.stringify(params)}\n
            URL: ${thorClient.httpClient.baseURL}`,
            {
                params,
                innerError: JSON.stringify(e)
            }
        );
    }
};

export { debugTraceCall };
