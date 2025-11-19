import { type ContractTraceTarget } from './ContractTraceTarget';
import { type HttpClient } from '../../http';
import { type RetrieveStorageRange } from './RetrieveStorageRange';
import { type RetrieveStorageRangeOptions } from './RetrieveStorageRangeOptions';
import { type TransactionTraceTarget } from './TransactionTraceTarget';
import { type ContractTraceOptions, type TracerConfig, type TraceReturnType, type TracerName } from './types';
/**
 * The class provides methods to debug the VeChain Thor blockchain.
 */
declare class DebugModule {
    readonly httpClient: HttpClient;
    /**
     * Creates an instance of the class with a specified HTTP client.
     *
     * @param {HttpClient} httpClient - The HTTP client instance to be used for making requests.
     */
    constructor(httpClient: HttpClient);
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
    retrieveStorageRange(input: {
        target: TransactionTraceTarget;
        options?: RetrieveStorageRangeOptions;
    }): Promise<RetrieveStorageRange>;
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
    traceContractCall(input: {
        target?: ContractTraceTarget;
        options?: ContractTraceOptions;
        config?: TracerConfig<typeof name>;
    }, name?: TracerName): Promise<TraceReturnType<typeof name>>;
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
    traceTransactionClause(input: {
        target: TransactionTraceTarget;
        config?: TracerConfig<typeof name>;
    }, name?: TracerName): Promise<TraceReturnType<typeof name>>;
    /**
     * Validates the properties of a TransactionTraceTarget object.
     *
     * @param {TransactionTraceTarget} target - The target object containing transaction details to be validated.
     * @param {string} functionName - The name of the function where this validation is invoked.
     * @throws {InvalidDataType} If the transaction or clauseIndex properties in the target object are invalid.
     */
    private validateTarget;
}
export { DebugModule };
//# sourceMappingURL=DebugModule.d.ts.map