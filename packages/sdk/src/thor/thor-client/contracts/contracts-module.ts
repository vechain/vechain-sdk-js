/* eslint-disable */
// TODO: This module is pending rework - lint errors will be fixed during refactor
import { type Abi, type AbiFunction } from 'abitype';
import { type Signer } from '../../../thor/signer';
import { Address, AddressLike, Hex, Revision } from '../../../common/vcdm';
import { type HttpClient } from '@common/http';
import { AbstractThorModule } from '../AbstractThorModule';
import { Contract, ContractFactory } from './model';
import { ClauseBuilder } from '@thor/thor-client/transactions/ClauseBuilder';
import { TransactionRequest } from '../model/transactions/TransactionRequest';
import { Clause } from '../model/transactions/Clause';
import { IllegalArgumentError, ContractCallError } from '../../../common/errors';
import { log } from '@common/logging';
import {
    encodeFunctionData,
    decodeFunctionResult,
    toFunctionSignature
} from 'viem';
import type { ContractCallOptions, ContractCallResult } from './types';
import { EventLogFilter } from '../model/logs/EventLogFilter';
import { type EventCriteria } from '../model/logs/EventCriteria';
import { type FilterRange } from '../model/logs/FilterRange';
import { QuerySmartContractEvents, type EventLogResponse } from '@thor/thorest';
import { type TransactionReceipt } from '../model/transactions/TransactionReceipt';
import { type WaitForTransactionReceiptOptions } from '../model/transactions/WaitForTransactionReceiptOptions';
import { type ClauseSimulationResult } from '../model/transactions';
import { type AccountDetail } from '../model/accounts/AccountDetail';
import { HexUInt } from '@common/vcdm';
import { decodeRevertReason } from './utils';
import { type TransactionBodyOptions } from '../model/transactions/TransactionBody';
import {
    type EstimateGasOptions,
    type EstimateGasResult
} from '../model/gas';

const DEFAULT_TRANSACTION_LEGACY_FIELDS = {
    gas: 21000n,
    gasPriceCoef: 0n,
    nonce: 0n,
    blockRef: Hex.of('0x0000000000000000'),
    chainTag: 0x27,
    dependsOn: null,
    expiration: 720
} as const;

const DEFAULT_GAS_LIMIT = 21000n;

const hasTransactionOverrides = (
    options?: TransactionBodyOptions
): boolean => {
    if (!options) {
        return false;
    }

    return (
        options.blockRef !== undefined ||
        options.chainTag !== undefined ||
        options.dependsOn !== undefined ||
        options.expiration !== undefined ||
        options.gas !== undefined ||
        options.gasPriceCoef !== undefined ||
        options.maxFeePerGas !== undefined ||
        options.maxPriorityFeePerGas !== undefined ||
        options.nonce !== undefined ||
        options.isDelegated !== undefined
    );
};

const normalizeBuilderOverrides = (
    options?: TransactionBodyOptions
): {
    gasLimit: bigint;
    builderOptions?: TransactionBodyOptions;
} => {
    if (!options) {
        return { gasLimit: DEFAULT_GAS_LIMIT, builderOptions: undefined };
    }

    const normalizedOptions: TransactionBodyOptions = { ...options };
    if ('useLegacyDefaults' in normalizedOptions) {
        delete (normalizedOptions as { useLegacyDefaults?: boolean })
            .useLegacyDefaults;
    }

    let gasLimit: bigint = DEFAULT_GAS_LIMIT;
    if (normalizedOptions.gas !== undefined) {
        gasLimit = normalizedOptions.gas;
        delete normalizedOptions.gas;
    }

    return {
        gasLimit,
        builderOptions:
            Object.keys(normalizedOptions).length > 0
                ? normalizedOptions
                : undefined
    };
};

// WHOLE MODULE IS IN PENDING TILL MERGED AND REWORKED THE TRANSACTIONS
// Proper function arguments type using VeChain SDK types
// Type alias for function arguments (runtime values, not ABI definitions)
type FunctionArgs = readonly unknown[];
type AbiEntry = Abi[number];

