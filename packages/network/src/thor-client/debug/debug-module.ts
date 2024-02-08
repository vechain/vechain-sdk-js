import { type ThorClient } from '../thor-client';
import {
    type ContractCallTraceContractTargetInput,
    type ContractCallTraceTransactionOptionsInput,
    type TracerConfig,
    type TraceReturnType,
    type TracerName,
    type TransactionTraceTarget
} from './types';
import { thorest } from '../../utils';
import { assert, DATA } from '@vechain/vechain-sdk-errors';
import { addressUtils, dataUtils } from '@vechain/vechain-sdk-core';

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
     *
     * @param input - The input for the trace transaction clause. It has:
     * * target - The target of the tracer. It is a combination of blockID, transaction (transaction ID or index into block), and clauseIndex.
     * * config - The configuration of the tracer. It is specific to the name of the tracer.
     * @param name - The name of the tracer to use. It determines Output and Input configuration.
     */
    public async traceTransactionClause(
        input: {
            target: TransactionTraceTarget;
            config?: TracerConfig<typeof name>;
        },
        name?: TracerName
    ): Promise<TraceReturnType<typeof name>> {
        // Validate target - blockID
        assert(
            dataUtils.isThorId(input.target.blockID, true),
            DATA.INVALID_DATA_TYPE,
            `Invalid block ID '${input.target.blockID}' given as input for traceTransactionClause.`,
            { blockId: input.target.blockID }
        );

        // Validate target - transaction
        if (typeof input.target.transaction === 'string')
            assert(
                dataUtils.isThorId(input.target.transaction, true),
                DATA.INVALID_DATA_TYPE,
                `Invalid transaction id '${input.target.transaction}' given as input for traceTransactionClause.`,
                { transaction: input.target.transaction }
            );
        else
            assert(
                input.target.transaction >= 0,
                DATA.INVALID_DATA_TYPE,
                `Invalid transaction index '${input.target.transaction}' given as input for traceTransactionClause.`,
                { transaction: input.target.transaction }
            );

        // Validate target - clauseIndex
        assert(
            input.target.clauseIndex >= 0,
            DATA.INVALID_DATA_TYPE,
            `Invalid clause index '${input.target.clauseIndex}' given as input for traceTransactionClause.`,
            { clauseIndex: input.target.clauseIndex }
        );

        // Parse target
        const parsedTarget = `${input.target.blockID}/${input.target.transaction}/${input.target.clauseIndex}`;

        // Send request
        return (await this.thor.httpClient.http(
            'POST',
            thorest.debug.post.TRACE_TRANSACTION_CLAUSE(),
            {
                query: {},
                body: {
                    target: parsedTarget,
                    name,
                    config: input.config
                },
                headers: {}
            }
        )) as TraceReturnType<typeof name>;
    }

    /**
     * Trace a contract call.
     *
     * This endpoint enables clients to create a tracer for a specific function call.
     * You can customize the tracer using various options to suit your debugging requirements.
     *
     * @param input - The input for the trace contract call. It has:
     * * contractInput - The contract call information.
     * * config - The configuration of the tracer. It is specific to the name of the tracer.
     * * transactionOptions - The transaction options.
     * @param name - The name of the tracer to use. It determines Output and Input configuration.
     */
    public async traceContractCall(
        input: {
            contractInput?: ContractCallTraceContractTargetInput;
            transactionOptions?: ContractCallTraceTransactionOptionsInput;
            config?: TracerConfig<typeof name>;
        },
        name?: TracerName
    ): Promise<TraceReturnType<typeof name>> {
        // Validate contractInput
        if (
            input.contractInput?.to !== undefined &&
            input.contractInput.to !== null
        ) {
            assert(
                addressUtils.isAddress(input.contractInput.to),
                DATA.INVALID_DATA_TYPE,
                `Invalid address '${input.contractInput.to}' given as input for traceContractCall.`,
                { address: input.contractInput.to }
            );
        }

        if (input.contractInput?.data !== undefined)
            assert(
                dataUtils.isHexString(input.contractInput.data, true),
                DATA.INVALID_DATA_TYPE,
                `Invalid data '${input.contractInput?.data}' given as input for traceContractCall.`,
                { data: input.contractInput?.data }
            );

        if (input.contractInput?.value !== undefined)
            assert(
                dataUtils.isHexString(input.contractInput.value, true),
                DATA.INVALID_DATA_TYPE,
                `Invalid value '${input.contractInput?.value}' given as input for traceContractCall.`,
                { value: input.contractInput?.value }
            );

        // Send request
        return (await this.thor.httpClient.http(
            'POST',
            thorest.debug.post.TRACE_CONTRACT_CALL(),
            {
                query: {},
                body: {
                    to: input.contractInput?.to,
                    data: input.contractInput?.data,
                    value: input.contractInput?.value,
                    name,
                    gas: input.transactionOptions?.gas,
                    gasPrice: input.transactionOptions?.gasPrice,
                    caller: input.transactionOptions?.caller,
                    provedWork: input.transactionOptions?.provedWork,
                    gasPayer: input.transactionOptions?.gasPayer,
                    expiration: input.transactionOptions?.expiration,
                    blockRef: input.transactionOptions?.blockRef,
                    config: input.config
                },
                headers: {}
            }
        )) as TraceReturnType<typeof name>;
    }
}

export { DebugModule };
