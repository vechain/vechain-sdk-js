import { InvalidDataType } from '@vechain/sdk-errors';
import { thorest } from '../../utils';
import { type ContractTraceTarget } from './ContractTraceTarget';
import { type HttpClient } from '../../http';
import { type RetrieveStorageRange } from './RetrieveStorageRange';
import { type RetrieveStorageRangeOptions } from './RetrieveStorageRangeOptions';
import { type TransactionTraceTarget } from './TransactionTraceTarget';
import {
    type ContractTraceOptions,
    type TracerConfig,
    type TraceReturnType,
    type TracerName
} from './types';
import { HexUInt } from '@vechain/sdk-core';

/**
 * The class provides methods to debug the VeChain Thor blockchain.
 */
class DebugModule {
    /**
     * Creates an instance of the class with a specified HTTP client.
     *
     * @param {HttpClient} httpClient - The HTTP client instance to be used for making requests.
     */
    constructor(readonly httpClient: HttpClient) {}

    /**
     * Retrieve the storage range for a specified transaction trace target.
     *
     * @param {Object} input - The input parameters.
     * @param {TransactionTraceTarget} input.target - The transaction trace target containing the block ID, transaction, and clause index.
     * @param {RetrieveStorageRangeOptions} [input.options] - Optional settings for the retrieval process.
     * @param {Address} [input.options.address] - The address for which to retrieve the storage range.
     * @param {KeyStart} [input.options.keyStart] - The starting key for the storage range retrieval.
     * @param {number} [input.options.maxResult] - The maximum number of results to retrieve.
     *
     * @return {Promise<RetrieveStorageRange>} The storage range data for the specified target.
     *
     * @throws IllegalDataType If {@link TransactionTraceTarget} `input.target` has a negative `clauseIndex` or `transaction` property.
     */
    public async retrieveStorageRange(input: {
        target: TransactionTraceTarget;
        options?: RetrieveStorageRangeOptions;
    }): Promise<RetrieveStorageRange> {
        // Validate target. If invalid, assert
        this.validateTarget(input.target, 'retrieveStorageRange');

        // Parse target
        const parsedTarget = `${input.target.blockId}/${input.target.transaction}/${input.target.clauseIndex}`;

        // Send request
        return (await this.httpClient.post(
            thorest.debug.post.RETRIEVE_STORAGE_RANGE(),
            {
                query: {},
                body: {
                    target: parsedTarget,
                    address: input.options?.address?.toString(),
                    keyStart: input.options?.keyStart?.toString(),
                    maxResult: input.options?.maxResult
                },
                headers: {}
            }
        )) as RetrieveStorageRange;
    }

    /**
     * Traces a contract call using the specified target, options, and configuration.
     *
     * @param {Object} input - The input parameters for the contract call trace.
     * @param {ContractTraceTarget} [input.target] - The target contract details.
     * @param {ContractTraceOptions} [input.options] - Optional configuration for the contract trace.
     * @param {TracerConfig<typeof name>} [input.config] - Configuration for the tracer.
     * @param {TracerName} [name] - The name of the tracer to be used.
     * @return {Promise<TraceReturnType<typeof name>>} A promise that resolves to the trace result.
     */
    public async traceContractCall(
        input: {
            target?: ContractTraceTarget;
            options?: ContractTraceOptions;
            config?: TracerConfig<typeof name>;
        },
        name?: TracerName
    ): Promise<TraceReturnType<typeof name>> {
        // Send request
        return (await this.httpClient.post(
            thorest.debug.post.TRACE_CONTRACT_CALL(),
            {
                query: {},
                body: {
                    to: input.target?.to?.toString(),
                    data: input.target?.data?.toString(),
                    value:
                        typeof input.target?.value?.wei === 'bigint'
                            ? HexUInt.of(input.target.value.wei).toString()
                            : undefined,
                    name,
                    gas: input.options?.gas,
                    gasPrice: input.options?.gasPrice,
                    caller: input.options?.caller,
                    provedWork: input.options?.provedWork,
                    gasPayer: input.options?.gasPayer,
                    expiration: input.options?.expiration,
                    blockRef: input.options?.blockRef,
                    config: input.config
                },
                headers: {}
            }
        )) as TraceReturnType<typeof name>;
    }

    /**
     * Traces a transaction clause based on the provided target and configuration.
     *
     * Tracers are instrumental in monitoring and analyzing the execution flow within the EVM.
     *
     * @param {Object} input - The input object containing the transaction trace target and optional tracer config.
     * @param {TransactionTraceTarget} input.target - The target transaction details including block ID, transaction ID, and clause index.
     * @param {TracerConfig<typeof name>} [input.config] - Optional tracer configuration settings.
     * @param {TracerName} [name] - Optional name for the tracer.
     * @return {Promise<TraceReturnType<typeof name>>} - The result of the trace operation.
     * @throws {InvalidDataType} - If the `input.target.transaction`  or `input.target.clauseIndex` properties are invalid.
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
        const parsedTarget = `${input.target.blockId}/${input.target.transaction}/${input.target.clauseIndex}`;
        // Send request
        return (await this.httpClient.post(
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
     * Validates the properties of a TransactionTraceTarget object.
     *
     * @param {TransactionTraceTarget} target - The target object containing transaction details to be validated.
     * @param {string} functionName - The name of the function where this validation is invoked.
     * @throws {InvalidDataType} If the transaction or clauseIndex properties in the target object are invalid.
     */
    private validateTarget(
        target: TransactionTraceTarget,
        functionName: string
    ): void {
        // Validate target - transaction
        if (typeof target.transaction === 'number') {
            if (target.transaction < 0) {
                throw new InvalidDataType(
                    'DebugModule.validateTarget()',
                    `invalid transaction index '${target.transaction}' given as input for ${functionName}.`,
                    {
                        transaction: target.transaction,
                        functionName
                    }
                );
            }
        }
        // Validate target - clauseIndex
        if (target.clauseIndex < 0) {
            throw new InvalidDataType(
                'DebugModule.validateTarget()',
                `invalid clause index '${target.clauseIndex}' given as input for ${functionName}.`,
                { clauseIndex: target.clauseIndex, functionName }
            );
        }
    }
}

export { DebugModule };
