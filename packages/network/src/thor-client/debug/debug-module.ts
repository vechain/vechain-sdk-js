import { type ThorClient } from '../thor-client';
import {
    type TracerConfig,
    type TraceReturnType,
    type TracerName,
    type TransactionTraceTarget
} from './types';
import { thorest } from '../../utils';
import { assert, DATA } from '@vechain/vechain-sdk-errors';
import { dataUtils } from '@vechain/vechain-sdk-core';

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
        // Validate target - blockID
        assert(
            dataUtils.isThorId(target.blockID, true),
            DATA.INVALID_DATA_TYPE,
            `Invalid block ID '${target.blockID}' given as input for traceTransactionClause.`,
            { blockId: target.blockID }
        );

        // Validate target - transaction
        if (typeof target.transaction === 'string')
            assert(
                dataUtils.isThorId(target.transaction, true),
                DATA.INVALID_DATA_TYPE,
                `Invalid transaction id '${target.transaction}' given as input for traceTransactionClause.`,
                { transaction: target.transaction }
            );
        else
            assert(
                target.transaction >= 0,
                DATA.INVALID_DATA_TYPE,
                `Invalid transaction index '${target.transaction}' given as input for traceTransactionClause.`,
                { transaction: target.transaction }
            );

        // Validate target - clauseIndex
        assert(
            target.clauseIndex >= 0,
            DATA.INVALID_DATA_TYPE,
            `Invalid clause index '${target.clauseIndex}' given as input for traceTransactionClause.`,
            { clauseIndex: target.clauseIndex }
        );

        // Parse target
        const parsedTarget = `${target.blockID}/${target.transaction}/${target.clauseIndex}`;

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
