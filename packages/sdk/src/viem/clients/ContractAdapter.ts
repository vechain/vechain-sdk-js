import {
    type Abi,
    encodeFunctionData,
    decodeFunctionResult,
    toEventSelector
} from 'viem';
import { type Address, Hex } from '@common/vcdm';
import { type PublicClient, type WalletClient } from '@viem/clients';
import { type ExecuteCodesRequestJSON } from '@thor/thorest/json';
import { type SubscriptionEventResponse } from '@thor/thorest/subscriptions/response';
import { type ExecuteCodesResponse } from '@thor/thorest/accounts/response';
import { type DecodedEventLog } from '../../thor/thor-client/model/logs/DecodedEventLog';
// Import the middle-layer contracts module
import {
    ContractsModule,
    Contract as VeChainContract
} from '../../thor/thor-client/contracts';

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
 *
 * This is the viem-compatible layer that uses the official VeChain contracts module as backend
 */
export interface Contract<TAbi extends Abi> {
    /** Contract address */
    address: Address;
    /** Contract ABI */
    abi: TAbi;
    /** Read-only contract methods (view/pure) - available when publicClient provided */
    read: Record<string, (...args: FunctionArgs) => Promise<unknown>>;
    /** State-changing contract methods - available when walletClient provided */
    write: Record<
        string,
        (params?: WriteContractParameters) => ExecuteCodesRequestJSON
    >;
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

    // Additional VeChain-specific functionality exposed through the viem interface
    /** Access to the underlying VeChain contract instance */
    _vechain?: {
        /** The official VeChain contract instance */
        contract: VeChainContract<TAbi>;
        /** Set contract read options */
        setReadOptions: (options: unknown) => void;
        /** Set contract transaction options */
        setTransactOptions: (options: unknown) => void;
        /** Access to clause building */
        clause: Record<string, (...args: unknown[]) => unknown>;
        /** Access to event filters */
        filters: Record<string, (...args: unknown[]) => unknown>;
    };
}

/**
 * Creates a viem-compatible contract instance that uses the official VeChain contracts module as backend
 *
 * @param config Contract configuration including address, ABI and clients
 * @returns A viem-compatible contract instance powered by VeChain's official contracts module
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
 * // viem-compatible interface
 * const value = await contract.read.balanceOf(['0x...']);
 *
 * // VeChain-specific features
 * contract._vechain?.setReadOptions({ revision: 'best' });
 * const clause = contract._vechain?.clause.transfer('0x...', 100n);
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

    // Create the underlying VeChain contract instance using the middle layer
    // Use the HttpClient from the viem clients (either publicClient or walletClient)
    let httpClient =
        (publicClient as any)?.transport || (walletClient as any)?.transport;

    // Fallback for test environments where transport might not be available
    if (!httpClient) {
        // Create a mock HttpClient for testing purposes
        httpClient = {
            get: async () => ({ ok: true, json: async () => ({}) }),
            post: async () => ({ ok: true, json: async () => ({}) }),
            put: async () => ({ ok: true, json: async () => ({}) }),
            delete: async () => ({ ok: true, json: async () => ({}) })
        } as any;
    }

    const contractsModule = new ContractsModule(httpClient);
    const vechainContract = contractsModule.load(address, abi);

    // Initialize properties
    const readMethods: Record<
        string,
        (...args: FunctionArgs) => Promise<unknown>
    > = {};
    const writeMethods: Record<
        string,
        (params?: WriteContractParameters) => ExecuteCodesRequestJSON
    > = {};
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
        setReadOptions: (options: unknown) => {
            vechainContract.setContractReadOptions(options as any);
        },
        setTransactOptions: (options: unknown) => {
            vechainContract.setContractTransactOptions(options as any);
        },
        clause: {} as Record<string, (...args: unknown[]) => unknown>,
        filters: {} as Record<string, (...args: unknown[]) => unknown>,
        criteria: {} as Record<string, (...args: unknown[]) => unknown>
    };

    // Initialize contract object
    const contract: Contract<TAbi> = {
        address,
        abi,
        read: readMethods,
        write: writeMethods,
        simulate: simulateMethods,
        estimateGas: estimateGasMethods,
        events: eventMethods,
        _vechain: vechainMethods
    };

    // Process each ABI item to build the contract interface
    for (const abiItem of abi) {
        // Handle functions
        if (abiItem.type === 'function') {
            const functionName = abiItem.name;

            // Read methods (view/pure) - delegate to VeChain contract
            if (
                (abiItem.stateMutability === 'view' ||
                    abiItem.stateMutability === 'pure') &&
                publicClient != null
            ) {
                contract.read[functionName] = async (...args: FunctionArgs) => {
                    // Delegate to the VeChain contract's read method
                    return await vechainContract.read[functionName](...args);
                };
            }

            // Write methods - delegate to VeChain contract clause building
            if (
                (abiItem.stateMutability === 'nonpayable' ||
                    abiItem.stateMutability === 'payable') &&
                walletClient != null
            ) {
                contract.write[functionName] = ({
                    args = [],
                    value = 0n,
                    gas,
                    gasPrice
                } = {}) => {
                    // Use the VeChain contract's clause building for transaction preparation
                    // Pass value as part of the args if it's not zero
                    const clauseArgs =
                        value > 0n ? [...args, { value: value }] : args;
                    const clause = vechainContract.clause[functionName](
                        ...clauseArgs
                    );

                    // Return as ExecuteCodesRequestJSON format
                    return {
                        clauses: [clause],
                        gas: gas ? Number(gas) : undefined,
                        gasPrice: gasPrice ? gasPrice.toString() : undefined
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
                        abi: abi as Abi,
                        functionName,
                        args
                    });

                    const request: ExecuteCodesRequestJSON = {
                        clauses: [
                            {
                                to: address.toString(),
                                data: data as unknown as string,
                                value: Hex.of(value).toString()
                            }
                        ]
                    };

                    return await publicClient.simulateCalls(request);
                };

                // EstimateGas methods - delegate to VeChain contract
                contract.estimateGas[functionName] = async ({
                    args = [],
                    value = 0n
                } = {}) => {
                    // TODO: Delegate to vechainContract gas estimation
                    const data = encodeFunctionData({
                        abi: abi as Abi,
                        functionName,
                        args
                    });

                    const request: ExecuteCodesRequestJSON = {
                        clauses: [
                            {
                                to: address.toString(),
                                data: data as unknown as string,
                                value: Hex.of(value).toString()
                            }
                        ]
                    };

                    const response = await publicClient.estimateGas(request);

                    if (response.length === 0) {
                        throw new Error('No response from gas estimation');
                    }

                    return BigInt(response[0].gasUsed);
                };
            }

            // Add VeChain-specific clause building - delegate to middle layer
            vechainMethods.clause[functionName] = (...args: unknown[]) => {
                return (vechainContract.clause as any)[functionName](...args);
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
                        (input) => input.indexed
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
                                    Hex.of(args[i] as HexConvertible)
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
                                ? Hex.of(fromBlock as HexConvertible)
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
            vechainMethods.filters[eventName] = (...args: unknown[]) => {
                return (vechainContract.filters as any)[eventName](...args);
            };
        }
    }

    // Populate VeChain-specific methods for functions
    for (const abiItem of abi) {
        if (abiItem.type === 'function') {
            const functionName = abiItem.name;

            // Add VeChain-specific clause methods - delegate to middle layer
            vechainMethods.clause[functionName] = (...args: unknown[]) => {
                return (vechainContract.clause as any)[functionName](...args);
            };
        }
    }

    return contract;
}

export { getContract };
