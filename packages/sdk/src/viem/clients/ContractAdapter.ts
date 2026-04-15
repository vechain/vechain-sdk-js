/* eslint-disable */
// TODO: Contracts module is pending rework - lint errors will be fixed during refactor
import {
    type Abi,
    type AbiParameter,
    type AbiFunction,
    encodeFunctionData,
    decodeFunctionResult,
    toEventSelector
} from 'viem';
import type {
    ExtractAbiFunctionNames,
    ExtractAbiFunction,
    AbiParametersToPrimitiveTypes
} from 'abitype';
import { Address, AddressLike, Hex } from '@common/vcdm';
import { type PublicClient, type WalletClient } from '@viem/clients';
import { type ExecuteCodesRequestJSON } from '@thor/thorest/json';
import { type SubscriptionEventResponse } from '@thor/thorest/subscriptions/response';
import {
    ExecuteCodesResponse,
    ExecuteCodeResponse
} from '@thor/thorest/accounts/response';
import { type DecodedEventLog } from '@thor/thor-client/model/logs/DecodedEventLog';
import { Clause } from '@thor/thor-client/model/transactions/Clause';
// Import the middle-layer contracts module
import { ThorClient } from '@thor/thor-client/ThorClient';
import { Contract as VeChainContract } from '@thor/thor-client/contracts/model/contract';
import { ContractCallOptions } from '@thor/thor-client/contracts/types';
import { type TransactionBodyOptions } from '@thor/thor-client/model/transactions/TransactionBody';
import { type SimulateTransactionOptions } from '@thor/thor-client/model/transactions/SimulateTransactionOptions';
import { log } from '@common/logging';
import { IllegalArgumentError } from '@common/errors';
import type { HttpClient } from '@common/http';
import { FetchHttpClient } from '@common/http';

// Type alias for function arguments (runtime values, not ABI definitions)
type FunctionArgs = readonly unknown[];

/**
 * Internal interface for accessing client properties
 * This provides type-safe access to internal client state without using 'as any'
 */
interface ClientInternal {
    httpClient?: HttpClient;
    network?: string;
    account?: {
        address: Address;
    };
}

/**
 * Interface for full compiled contract JSON that includes ABI and metadata
 */
interface CompiledContract {
    abi: Abi;
    bytecode?: string;
    metadata?: unknown;
    [key: string]: unknown;
}

/**
 * Type guard to check if an object is a CompiledContract
 */
function isCompiledContract(obj: unknown): obj is CompiledContract {
    return (
        obj !== null &&
        typeof obj === 'object' &&
        'abi' in obj &&
        Array.isArray((obj as CompiledContract).abi)
    );
}

/**
 * Extracts ABI array from either a raw ABI or a compiled contract JSON
 * @param abi - The ABI or compiled contract
 * @returns The extracted ABI array
 */
function extractAbi<TAbi extends Abi>(abi: TAbi | CompiledContract): TAbi {
    if (isCompiledContract(abi)) {
        return abi.abi as TAbi;
    }
    return abi;
}

/**
 * Validates write parameters for security and correctness
 * @param params - The parameters to validate
 * @param context - Context for error messages
 */
function validateWriteParameters(
    params: WriteContractParameters,
    context: string
): void {
    // Validate value is non-negative
    if (params.value !== undefined && params.value < 0n) {
        throw new IllegalArgumentError(
            context,
            'Transaction value cannot be negative',
            { value: params.value.toString() }
        );
    }

    // Validate gas is reasonable
    if (params.gas !== undefined) {
        if (params.gas < 0n) {
            throw new IllegalArgumentError(
                context,
                'Gas limit cannot be negative',
                { gas: params.gas.toString() }
            );
        }
    }
}

/**
 * Configuration for creating a contract instance
 */
export interface ContractConfig<TAbi extends Abi> {
    /** The contract address */
    address: AddressLike;
    /** The contract ABI */
    abi: TAbi;
    /** PublicClient instance for blockchain interaction (optional if walletClient provided) */
    publicClient?: PublicClient;
    /** WalletClient instance for transaction signing (optional) */
    walletClient?: WalletClient;
}

/**
 * Write function parameters for contract methods
 */
