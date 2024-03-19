import { type ThorClient } from '../thor-client';
import {
    type ContractCallTraceContractTargetInput,
    type ContractCallTraceTransactionOptionsInput,
    type RetrieveStorageRangeInputOptions,
    type RetrieveStorageRangeReturnType,
    type TracerConfig,
    type TraceReturnType,
    type TracerName,
    type TransactionTraceTarget
} from './types';
import { thorest } from '../../utils';
import { assert, DATA } from '@vechain/sdk-errors';
import { addressUtils, Hex0x } from '@vechain/sdk-core';

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
     *
     * @throws{InvalidDataTypeError} - If the input is invalid.
     */
    public async traceTransactionClause(
        input: {
            target: TransactionTraceTarget;
            config?: TracerConfig<typeof name>;
        },
        name?: TracerName
    ): Promise<TraceReturnType<typeof name>> {
        // Validate target. If invalid, assert
        this.validateTarget(input.target, 'traceTransactionClause');

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
     *
     * @throws{InvalidDataTypeError} - If the input is invalid.
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
                'traceContractCall',
                addressUtils.isAddress(input.contractInput.to),
                DATA.INVALID_DATA_TYPE,
                `Invalid address '${input.contractInput.to}' given as input for traceContractCall.`,
                { address: input.contractInput.to }
            );
        }

        if (input.contractInput?.data !== undefined)
            assert(
                'traceContractCall',
                Hex0x.isValid(input.contractInput.data, true),
                DATA.INVALID_DATA_TYPE,
                `Invalid data '${input.contractInput?.data}' given as input for traceContractCall.`,
                { data: input.contractInput?.data }
            );

        if (input.contractInput?.value !== undefined)
            assert(
                'traceContractCall',
                Hex0x.isValid(input.contractInput.value),
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

    /**
     * Retrieve the storage range.
     *
     * This endpoint enables clients to retrieve the storage range for the
     * coordinates specified in the `input` parameter.
     *
     * @param input - the coordinates to retrieve the storage range. It has:
     * * target - {@link TransactionTraceTarget} specifies `blockID`,
     *           `transaction` address and `clauseIndex` number.
     * * options - {@link RetrieveStorageRangeInputOptions} specified the
     *           `address` if the contract or account to retrieve the
     *           storage range for. Nullable.
     */
    public async retrieveStorageRange(input: {
        target: TransactionTraceTarget;
        options?: RetrieveStorageRangeInputOptions;
    }): Promise<RetrieveStorageRangeReturnType> {
        // Validate target. If invalid, assert
        this.validateTarget(input.target, 'retrieveStorageRange');

        // Parse target
        const parsedTarget = `${input.target.blockID}/${input.target.transaction}/${input.target.clauseIndex}`;

        // Send request
        return (await this.thor.httpClient.http(
            'POST',
            thorest.debug.post.RETRIEVE_STORAGE_RANGE(),
            {
                query: {},
                body: {
                    target: parsedTarget,
                    address: input.options?.address,
                    keyStart: input.options?.keyStart,
                    maxResult: input.options?.maxResult
                },
                headers: {}
            }
        )) as RetrieveStorageRangeReturnType;
    }

    /**
     * Validate target of traceTransactionClause and retrieveStorageRange.
     *
     * @param target - Target of traceTransactionClause and retrieveStorageRange to validate.
     * @param functionName - The name of the function.
     *
     * @private
     *
     * @throws{InvalidDataTypeError} - If the input is invalid.
     */
    private validateTarget(
        target: TransactionTraceTarget,
        functionName: string
    ): void {
        // Validate target - blockID
        assert(
            'validateTarget',
            Hex0x.isThorId(target.blockID),
            DATA.INVALID_DATA_TYPE,
            `Invalid block ID '${target.blockID}' given as input for ${functionName}.`,
            { blockId: target.blockID }
        );

        // Validate target - transaction
        if (typeof target.transaction === 'string')
            assert(
                'validateTarget',
                Hex0x.isThorId(target.transaction),
                DATA.INVALID_DATA_TYPE,
                `Invalid transaction id '${target.transaction}' given as input for ${functionName}.`,
                { transaction: target.transaction }
            );
        else
            assert(
                'validateTarget',
                target.transaction >= 0,
                DATA.INVALID_DATA_TYPE,
                `Invalid transaction index '${target.transaction}' given as input for ${functionName}.`,
                { transaction: target.transaction }
            );

        // Validate target - clauseIndex
        assert(
            'validateTarget',
            target.clauseIndex >= 0,
            DATA.INVALID_DATA_TYPE,
            `Invalid clause index '${target.clauseIndex}' given as input for ${functionName}.`,
            { clauseIndex: target.clauseIndex }
        );
    }
}

export { DebugModule };
