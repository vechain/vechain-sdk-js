import { InvalidDataType } from '@vechain/sdk-errors';
import { thorest } from '../../utils';
import { type ContractTraceTarget } from './ContractTraceTarget';
import { type HttpClient, isTraceEnabled } from '../../http';
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
     * Internal debug logger for this module (enabled when SDK_TRACE is true/1)
     */
    private log(step: string, data?: unknown): void {
        try {
            if (!isTraceEnabled()) return;
            const ts = new Date().toISOString();
            console.log(`\n🧭 [TRACE] DebugModule.${step} (${ts})`);
            if (data !== undefined) {
                const replacer = (_: string, value: unknown) =>
                    typeof value === 'bigint' ? (value as bigint).toString() : value;
                if (typeof data === 'string') {
                    console.log(data);
                } else {
                    console.log(JSON.stringify(data, replacer, 2));
                }
            }
        } catch {
            // best-effort logging, never throw
        }
    }

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
        this.log('retrieveStorageRange:start', { input });
        // Validate target. If invalid, assert
        this.validateTarget(input.target, 'retrieveStorageRange');
        this.log('retrieveStorageRange:validatedTarget', { target: input.target });

        // Parse target
        const parsedTarget = `${input.target.blockId}/${input.target.transaction}/${input.target.clauseIndex}`;
        this.log('retrieveStorageRange:parsedTarget', { parsedTarget });

        // Prepare request
        const endpoint = thorest.debug.post.RETRIEVE_STORAGE_RANGE();
        const body = {
            target: parsedTarget,
            address: input.options?.address?.toString(),
            keyStart: input.options?.keyStart?.toString(),
            maxResult: input.options?.maxResult
        };
        this.log('retrieveStorageRange:request', { endpoint, body });

        try {
            const result = (await this.httpClient.post(endpoint, {
                query: {},
                body,
                headers: {}
            })) as RetrieveStorageRange;
            this.log('retrieveStorageRange:response', result);
            return result;
        } catch (err) {
            this.log('retrieveStorageRange:error', err);
            throw err;
        }
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
        this.log('traceContractCall:start', { input, name });

        const to = input.target?.to?.toString();
        const data = input.target?.data?.toString();
        const value =
            typeof input.target?.value?.wei === 'bigint'
                ? HexUInt.of(input.target.value.wei).toString()
                : undefined;

        const endpoint = thorest.debug.post.TRACE_CONTRACT_CALL();
        const body = {
            to,
            data,
            value,
            name,
            gas: input.options?.gas,
            gasPrice: input.options?.gasPrice,
            caller: input.options?.caller,
            provedWork: input.options?.provedWork,
            gasPayer: input.options?.gasPayer,
            expiration: input.options?.expiration,
            blockRef: input.options?.blockRef,
            config: input.config
        };

        this.log('traceContractCall:request', { endpoint, body });

        try {
            const result = (await this.httpClient.post(endpoint, {
                query: {},
                body,
                headers: {}
            })) as TraceReturnType<typeof name>;
            this.log('traceContractCall:response', result);
            return result;
        } catch (err) {
            this.log('traceContractCall:error', err);
            throw err;
        }
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
        this.log('traceTransactionClause:start', { input, name });
        // Validate target. If invalid, assert
        this.validateTarget(input.target, 'traceTransactionClause');
        this.log('traceTransactionClause:validatedTarget', { target: input.target });
        // Parse target
        const parsedTarget = `${input.target.blockId}/${input.target.transaction}/${input.target.clauseIndex}`;
        this.log('traceTransactionClause:parsedTarget', { parsedTarget });
        // Prepare request
        const endpoint = thorest.debug.post.TRACE_TRANSACTION_CLAUSE();
        const body = {
            target: parsedTarget,
            name,
            config: input.config
        };
        this.log('traceTransactionClause:request', { endpoint, body });
        // Send request
        try {
            const result = (await this.httpClient.post(endpoint, {
                query: {},
                body,
                headers: {}
            })) as TraceReturnType<typeof name>;
            this.log('traceTransactionClause:response', result);
            return result;
        } catch (err) {
            this.log('traceTransactionClause:error', err);
            throw err;
        }
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