export interface WriteContractParameters {
    /** Function arguments */
    args?: FunctionArgs;
    /** Value to send with the transaction (in wei) */
    value?: bigint;
    /** Gas limit for the transaction */
    gas?: bigint;
    /** Gas price coefficient for the transaction (VeChain specific) */
    gasPriceCoef?: bigint;
    /** Maximum fee per gas (EIP-1559 dynamic fees) */
    maxFeePerGas?: bigint;
    /** Maximum priority fee per gas (EIP-1559 dynamic fees) */
    maxPriorityFeePerGas?: bigint;
}

/**
 * Helper type to extract return type from ABI function
 */
type ContractFunctionReturnType<
    TAbi extends Abi,
    TFunctionName extends string
> = AbiParametersToPrimitiveTypes<
    ExtractAbiFunction<TAbi, TFunctionName>['outputs']
>[0];

/**
 * Helper type to extract argument types from ABI function
 */
type ContractFunctionArgs<
    TAbi extends Abi,
    TFunctionName extends string
> = AbiParametersToPrimitiveTypes<
    ExtractAbiFunction<TAbi, TFunctionName>['inputs'],
    'inputs'
>;

/**
 * Type-safe read methods for view/pure functions plus simulated access to state-changing functions
 */
type ContractReadMethods<TAbi extends Abi> = {
    [TFunctionName in ExtractAbiFunctionNames<
        TAbi,
        'view' | 'pure' | 'payable' | 'nonpayable'
    >]: (
        ...args: ContractFunctionArgs<TAbi, TFunctionName>
    ) => Promise<ContractFunctionReturnType<TAbi, TFunctionName>>;
};

/**
 * Type-safe write methods for state-changing functions
 */
type ContractWriteMethods<TAbi extends Abi> = {
    [TFunctionName in ExtractAbiFunctionNames<
        TAbi,
        'payable' | 'nonpayable'
    >]: (params?: WriteContractParameters) => ExecuteCodesRequestJSON;
};

/**
 * A contract instance with read, write, simulate, estimateGas, and event interfaces
 * Compatible with viem's getContract return type
 *
 * This is the viem-compatible layer that uses the official VeChain contracts module as backend
 */
export interface Contract<TAbi extends Abi> {
    /** Contract address */
    address: Address;
    /** Contract ABI */
    abi: TAbi;
    /** Read-only contract methods (view/pure) plus simulated state-changing functions - available when publicClient provided */
    read: ContractReadMethods<TAbi>;
    /** State-changing contract methods - available when walletClient provided */
    write: ContractWriteMethods<TAbi>;
    /** Simulate contract method calls - available when publicClient provided */
    simulate: Record<
        string,
        (params?: {
            args?: FunctionArgs;
            value?: bigint;
        }) => Promise<ExecuteCodesResponse>
    >;
    /** Estimate gas for contract method calls - available when publicClient provided */
    estimateGas: Record<
        string,
        (params?: { args?: FunctionArgs; value?: bigint }) => Promise<bigint>
    >;
    /** Contract event interfaces - available when publicClient provided */
    events: Record<
        string,
        {
            /** Watch for contract events */
            watch: (params: {
                onLogs: (logs: SubscriptionEventResponse[]) => void;
                onError?: (error: Error) => void;
                args?: FunctionArgs;
                fromBlock?: string | number;
            }) => () => void;
            /** Get historical event logs */
            getLogs: (options?: {
                args?: FunctionArgs;
                fromBlock?: bigint;
                toBlock?: bigint;
            }) => Promise<DecodedEventLog[]>;
            /** Create event filter */
            createEventFilter: (options?: {
                args?: FunctionArgs;
                fromBlock?: bigint;
                toBlock?: bigint;
            }) => unknown; // EventFilter type
        }
    >;

    /**
     * Gets detailed parameter information for a specific function
     *
     * @param functionName - The name of the function to inspect
     * @returns Object containing inputs, outputs, and stateMutability
     *
     * @example
     * ```typescript
     * const contract = getContract({ address, abi, publicClient });
     * const info = contract.getParameterInfo('transfer');
     * // Returns: {
     * //   inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }],
     * //   outputs: [{ name: '', type: 'bool' }],
     * //   stateMutability: 'nonpayable'
     * // }
     * ```
     */
    getParameterInfo: (functionName: string) => {
        inputs: readonly AbiParameter[];
        outputs: readonly AbiParameter[];
        stateMutability: string;
    };

