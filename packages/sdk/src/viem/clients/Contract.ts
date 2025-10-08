import {
    type Abi,
    encodeFunctionData,
    decodeFunctionResult,
    toEventSelector
} from 'viem';
import { type Address, Hex } from '@common/vcdm';
import { type PublicClient, type WalletClient } from '@viem/clients';
import { type SubscriptionEventResponse } from '@thor/thorest/subscriptions/response';
import { type DecodedEventLog } from '@thor/thor-client/model/logs/DecodedEventLog';
import {
    Clause,
    type SimulateTransactionOptions,
    type ClauseSimulationResult
} from '@thor/thor-client';

// Type alias for hex-convertible values
type HexConvertible = string | number | bigint;

// Type alias for function arguments
type FunctionArgs = unknown[];

/**
 * Configuration for creating a contract instance
 */
export interface ContractConfig<TAbi extends Abi> {
    /** The contract address */
    address: Address;
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
    /** Gas price for the transaction */
    gasPrice?: bigint;
}

/**
 * A contract instance with read, write, simulate, estimateGas, and event interfaces
 * Compatible with viem's getContract return type
 */
export interface Contract<TAbi extends Abi> {
    /** Contract address */
    address: Address;
    /** Contract ABI */
    abi: TAbi;
    /** Read-only contract methods (view/pure) - available when publicClient provided */
    read: Record<string, (...args: FunctionArgs) => Promise<unknown>>;
    /** Simulate contract method calls - available when publicClient provided */
    simulate: Record<
        string,
        (params?: {
            args?: FunctionArgs;
            value?: bigint;
            options?: SimulateTransactionOptions;
        }) => Promise<ClauseSimulationResult[]>
    >;
    /** Estimate gas for contract method calls - available when publicClient provided */
    estimateGas: Record<
        string,
        (
            caller: Address,
            params?: { args?: FunctionArgs; value?: bigint }
        ) => Promise<bigint>
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
}

/**
 * Creates a contract instance for the given ABI and address using the provided public client
 *
 * @param config Contract configuration including address, ABI and public client
 * @returns A contract instance with typed read, write and events interfaces
 *
 * @example
 * ```ts
 * import { getContract } from '@vechain/sdk';
 *
 * const contract = getContract({
 *   address: '0x...',
 *   abi: [...],
 *   publicClient,
 * });
 *
 * // Read contract data
 * const value = await contract.read.balanceOf(['0x...']);
 *
 * // Write to contract
 * const txRequest = await contract.write.transfer({
 *   args: ['0x...', 100n],
 *   value: 0n
 * });
 * ```
 */
function getContract<const TAbi extends Abi>({
    address,
    abi,
    publicClient,
    walletClient
}: ContractConfig<TAbi>): Contract<TAbi> {
    // Validate that at least one client is provided
    if (publicClient == null && walletClient == null) {
        throw new Error(
            'At least one of publicClient or walletClient must be provided'
        );
    }

    // Initialize properties
    const readMethods: Record<
        string,
        (...args: FunctionArgs) => Promise<unknown>
    > = {};
    const simulateMethods: Record<
        string,
        (params?: {
            args?: FunctionArgs;
            value?: bigint;
        }) => Promise<ClauseSimulationResult[]>
    > = {};
    const estimateGasMethods: Record<
        string,
        (
            caller: Address,
            params?: { args?: FunctionArgs; value?: bigint }
        ) => Promise<bigint>
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
            }) => unknown; // EventFilter type
        }
    > = {};

    // Initialize contract object
    const contract: Contract<TAbi> = {
        address,
        abi,
        read: readMethods,
        simulate: simulateMethods,
        estimateGas: estimateGasMethods,
        events: eventMethods
    };

    // Process each ABI item to build the contract interface
    for (const abiItem of abi) {
        // Handle functions
        if (abiItem.type === 'function') {
            const functionName = abiItem.name;

            // Read methods (view/pure) - only available with publicClient
            if (
                (abiItem.stateMutability === 'view' ||
                    abiItem.stateMutability === 'pure') &&
                publicClient != null
            ) {
                contract.read[functionName] = async (...args: FunctionArgs) => {
                    // Encode function call data
                    const data = encodeFunctionData({
                        abi: abi as Abi,
                        functionName,
                        args: args ?? []
                    });

                    // Prepare call request
                    const clause: Clause = new Clause(
                        address,
                        0n,
                        Hex.of(data)
                    );

                    // Call the contract
                    const response = await publicClient.call(clause);

                    const result = response.data;

                    // Decode the result
                    if (abiItem.outputs != null && abiItem.outputs.length > 0) {
                        return decodeFunctionResult({
                            abi: abi as Abi,
                            functionName,
                            // Convert to the expected `0x${string}` type
                            data: result as unknown as `0x${string}`
                        });
                    }

                    return undefined;
                };
            }
            // Simulate methods - available with publicClient for all functions
            if (publicClient != null) {
                contract.simulate[functionName] = async ({
                    args = [],
                    value = 0n
                } = {}) => {
                    // Encode function call data
                    const data = encodeFunctionData({
                        abi: abi as Abi,
                        functionName,
                        args
                    });
                    const clause: Clause = new Clause(
                        address,
                        value,
                        Hex.of(data)
                    );

                    // Simulate the contract call
                    return await publicClient.simulateCalls([clause]);
                };

                // EstimateGas methods - available with publicClient for all functions
                contract.estimateGas[functionName] = async (
                    caller: Address,
                    { args = [], value = 0n } = {}
                ) => {
                    // Encode function call data
                    const data = encodeFunctionData({
                        abi: abi as Abi,
                        functionName,
                        args
                    });
                    const clause: Clause = new Clause(
                        address,
                        value,
                        Hex.of(data)
                    );

                    // Estimate gas for the contract call
                    const response = await publicClient.estimateGas(
                        [clause],
                        caller
                    );
                    return response.totalGas;
                };
            }
        }
        // Handle events - only available with publicClient
        else if (abiItem.type === 'event' && publicClient != null) {
            const eventName = abiItem.name;
            // Get event signature using viem's getEventSelector
            const eventSignature = toEventSelector(abiItem);

            contract.events[eventName] = {
                // Watch for contract events
                watch: ({ onLogs, onError, args = [], fromBlock }) => {
                    // Process indexed arguments if provided
                    const indexedInputs = abiItem.inputs.filter(
                        (input) => input.indexed
                    );
                    const indexedArgs: Hex[] = [];

                    // Convert args to Hex format for viem compatibility
                    if (
                        args != null &&
                        args.length > 0 &&
                        indexedInputs.length > 0
                    ) {
                        for (let i = 0; i < indexedInputs.length; i++) {
                            if (i < args.length && args[i] !== undefined) {
                                indexedArgs.push(
                                    Hex.of(args[i] as HexConvertible)
                                );
                            } else {
                                // Use 0x0 for missing arguments
                                indexedArgs.push(Hex.of('0'));
                            }
                        }
                    }

                    // Call PublicClient's watchEvent with properly typed parameters
                    return publicClient.watchEvent({
                        address,
                        // Convert event signature to Hex
                        event: Hex.of(eventSignature),
                        args: indexedArgs,
                        // Convert fromBlock to Hex if provided
                        fromBlock:
                            fromBlock !== undefined
                                ? Hex.of(fromBlock as HexConvertible)
                                : undefined,
                        onLogs,
                        onError
                    });
                },

                // Get historical event logs
                getLogs: async (options = {}) => {
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

                // Create event filter - viem compatibility
                createEventFilter: (options = {}) => {
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
        }
    }

    return contract;
}

export { getContract };