/**
 * Represents a module for interacting with smart contracts on the blockchain.
 * This is the middle-layer contracts module that works directly with ThorClient.
 *
 * This follows the official VeChain SDK pattern where ContractsModule
 * is a ThorModule that provides contract interaction capabilities.
 */
class ContractsModule extends AbstractThorModule {
    /**
     * Creates a new ContractsModule instance
     * @param httpClient - The HTTP client for blockchain communication
     */
    constructor(httpClient: HttpClient) {
        super(httpClient);
    }

    /**
     * Type guard to check if an object is a CompiledContract
     */
    private isCompiledContract(
        obj: unknown
    ): obj is { abi: Abi; [key: string]: unknown } {
        return (
            obj !== null &&
            typeof obj === 'object' &&
            'abi' in obj &&
            Array.isArray((obj as { abi: unknown }).abi)
        );
    }

    /**
     * Creates a new contract factory for deploying contracts.
     *
     * @param abi - The Application Binary Interface (ABI) of the contract.
     * @param bytecode - The bytecode of the contract to deploy.
     * @param signer - The signer used for signing deployment transactions.
     * @returns A new instance of the ContractFactory.
     */
    public createContractFactory<TAbi extends Abi>(
        abi: TAbi,
        bytecode: string,
        signer: Signer
    ): ContractFactory<TAbi> {
        // Extract ABI array from full contract JSON if needed
        const actualAbi = this.isCompiledContract(abi)
            ? (abi.abi as TAbi)
            : abi;

        return new ContractFactory<TAbi>(
            actualAbi,
            bytecode as `0x${string}`,
            signer,
            this as unknown as { readonly [key: string]: unknown }
        );
    }

    /**
     * Initializes and returns a new Contract instance with the provided parameters.
     *
     * @param address - The blockchain address of the contract to load.
     * @param abi - The Application Binary Interface (ABI) of the contract.
     * @param signer - Optional. The signer, used for signing transactions when interacting with the contract.
     * @returns A new instance of the Contract, initialized with the provided parameters.
     */
    public load<TAbi extends Abi>(
        address: AddressLike,
        abi: TAbi,
        signer?: Signer
    ): Contract<TAbi> {
        const normalizedAddress = Address.of(address);
        // Extract ABI array from full contract JSON if needed
        const actualAbi = this.isCompiledContract(abi)
            ? (abi.abi as TAbi)
            : abi;
        // Type assertion to avoid circular dependency - Contract uses forward reference interface
        // The Contract constructor expects a ContractsModule interface (forward reference)
        // but we're passing the real ContractsModule instance, which is structurally compatible
        // We cannot import the forward reference interface type without creating a circular dependency
        // Using 'as any' is necessary here as the forward reference interface cannot be properly typed
        return new Contract(normalizedAddress, actualAbi, this as any, signer);
    }

    /**
     * Creates a new contract factory for deploying contracts.
     * @param abi - The Application Binary Interface (ABI) of the contract.
     * @param bytecode - The bytecode of the contract to deploy.
     * @param signer - The signer used for signing deployment transactions.
     * @returns A new instance of the ContractFactory.
     */
    public newContract<TAbi extends Abi>(
        abi: TAbi,
        bytecode: string,
        signer: Signer
    ): ContractFactory<TAbi> {
        return new ContractFactory<TAbi>(
            abi,
            bytecode as `0x${string}`,
            signer,
            this as unknown as { readonly [key: string]: unknown }
        );
    }