    /**
     * Gets a formatted string representation of a function's signature
     *
     * @param functionName - The name of the function
     * @returns A formatted string like "transfer(address to, uint256 amount) returns (bool)"
     *
     * @example
     * ```typescript
     * const contract = getContract({ address, abi, publicClient });
     * const signature = contract.getFunctionSignature('transfer');
     * // Returns: "transfer(address to, uint256 amount) returns (bool)"
     * ```
     */
    getFunctionSignature: (functionName: string) => string;

    /**
     * Lists all available functions in the contract with their signatures
     *
     * @returns Array of function signature strings
     *
     * @example
     * ```typescript
     * const contract = getContract({ address, abi, publicClient });
     * const functions = contract.listFunctions();
     * // Returns: [
     * //   "transfer(address to, uint256 amount) returns (bool)",
     * //   "balanceOf(address account) returns (uint256)",
     * //   "approve(address spender, uint256 amount) returns (bool)",
     * //   ...
     * // ]
     * ```
     */
    listFunctions: () => string[];

    // Additional VeChain-specific functionality exposed through the viem interface
    /** Access to the underlying VeChain contract instance */
    _vechain?: {
        /** The official VeChain contract instance */
        contract: VeChainContract<TAbi>;
        /** Set contract read options */
        setReadOptions: (options: ContractCallOptions) => void;
        /** Set contract transaction options */
        setTransactOptions: (transactionRequest: TransactionBodyOptions) => void;
        /** Access to clause building */
        clause: Record<
            string,
            (...args: AbiParameter[]) => {
                to: string;
                data: string;
                value: bigint;
                comment?: string;
            }
        >;
        /** Access to event filters */
        filters: Record<
            string,
            (...args: AbiParameter[]) => { address: string; topics: string[] }
        >;
    };
}

/**
 * Creates a viem-compatible contract instance for VeChain.
 *
 * Provides a viem-like interface while using the VeChain contracts module internally.
 * Supports both read operations (with publicClient) and write operations (with walletClient).
 *
 * @template TAbi - The contract ABI type.
 * @param {ContractConfig<TAbi>} config - Contract configuration.
 * @param {Address} config.address - The contract address.
 * @param {TAbi} config.abi - The contract ABI.
 * @param {PublicClient} config.publicClient - Public client for read operations (optional).
 * @param {WalletClient} config.walletClient - Wallet client for write operations (optional).
 * @returns {Contract<TAbi>} A viem-compatible contract instance.
 * @throws {Error} If neither publicClient nor walletClient is provided.
 *
 * @example
 * ```typescript
 * const contract = getContract({
 *   address: Address.of('0x...'),
 *   abi: [...],
 *   publicClient
 * });
 *
 * // Read contract state
 * const balance = await contract.read.balanceOf([address]);
 *
 * // Write to contract (requires walletClient)
 * const tx = contract.write.transfer({ args: [recipient, amount] });
 * ```
 */
