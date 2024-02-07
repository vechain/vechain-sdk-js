import { type ThorClient } from '../thor-client';
import {
    type TracerConfig,
    type TraceReturnType,
    type TracerName,
    type TransactionTraceTarget
} from './types';
import { thorest } from '../../utils';

/** The `DebugModule` class encapsulates functionality to handle Debug
 * on the VechainThor blockchain.
 */
class DebugModule {
    /**
     * Initializes a new instance of the `Thor` class.
     * @param thor - The Thor instance used to interact with the vechain blockchain API.
     */
    constructor(readonly thor: ThorClient) {}

    /**
     * Trace transaction clause.
     *
     * This endpoint allows you to create a tracer for a specific clause.
     * Tracers are instrumental in monitoring and analyzing the execution flow within the EVM.
     * You can customize the tracer using various options to tailor it to your specific debugging needs.
     */
    public async traceTransactionClause(
        target: TransactionTraceTarget,
        name?: TracerName,
        config?: TracerConfig<typeof name>
    ): Promise<TraceReturnType<typeof name>> {
        // Parse target
        const parsedTarget =
            typeof target === 'string'
                ? target
                : `${target.blockID}/${target.transaction}/${target.clauseIndex}`;

        // Send request
        return (await this.thor.httpClient.http(
            'POST',
            thorest.debug.post.TRACE_TRANSACTION_CLAUSE(),
            {
                query: {},
                body: {
                    target: parsedTarget,
                    name,
                    config
                },
                headers: {}
            }
        )) as TraceReturnType<typeof name>;
    }
}

export { DebugModule };