    /**
     * Executes a contract call by simulating a transaction through ThorClient.
     * This method allows reading from smart contracts without sending transactions.
     *
     * @param contractAddress - The address of the contract to call.
     * @param functionAbi - The ABI of the function to call.
     * @param functionData - The arguments to pass to the function.
     * @param options - Optional call options including caller, revision, etc.
     * @returns A Promise that resolves to the contract call result.
     */
    public async executeCall(
        contractAddress: AddressLike,
        functionAbi: AbiFunction | AbiEntry | undefined,
        functionData: FunctionArgs,
        options?: ContractCallOptions
    ): Promise<ContractCallResult> {
        // Validate function ABI early to make it available in catch block
        const resolvedFunctionAbi =
            functionAbi && functionAbi.type === 'function'
                ? (functionAbi as AbiFunction)
                : undefined;

        try {
            // Validate contract address
            if (
                !contractAddress ||
                contractAddress.toString() ===
                    '0x0000000000000000000000000000000000000000' ||
                contractAddress.toString() === 'invalid_address' ||
                !contractAddress.toString().startsWith('0x')
            ) {
                throw new IllegalArgumentError(
                    'ContractsModule.executeCall',
                    'Invalid contract address',
                    { contractAddress: contractAddress?.toString() }
                );
            }

            // Validate function ABI
            if (!resolvedFunctionAbi || !resolvedFunctionAbi.name) {
                throw new IllegalArgumentError(
                    'ContractsModule.executeCall',
                    'Invalid function ABI',
                    { functionAbi }
                );
            }

            // Convert Address objects to strings for viem compatibility
            const processedArgs = functionData.map((arg) => {
                if (
                    arg &&
                    typeof arg === 'object' &&
                    'toString' in arg &&
                    typeof arg.toString === 'function'
                ) {
                    // Check if it's an Address-like object by validating string representation
                    const str = arg.toString();
                    if (Address.isValid(str)) {
                        return str;
                    }
                }
                return arg;
            });

            log.debug({
                message: 'encodeFunctionData inputs',
                context: {
                    abi: [resolvedFunctionAbi],
                    functionName: resolvedFunctionAbi.name,
                    args: processedArgs
                }
            });
            log.debug({
                message: 'functionAbi inputs',
                context: { inputs: resolvedFunctionAbi.inputs }
            });

            // Use viem's encodeFunctionData directly
            let data: string;
            try {
                data = encodeFunctionData({
                    abi: [resolvedFunctionAbi] as any,
                    functionName: resolvedFunctionAbi.name as any,
                    args: processedArgs as any
                });

                log.debug({
                    message: 'Successfully encoded data',
                    context: { data }
                });
            } catch (error) {
                log.error({
                    message: 'Error in encodeFunctionData',
                    context: { error }
                });
                // Throw ContractCallError for encoding errors (e.g., "Function not found on ABI")
                const errorMessage =
                    error instanceof Error ? error.message : 'Unknown encoding error';
                throw new ContractCallError(
                    toFunctionSignature(resolvedFunctionAbi),
                    errorMessage,
                    {
                        contractAddress: contractAddress.toString()
                    },
                    error instanceof Error ? error : undefined
                );
            }

            const clauseContractAddress = Address.of(contractAddress);

            const clause = new Clause(
                clauseContractAddress,
                options?.value ?? 0n,
                Hex.of(data),
                options?.comment ?? null,
                null
            );

            // Execute the call using ThorClient transactions module (middle layer)
            log.debug({
                message: 'Simulating transaction via ThorClient',
                context: { clause }
            });

            const simulationOptions = {
                caller:
                    options?.caller !== undefined
                        ? Address.of(options.caller)
                        : undefined,
                revision: options?.revision,
                gas: options?.gas,
                gasPrice: options?.gasPrice
            };

            const simulationResults: ClauseSimulationResult[] =
                await this.thorClient.transactions.simulateTransaction(
                    [clause],
                    simulationOptions
                );

            log.debug({
                message: 'Simulation results received',
                context: { simulationResults }
            });

            if (simulationResults && simulationResults.length > 0) {
                const clauseResult = simulationResults[0];

                if (clauseResult.reverted) {
                    // Try to decode the revert reason from the data
                    let decodedReason: string | undefined;
                    if (clauseResult.data && clauseResult.data.toString() !== '0x') {
                        try {
                            decodedReason = decodeRevertReason(clauseResult.data);
                        } catch {
                            // If decoding fails, decodedReason remains undefined
                        }
                    }

                    const vmError = clauseResult.vmError || '';

                    // If we can't decode a revert reason and have a generic error,
                    // throw ContractCallError to match v2 behavior
                    const hasNoRevertMessage =
                        !decodedReason || decodedReason.trim() === '';

                    // Check if vmError is generic (common indicators of function not existing)
                    const vmErrorLower = vmError.toLowerCase();
                    const isGenericError =
                        !vmError ||
                        vmError === 'execution reverted' ||
                        vmError === 'revert' ||
                        vmErrorLower.includes('execution reverted') ||
                        vmErrorLower.includes('revert');

                    // If no decoded revert message and generic error, throw exception
                    // This matches v2 behavior where encodeData() fails for non-existent functions
                    if (hasNoRevertMessage && isGenericError) {
                        throw new ContractCallError(
                            toFunctionSignature(resolvedFunctionAbi),
                            'Contract call reverted without a specific error message. This may indicate the function does not exist in the contract.',
                            {
                                contractAddress: contractAddress.toString(),
                                vmError: vmError || 'execution reverted'
                            }
                        );
                    }

                    // If we have a decoded revert reason or a specific vmError, return error object
                    const errorMessage =
                        decodedReason || vmError || 'Contract call reverted';

                    return {
                        success: false,
                        result: {
                            errorMessage
                        }
                    };
                }

                // Decode the return data if available
                if (
                    clauseResult.data &&
                    clauseResult.data.toString() !== '0x'
                ) {
                    try {
                        // Decode the result using viem's decodeFunctionResult if the function has outputs
                        if (
                            resolvedFunctionAbi.outputs &&
                            resolvedFunctionAbi.outputs.length > 0
                        ) {
                            const decoded = decodeFunctionResult({
                                abi: [resolvedFunctionAbi],
                                functionName: resolvedFunctionAbi.name,
                                data: clauseResult.data.toString() as `0x${string}`
                            });

                            // Convert decoded result to array format
                            const decodedArray = Array.isArray(decoded)
                                ? decoded
                                : [decoded];

                            return {
                                success: true,
                                result: {
                                    array: decodedArray,
                                    plain:
                                        decodedArray.length === 1
                                            ? decodedArray[0]
                                            : decodedArray
                                }
                            };
                        } else {
                            // Function has no outputs (e.g., view function that returns nothing)
                            return {
                                success: true,
                                result: {
                                    array: [],
                                    plain: undefined
                                }
                            };
                        }
                    } catch (error) {
                        log.warn({
                            message: 'Failed to decode contract call result',
                            context: {
                                error,
                                data: clauseResult.data.toString()
                            }
                        });
                        // Return raw data if decoding fails
                        return {
                            success: true,
                            result: {
                                array: [clauseResult.data],
                                plain: clauseResult.data
                            }
                        };
                    }
                }

                // No data returned (empty result)
                return {
                    success: true,
                    result: {
                        array: [],
                        plain: undefined
                    }
                };
            }

            return {
                success: false,
                result: {
                    errorMessage: 'No clause results returned'
                }
            };
        } catch (error) {
            // Re-throw validation and encoding errors (these should be exceptions, not return values)
            if (
                error instanceof IllegalArgumentError ||
                error instanceof ContractCallError
            ) {
                throw error;
            }

            // For unexpected errors during simulation or other operations, throw ContractCallError
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred';
            // Use resolvedFunctionAbi if available, otherwise try to extract from functionAbi
            const functionAbiForSignature =
                resolvedFunctionAbi ??
                (functionAbi &&
                'type' in functionAbi &&
                functionAbi.type === 'function'
                    ? (functionAbi as AbiFunction)
                    : undefined);
            const fqn = functionAbiForSignature
                ? toFunctionSignature(functionAbiForSignature)
                : 'ContractsModule.executeCall';
            throw new ContractCallError(
                fqn,
                errorMessage,
                {
                    contractAddress: contractAddress?.toString()
                },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Executes a contract transaction using VeChain's transaction system.
     *
     * @param signer - The signer to use for signing the transaction.
     * @param contractAddress - The address of the contract to call.
     * @param functionAbi - The ABI of the function to call.
     * @param functionData - The arguments to pass to the function.
     * @param transactionOptions - Optional transaction options.
     * @param estimateGasOptions - Optional gas estimation options.
     * @param value - Optional VET in wei value to send with the transaction.
     * @returns A Promise that resolves to the transaction hash.
     */
    public async executeTransaction(
        signer: Signer,
        contractAddress: AddressLike,
        functionAbi: AbiFunction,
        functionData: FunctionArgs,
        transactionOptions?: TransactionBodyOptions,
        estimateGasOptions?: EstimateGasOptions,
        value?: bigint
    ): Promise<Hex> {
        try {
            // Build the clause for the contract function call
            const clause = ClauseBuilder.callFunction(
                Address.of(contractAddress),
                [functionAbi],
                functionAbi.name,
                functionData,
                value ?? 0n
            );

            const clauses = [clause];

            const overridesProvided =
                hasTransactionOverrides(transactionOptions);
            const legacyRequested =
                transactionOptions?.useLegacyDefaults === true &&
                !overridesProvided;
            const { gasLimit: normalizedGasLimit, builderOptions } =
                normalizeBuilderOverrides(transactionOptions);
            let gasLimit = normalizedGasLimit;
            const shouldEstimateGas =
                !legacyRequested && transactionOptions?.gas === undefined;

            if (shouldEstimateGas) {
                const gasEstimateResult: EstimateGasResult = await (
                    this.thorClient.gas as {
                        estimateGas: (
                            clauses: Clause[],
                            caller: AddressLike,
                            options?: EstimateGasOptions
                        ) => Promise<EstimateGasResult>;
                    }
                ).estimateGas(clauses, signer.address, estimateGasOptions);

                if (gasEstimateResult.reverted) {
                    log.warn({
                        source: 'ContractsModule.executeTransaction',
                        message: 'Gas estimation reverted',
                        context: { gasEstimateResult }
                    });
                    throw new IllegalArgumentError(
                        'ContractsModule.executeTransaction',
                        'Gas estimation reverted',
                        { gasEstimateResult }
                    );
                }

                gasLimit = gasEstimateResult.totalGas;
            }

            let finalTransactionRequest: TransactionRequest;

            if (legacyRequested) {
                finalTransactionRequest = TransactionRequest.of({
                    ...DEFAULT_TRANSACTION_LEGACY_FIELDS,
                    gas: gasLimit,
                    clauses
                });
            } else {
                finalTransactionRequest = await (
                    this.thorClient.transactions as {
                        buildTransactionBody: (
                            clauses: Clause[],
                            gas: bigint,
                            options?: TransactionBodyOptions
                        ) => Promise<TransactionRequest>;
                    }
                ).buildTransactionBody(clauses, gasLimit, builderOptions);
            }
            // Sign the transaction
            const signedTransaction = signer.sign(finalTransactionRequest);

            // Encode the signed transaction to Hex
            const encodedTransaction = signedTransaction.encoded;

            // Send the transaction using ThorClient transactions module
            const transactionId: Hex =
                await this.thorClient.transactions.sendRawTransaction(
                    encodedTransaction
                );

            return transactionId;
        } catch (error) {
            log.error({
                message: 'executeTransaction failed',
                source: 'ContractsModule.executeTransaction',
                context: {
                    contractAddress: contractAddress.toString(),
                    functionName: functionAbi.name,
                    error
                }
            });
            throw new IllegalArgumentError(
                'ContractsModule.executeTransaction',
                'Failed to execute transaction',
                {
                    error:
                        error instanceof Error
                            ? error.message
                            : 'Unknown error',
                    contractAddress: contractAddress.toString(),
                    functionAbi,
                    functionData
                }
            );
        }
    }

    /**
     * Executes multiple contract calls in a single transaction simulation.
     * This method allows batching multiple contract calls for efficient execution.
     *
     * @param clauses - Array of contract clauses to execute
     * @param options - Optional simulation options
     * @returns Promise that resolves to array of contract call results
     */
    public async executeMultipleClausesCall(
        clauses: {
            to: Address;
            data: string;
            value: bigint;
            contractAddress?: Address;
            functionAbi?: AbiFunction;
            functionData?: FunctionArgs;
        }[],
        options?: { caller?: AddressLike; revision?: Revision }
    ): Promise<ContractCallResult[]> {
        try {
            // Validate clauses
            if (!clauses || clauses.length === 0) {
                throw new IllegalArgumentError(
                    'ContractsModule.executeMultipleClausesCall',
                    'Empty clauses array',
                    { clauses }
                );
            }

            // Validate each clause
            for (const clause of clauses) {
                if (!clause || typeof clause !== 'object') {
                    throw new IllegalArgumentError(
                        'ContractsModule.executeMultipleClausesCall',
                        'Invalid clause format',
                        { clause }
                    );
                }
            }

            // For now, execute each clause individually
            // In a full implementation, this would batch the calls
            const results: ContractCallResult[] = [];

            for (const clause of clauses) {
                if (
                    clause.contractAddress &&
                    clause.functionAbi &&
                    clause.functionData
                ) {
                    const result = await this.executeCall(
                        clause.contractAddress,
                        clause.functionAbi,
                        clause.functionData,
                        options
                    );
                    results.push(result);
                }
            }

            return results;
        } catch (error) {
            throw new IllegalArgumentError(
                'ContractsModule.executeMultipleClausesCall',
                'Failed to execute multiple clauses call',
                {
                    error:
                        error instanceof Error
                            ? error.message
                            : 'Unknown error',
                    clausesCount: clauses.length
                }
            );
        }
    }

    /**
     * Executes multiple contract transactions in a single transaction.
     * This method allows batching multiple contract calls for efficient execution.
     *
     * @param clauses - Array of contract clauses to execute
     * @param signer - The signer to use for signing the transaction
     * @param options - Optional transaction options
     * @returns Promise that resolves to the transaction result
     */
    public async executeMultipleClausesTransaction(
        clauses: {
            to: Address;
            data: string;
            value: bigint;
            contractAddress?: Address;
            functionAbi?: AbiFunction;
            functionData?: FunctionArgs;
        }[],
        signer: Signer,
        transactionOptions?: TransactionBodyOptions
    ): Promise<Hex> {
        try {
            // Build multiple clauses for a single transaction
            const transactionClauses: Clause[] = clauses.map((clause) => {
                if (
                    clause.contractAddress &&
                    clause.functionAbi &&
                    clause.functionData
                ) {
                    // ClauseBuilder.callFunction already returns a Clause instance
                    return ClauseBuilder.callFunction(
                        Address.of(clause.contractAddress),
                        [clause.functionAbi],
                        clause.functionAbi.name,
                        clause.functionData,
                        clause.value ?? 0n
                    );
                }
                return new Clause(
                    clause.to,
                    clause.value,
                    Hex.of(clause.data),
                    null,
                    null
                );
            });

            const overridesProvided =
                hasTransactionOverrides(transactionOptions);
            const legacyRequested =
                transactionOptions?.useLegacyDefaults === true &&
                !overridesProvided;
            const { gasLimit: normalizedGasLimit, builderOptions } =
                normalizeBuilderOverrides(transactionOptions);
            let gasLimit = normalizedGasLimit;
            const shouldEstimateGas =
                !legacyRequested && transactionOptions?.gas === undefined;

            if (shouldEstimateGas) {
                const gasEstimateResult: EstimateGasResult = await (
                    this.thorClient.gas as {
                        estimateGas: (
                            clauses: Clause[],
                            caller: AddressLike,
                            options?: EstimateGasOptions
                        ) => Promise<EstimateGasResult>;
                    }
                ).estimateGas(transactionClauses, signer.address);

                if (gasEstimateResult.reverted) {
                    log.warn({
                        source: 'ContractsModule.executeMultipleClausesTransaction',
                        message: 'Gas estimation reverted',
                        context: { gasEstimateResult }
                    });
                    throw new IllegalArgumentError(
                        'ContractsModule.executeMultipleClausesTransaction',
                        'Gas estimation reverted',
                        { gasEstimateResult }
                    );
                }

                gasLimit = gasEstimateResult.totalGas;
            }

            if (legacyRequested) {
                const finalTransactionRequest = TransactionRequest.of({
                    clauses: transactionClauses,
                    ...DEFAULT_TRANSACTION_LEGACY_FIELDS,
                    gas: gasLimit
                });

                const signedTransaction = signer.sign(
                    finalTransactionRequest
                );
                const encodedTransaction = signedTransaction.encoded;

                const transactionId: Hex =
                    await (this.thorClient.transactions as { sendRawTransaction: (encoded: Hex) => Promise<Hex> }).sendRawTransaction(
                        encodedTransaction
                    );

                return transactionId;
            }

            const finalTransactionRequest = await (
                this.thorClient.transactions as {
                    buildTransactionBody: (
                        clauses: Clause[],
                        gas: bigint,
                        options?: TransactionBodyOptions
                    ) => Promise<TransactionRequest>;
                }
            ).buildTransactionBody(transactionClauses, gasLimit, builderOptions);

            // Sign the transaction
            const signedTransaction = signer.sign(finalTransactionRequest);

            // Encode the signed transaction to Hex
            const encodedTransaction = signedTransaction.encoded;

            // Send the transaction using ThorClient transactions module
            const transactionId: Hex =
                await this.thorClient.transactions.sendRawTransaction(
                    encodedTransaction
                );

            return transactionId;
        } catch (error) {
            throw new IllegalArgumentError(
                'ContractsModule.executeMultipleClausesTransaction',
                'Failed to execute multiple clauses transaction',
                {
                    error:
                        error instanceof Error
                            ? error.message
                            : 'Unknown error',
                    clausesCount: clauses.length,
                    signer: signer
                }
            );
        }
    }

    /**
     * Gets contract information from the blockchain.
     * @param address - The contract address.
     * @param revision - Optional revision to query at a specific block.
     * @returns Contract information.
     */
    public async getContractInfo(
        address: AddressLike,
        revision?: Revision
    ): Promise<{
        address: string;
        bytecode?: string;
        abi?: Abi;
        code?: string;
        isContract?: boolean;
    }> {
        const addr = Address.of(address);

        try {
            // Get account details and bytecode using ThorClient accounts module
            const accountDetails: AccountDetail = await (this.thorClient.accounts as { getAccount: (address: AddressLike, revision?: Revision) => Promise<AccountDetail> }).getAccount(
                addr,
                revision
            );
            const bytecode: HexUInt = await (this.thorClient.accounts as { getBytecode: (address: AddressLike, revision?: Revision) => Promise<HexUInt> }).getBytecode(
                addr,
                revision
            );

            // Check if it's a contract by looking at bytecode
            const isContract =
                bytecode.toString() !== '0x' && bytecode.toString() !== '0x0';

            return {
                address: addr.toString(),
                code: bytecode.toString(),
                bytecode: bytecode.toString(),
                isContract
            };
        } catch (error) {
            throw new IllegalArgumentError(
                'ContractsModule.getContractInfo',
                'Failed to get contract information',
                {
                    address: addr.toString(),
                    error:
                        error instanceof Error ? error.message : 'Unknown error'
                }
            );
        }
    }

    /**
     * Checks if an address is a contract.
     * @param address - The address to check.
     * @returns True if the address is a contract, false otherwise.
     */
    public async isContract(address: AddressLike): Promise<boolean> {
        const addr = Address.of(address);
        try {
            const info = await this.getContractInfo(addr);
            return info.isContract ?? false;
        } catch (error) {
            return false;
        }
    }

    /**
     * Gets the contract bytecode.
     * @param address - The contract address.
     * @param revision - Optional revision to query at a specific block.
     * @returns The contract bytecode.
     */
    public async getContractBytecode(
        address: AddressLike,
        revision?: Revision
    ): Promise<string> {
        const addr = Address.of(address);
        try {
            // Use ThorClient accounts module to get bytecode
            const bytecode: HexUInt = await (this.thorClient.accounts as { getBytecode: (address: AddressLike, revision?: Revision) => Promise<HexUInt> }).getBytecode(
                addr,
                revision
            );
            return bytecode.toString();
        } catch (error) {
            throw new IllegalArgumentError(
                'ContractsModule.getContractBytecode',
                'Failed to get contract bytecode',
                {
                    address: addr.toString(),
                    error:
                        error instanceof Error ? error.message : 'Unknown error'
                }
            );
        }
    }

    /**
     * Gets contract events from a specific block range.
     * @param address - The contract address.
     * @param fromBlock - Starting block number.
     * @param toBlock - Ending block number.
     * @returns Array of contract events.
     */
    public async getContractEvents(
        address: AddressLike,
        fromBlock?: number,
        toBlock?: number
    ): Promise<
        {
            address: string;
            topics: string[];
            data: string;
            blockNumber: number;
            transactionHash: string;
        }[]
    > {
        const addr = Address.of(address);
        try {
            // Create the filter for the contract events
            const range: FilterRange | null =
                fromBlock !== undefined && toBlock !== undefined
                    ? { unit: 'block', from: fromBlock, to: toBlock }
                    : null;

            const criteria: EventCriteria = {
                address: Address.of(address)
            };
            const filter = EventLogFilter.of(range, null, [criteria], null);

            // Use thorest to get raw event logs directly
            const query = QuerySmartContractEvents.of(filter);
            const resp = await query.askTo(this.httpClient);

            // Transform the response to match the expected format
            return resp.response.map((log: EventLogResponse) => ({
                address: log.address.toString(),
                topics: log.topics.map((topic) => topic.toString()),
                data: log.data.toString(),
                blockNumber: log.meta.blockNumber,
                transactionHash: log.meta.txID.toString()
            }));
        } catch (error) {
            throw new IllegalArgumentError(
                'ContractsModule.getContractEvents',
                'Failed to get contract events',
                {
                    address: addr.toString(),
                    fromBlock,
                    toBlock,
                    error:
                        error instanceof Error ? error.message : 'Unknown error'
                }
            );
        }
    }

    /**
     * Waits for a transaction to be confirmed on the blockchain and returns its receipt.
     * This method polls the blockchain until the transaction receipt is available or times out.
     *
     * @param transactionId - The transaction ID (hash) to wait for.
     * @param options - Optional polling configuration (interval, timeout).
     * @returns Promise that resolves to the transaction receipt or null if not found.
     * @throws {IllegalArgumentError} If the intervalMs or timeoutMs are invalid.
     * @throws {TimeoutError} If the transaction receipt is not found within the timeout period.
     */
    public async waitForTransaction(
        transactionId: Hex,
        options?: WaitForTransactionReceiptOptions
    ): Promise<TransactionReceipt | null> {
        const receipt: TransactionReceipt | null = await this.thorClient.transactions.waitForTransactionReceipt(
            transactionId,
            options
        );
        return receipt;
    }
}

export { ContractsModule };