function getContract<const TAbi extends Abi>({
    address: addressLike,
    abi,
    publicClient,
    walletClient
}: ContractConfig<TAbi>): Contract<TAbi> {
    const address = Address.of(addressLike);
    const context = 'ContractAdapter.getContract';

    // Validate that at least one client is provided
    if (publicClient == null && walletClient == null) {
        throw new IllegalArgumentError(
            context,
            'At least one of publicClient or walletClient must be provided',
            {
                hasPublicClient: false,
                hasWalletClient: false
            }
        );
    }

    // Extract ABI array from full contract JSON if needed
    const actualAbi = extractAbi(abi);

    // Validate ABI is not empty
    if (!Array.isArray(actualAbi) || actualAbi.length === 0) {
        throw new IllegalArgumentError(
            context,
            'Contract ABI cannot be empty',
            { abiLength: Array.isArray(actualAbi) ? actualAbi.length : 0 }
        );
    }

    // Get HttpClient from clients with proper typing
    const publicClientInternal = publicClient as ClientInternal | undefined;
    const walletClientInternal = walletClient as ClientInternal | undefined;

    let httpClient =
        publicClientInternal?.httpClient || walletClientInternal?.httpClient;

    // If no httpClient, try to create one from network URL
    if (!httpClient) {
        const networkUrl =
            publicClientInternal?.network || walletClientInternal?.network;

        if (!networkUrl) {
            throw new IllegalArgumentError(
                context,
                'No HTTP client or network URL available from provided clients. ' +
                    'Ensure your publicClient or walletClient is properly configured with network settings.',
                {
                    hasPublicClient: !!publicClient,
                    hasWalletClient: !!walletClient,
                    publicClientHasHttpClient:
                        !!publicClientInternal?.httpClient,
                    walletClientHasHttpClient:
                        !!walletClientInternal?.httpClient,
                    publicClientHasNetwork: !!publicClientInternal?.network,
                    walletClientHasNetwork: !!walletClientInternal?.network
                }
            );
        }

        // Create HttpClient from network URL
        httpClient = new FetchHttpClient(new URL(networkUrl));

        log.debug({
            message: 'Created HttpClient from network URL',
            context: { networkUrl }
        });
    }

    const thorClient = ThorClient.fromHttpClient(httpClient!); // httpClient is guaranteed to exist or error thrown above
    const vechainContract = thorClient.contracts.load(address, actualAbi);

    // Initialize properties
    // Initialize with empty objects that will be populated dynamically
    // Type safety is enforced at the interface level via ContractReadMethods/ContractWriteMethods
    const readMethods: ContractReadMethods<TAbi> = {} as any;
    const writeMethods: ContractWriteMethods<TAbi> = {} as any;
    const simulateMethods: Record<
        string,
        (params?: {
            args?: FunctionArgs;
            value?: bigint;
        }) => Promise<ExecuteCodesResponse>
    > = {};
    const estimateGasMethods: Record<
        string,
        (params?: { args?: FunctionArgs; value?: bigint }) => Promise<bigint>
    > = {};
    const eventMethods: Record<
        string,
        {
            watch: (params: {
                onLogs: (logs: SubscriptionEventResponse[]) => void;
                onError?: (error: Error) => void;
                args?: FunctionArgs;
                fromBlock?: string | number;
            }) => () => void;
            getLogs: (options?: {
                args?: FunctionArgs;
                fromBlock?: bigint;
                toBlock?: bigint;
            }) => Promise<DecodedEventLog[]>;
            createEventFilter: (options?: {
                args?: FunctionArgs;
                fromBlock?: bigint;
                toBlock?: bigint;
            }) => unknown;
        }
    > = {};

    // VeChain-specific functionality - delegate to the middle layer
    const vechainMethods = {
        contract: vechainContract,
        setReadOptions: (options: ContractCallOptions) => {
            vechainContract.setContractReadOptions(options);
        },
        setTransactOptions: (options: TransactionBodyOptions) => {
            vechainContract.setContractTransactOptions(options);
        },
        clause: {} as Record<
            string,
            (...args: AbiParameter[]) => {
                to: string;
                data: string;
                value: bigint;
                comment?: string;
            }
        >,
        filters: {} as Record<
            string,
            (...args: AbiParameter[]) => { address: string; topics: string[] }
        >,
        criteria: {} as Record<
            string,
            (...args: AbiParameter[]) => {
                eventName: string;
                args: AbiParameter[];
                address: string;
                topics: string[];
            }
        >
    };

    // Initialize contract object
    const contract: Contract<TAbi> = {
        address,
        abi: actualAbi,
        read: readMethods,
        write: writeMethods,
        simulate: simulateMethods,
        estimateGas: estimateGasMethods,
        events: eventMethods,

        // Signature introspection methods
        getParameterInfo: (functionName: string) => {
            const functionAbi = actualAbi.find(
                (item): item is AbiFunction =>
                    item.type === 'function' &&
                    'name' in item &&
                    item.name === functionName
            );

            if (!functionAbi) {
                throw new IllegalArgumentError(
                    'getParameterInfo',
                    `Function ${functionName} not found in ABI`,
                    { functionName, abi: actualAbi }
                );
            }

            return {
                inputs: functionAbi.inputs || [],
                outputs: functionAbi.outputs || [],
                stateMutability: functionAbi.stateMutability || 'nonpayable'
            };
        },

        getFunctionSignature: (functionName: string) => {
            const paramInfo = contract.getParameterInfo(functionName);

            const inputsStr = paramInfo.inputs
                .map(
                    (param) =>
                        `${param.type}${param.name ? ` ${param.name}` : ''}`
                )
                .join(', ');

            const outputsStr =
                paramInfo.outputs.length > 0
                    ? ` returns (${paramInfo.outputs.map((param) => param.type).join(', ')})`
                    : '';

            return `${functionName}(${inputsStr})${outputsStr}`;
        },

        listFunctions: () => {
            return actualAbi
                .filter((item): item is AbiFunction => item.type === 'function')
                .map((func) => contract.getFunctionSignature(func.name));
        },

        _vechain: vechainMethods
    };

    // Process each ABI item to build the contract interface
    for (const abiItem of actualAbi) {
        // Handle functions
        if (abiItem.type === 'function') {
            const functionName = abiItem.name;

            // Read methods (view/pure) - delegate to VeChain contract
            if (
                (abiItem.stateMutability === 'view' ||
                    abiItem.stateMutability === 'pure') &&
                publicClient != null
            ) {
                (contract.read as any)[functionName] = async (
                    ...args: FunctionArgs
                ) => {
                    // Validate argument count matches ABI
                    if (args.length !== abiItem.inputs.length) {
                        throw new IllegalArgumentError(
                            `read.${functionName}`,
                            `Expected ${abiItem.inputs.length} arguments, got ${args.length}`,
                            {
                                expected: abiItem.inputs.length,
                                received: args.length,
                                functionName
                            }
                        );
                    }

                    // Preprocess arguments to convert Address objects to strings
                    const processedArgs = args.map((arg) => {
                        if (
                            arg &&
                            typeof arg === 'object' &&
                            'toString' in arg &&
                            typeof arg.toString === 'function'
                        ) {
                            // Check if it's an Address object by checking for toString method and if it returns a hex string
                            const str = arg.toString();
                            if (Address.isValid(str)) {
                                return str;
                            }
                        }
                        return arg;
                    });

                    // Delegate to the VeChain contract's read method
                    type ReadMethod = (...args: unknown[]) => Promise<unknown>;
                    const readMethod = (
                        vechainContract.read as Record<string, ReadMethod>
                    )[functionName];

                    if (!readMethod) {
                        throw new IllegalArgumentError(
                            `read.${functionName}`,
                            `Read method not found for function: ${functionName}`,
                            { functionName }
                        );
                    }

                    return await readMethod(...processedArgs);
                };
            }

            // Simulated read access for state-changing functions
            if (
                (abiItem.stateMutability === 'nonpayable' ||
                    abiItem.stateMutability === 'payable') &&
                publicClient != null
            ) {
                (contract.read as any)[functionName] = async (
                    ...args: FunctionArgs
                ) => {
                    if (args.length !== abiItem.inputs.length) {
                        throw new IllegalArgumentError(
                            `read.${functionName}`,
                            `Expected ${abiItem.inputs.length} arguments, got ${args.length}`,
                            {
                                expected: abiItem.inputs.length,
                                received: args.length,
                                functionName
                            }
                        );
                    }

                    const processedArgs = args.map((arg) => {
                        if (
                            arg &&
                            typeof arg === 'object' &&
                            'toString' in arg &&
                            typeof arg.toString === 'function'
                        ) {
                            const str = arg.toString();
                            if (Address.isValid(str)) {
                                return str;
                            }
                        }
                        return arg;
                    });

                    const data = encodeFunctionData({
                        abi: actualAbi as Abi,
                        functionName,
                        args: processedArgs
                    });

                    const readOptions =
                        vechainContract.getContractReadOptions();
                    const value = readOptions.value != null ? readOptions.value : 0n;
                    const clause = new Clause(address, value, Hex.of(data));

                    const caller =
                        (readOptions.caller
                            ? Address.of(readOptions.caller)
                            : undefined) ||
                        publicClientInternal?.account?.address ||
                        walletClientInternal?.account?.address;

                    const simulationOptions: SimulateTransactionOptions = {};

                    if (readOptions.revision != null) {
                        simulationOptions.revision = readOptions.revision;
                    }
                    if (readOptions.gas != null) {
                        simulationOptions.gas = readOptions.gas;
                    }
                    if (readOptions.gasPrice != null) {
                        simulationOptions.gasPrice = readOptions.gasPrice;
                    }
                    if (caller) {
                        simulationOptions.caller = caller;
                    }

                    const [result] = await publicClient.simulateCalls(
                        [clause],
                        Object.keys(simulationOptions).length > 0
                            ? simulationOptions
                            : undefined
                    );

                    if (!result) {
                        throw new IllegalArgumentError(
                            `read.${functionName}`,
                            'No simulation result returned',
                            { functionName }
                        );
                    }

                    if (result.reverted) {
                        throw new IllegalArgumentError(
                            `read.${functionName}`,
                            result.vmError || 'Simulated transaction reverted',
                            {
                                functionName,
                                vmError: result.vmError
                            }
                        );
                    }

                    const resultData = result.data?.toString();

                    if (
                        !abiItem.outputs ||
                        abiItem.outputs.length === 0 ||
                        !resultData ||
                        resultData === '0x'
                    ) {
                        return undefined;
                    }

                    const decoded = decodeFunctionResult({
                        abi: actualAbi as Abi,
                        functionName,
                        data: resultData as `0x${string}`
                    });

                    if (Array.isArray(decoded)) {
                        return decoded.length === 1 ? decoded[0] : decoded;
                    }

                    return decoded;
                };
            }

            // Write methods - delegate to VeChain contract clause building
            if (
                (abiItem.stateMutability === 'nonpayable' ||
                    abiItem.stateMutability === 'payable') &&
                walletClient != null
            ) {
                (contract.write as any)[functionName] = (
                    params: WriteContractParameters = {}
                ) => {
                    const {
                        args = [],
                        value = 0n,
                        gas,
                        gasPriceCoef,
                        maxFeePerGas,
                        maxPriorityFeePerGas
                    } = params;

                    // Validate write parameters
                    validateWriteParameters(params, `write.${functionName}`);

                    // Validate argument count matches ABI
                    if (args.length !== abiItem.inputs.length) {
                        throw new IllegalArgumentError(
                            `write.${functionName}`,
                            `Expected ${abiItem.inputs.length} arguments, got ${args.length}`,
                            {
                                expected: abiItem.inputs.length,
                                received: args.length,
                                functionName
                            }
                        );
                    }

                    // Use the VeChain contract's clause building for transaction preparation
                    // Pass value as part of the args if it's not zero
                    const clauseArgs = value > 0n ? [...args, { value }] : args;

                    // Get the clause method from VeChain contract
                    type ClauseMethod = (...args: unknown[]) => {
                        to: string;
                        data: string;
                        value: bigint;
                        comment?: string;
                    };

                    const clauseMethod = (
                        vechainContract.clause as Record<string, ClauseMethod>
                    )[functionName];
                    if (!clauseMethod) {
                        throw new IllegalArgumentError(
                            `write.${functionName}`,
                            `Clause method not found for function: ${functionName}`,
                            { functionName }
                        );
                    }

                    const clause = clauseMethod(...clauseArgs);

                    // Return as ExecuteCodesRequestJSON format
                    // Convert clause to proper format with value as string
                    const clauseJSON = {
                        to: clause.to,
                        data: clause.data,
                        value: clause.value.toString()
                    };

                    return {
                        clauses: [clauseJSON],
                        gas: gas ? Number(gas) : undefined,
                        gasPriceCoef: gasPriceCoef
                            ? Number(gasPriceCoef)
                            : undefined,
                        maxFeePerGas: maxFeePerGas
                            ? maxFeePerGas.toString()
                            : undefined,
                        maxPriorityFeePerGas: maxPriorityFeePerGas
                            ? maxPriorityFeePerGas.toString()
                            : undefined
                    } as ExecuteCodesRequestJSON;
                };
            }

            // Simulate methods - delegate to VeChain contract
            if (publicClient != null) {
                contract.simulate[functionName] = async ({
                    args = [],
                    value = 0n
                } = {}) => {
                    // TODO: Delegate to vechainContract simulation methods
                    const data = encodeFunctionData({
                        abi: actualAbi as Abi,
                        functionName,
                        args
                    });

                    const clause = new Clause(address, value, Hex.of(data));

                    const results = await publicClient.simulateCalls([clause]);

                    // Convert ClauseSimulationResult[] to ExecuteCodesResponse
                    const responseJSON = results.map((result) => ({
                        data: result.data.toString(),
                        events: result.events.map((e) => ({
                            address: e.address.toString(),
                            topics: e.topics.map((t) => t.toString()),
                            data: e.data.toString()
                        })),
                        transfers: result.transfers.map((t) => ({
                            sender: t.sender.toString(),
                            recipient: t.recipient.toString(),
                            amount: t.amount.toString()
                        })),
                        gasUsed: Number(result.gasUsed),
                        reverted: result.reverted,
                        vmError: result.vmError
                    }));

                    return new ExecuteCodesResponse(responseJSON);
                };

                // EstimateGas methods - delegate to VeChain contract
                contract.estimateGas[functionName] = async ({
                    args = [],
                    value = 0n
                } = {}) => {
                    // TODO: Delegate to vechainContract gas estimation
                    const data = encodeFunctionData({
                        abi: actualAbi as Abi,
                        functionName,
                        args
                    });

                    const clause = new Clause(address, value, Hex.of(data));

                    // estimateGas requires a caller address
                    const publicClientInternal =
                        publicClient as unknown as ClientInternal;
                    const caller = publicClientInternal.account?.address;

                    if (!caller) {
                        throw new IllegalArgumentError(
                            `estimateGas.${functionName}`,
                            'estimateGas requires an account address. Provide a publicClient with an account or use a walletClient.',
                            { functionName }
                        );
                    }

                    const response = await publicClient.estimateGas(
                        [clause],
                        caller
                    );

                    return response.totalGas;
                };
            }

            // Add VeChain-specific clause building - delegate to middle layer
            vechainMethods.clause[functionName] = (...args: AbiParameter[]) => {
                type ClauseMethod = (...args: unknown[]) => {
                    to: string;
                    data: string;
                    value: bigint;
                    comment?: string;
                };
                const clauseMethod = (
                    vechainContract.clause as Record<string, ClauseMethod>
                )[functionName];
                return clauseMethod(...args);
            };
        }
        // Handle events - delegate to VeChain contract
        else if (abiItem.type === 'event' && publicClient != null) {
            const eventName = abiItem.name;
            const eventSignature = toEventSelector(abiItem);

            contract.events[eventName] = {
                watch: ({ onLogs, onError, args = [], fromBlock }) => {
                    // TODO: Delegate to vechainContract event watching
                    const indexedInputs = abiItem.inputs.filter(
                        (input: AbiParameter & { indexed?: boolean }) =>
                            input.indexed
                    );
                    const indexedArgs: Hex[] = [];

                    if (
                        args != null &&
                        args.length > 0 &&
                        indexedInputs.length > 0
                    ) {
                        for (let i = 0; i < indexedInputs.length; i++) {
                            if (i < args.length && args[i] !== undefined) {
                                indexedArgs.push(
                                    Hex.of(
                                        args[i] as unknown as
                                            | bigint
                                            | number
                                            | string
                                            | Uint8Array
                                    )
                                );
                            } else {
                                indexedArgs.push(Hex.of('0'));
                            }
                        }
                    }

                    return publicClient.watchEvent({
                        address,
                        event: Hex.of(eventSignature),
                        args: indexedArgs,
                        fromBlock:
                            fromBlock !== undefined
                                ? Hex.of(
                                      fromBlock as unknown as
                                          | bigint
                                          | number
                                          | string
                                          | Uint8Array
                                  )
                                : undefined,
                        onLogs,
                        onError
                    });
                },

                getLogs: async (options = {}) => {
                    // TODO: Delegate to vechainContract event log querying
                    const { args, fromBlock, toBlock } = options;
                    const filter = publicClient.createEventFilter({
                        address,
                        event: abiItem,
                        args: args as Hex[] | undefined,
                        fromBlock,
                        toBlock
                    });
                    return await publicClient.getLogs(filter);
                },

                createEventFilter: (options = {}) => {
                    // TODO: Delegate to vechainContract filter creation
                    const { args, fromBlock, toBlock } = options;
                    const filter = publicClient.createEventFilter({
                        address,
                        event: abiItem,
                        args: args as Hex[] | undefined,
                        fromBlock,
                        toBlock
                    });
                    return filter;
                }
            };

            // Add VeChain-specific event filters - delegate to middle layer
            vechainMethods.filters[eventName] = (...args: AbiParameter[]) => {
                type FilterMethod = (...args: unknown[]) => {
                    address: string;
                    topics: string[];
                };
                const filterMethod = (
                    vechainContract.filters as Record<string, FilterMethod>
                )[eventName];
                return filterMethod(...args);
            };
        }
    }

    // Populate VeChain-specific methods for functions
    for (const abiItem of actualAbi) {
        if (abiItem.type === 'function') {
            const functionName = abiItem.name;

            // Add VeChain-specific clause methods - delegate to middle layer
            vechainMethods.clause[functionName] = (...args: AbiParameter[]) => {
                type ClauseMethod = (...args: unknown[]) => {
                    to: string;
                    data: string;
                    value: bigint;
                    comment?: string;
                };
                const clauseMethod = (
                    vechainContract.clause as Record<string, ClauseMethod>
                )[functionName];
                return clauseMethod(...args);
            };
        }
    }

    return contract;
}

export { getContract };
