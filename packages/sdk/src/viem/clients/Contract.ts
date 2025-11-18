/* eslint-disable */
// TODO: Contracts module is pending rework - lint errors will be fixed during refactor
import { type Abi, type AbiParameter } from 'viem';
import { type Address, AddressLike, Revision } from '@common/vcdm';
import { type PublicClient, type WalletClient } from '@viem/clients';
import { type SubscriptionEventResponse } from '@thor/thorest/subscriptions/response';
import { type DecodedEventLog } from '@/thor/thor-client/model/logs/DecodedEventLog';
import {
    type ClauseSimulationResult,
    type SimulateTransactionOptions
} from '@thor/thor-client';
// Import the new adapter layer
import {
    getContract as getContractAdapter,
    type Contract as AdapterContract
} from './ContractAdapter';

// Type alias for hex-convertible values

// Type alias for function arguments (runtime values, not ABI definitions)
type FunctionArgs = readonly unknown[];

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
 * A contract instance with read, write, simulate, estimateGas, and event interfaces
 * Compatible with viem's getContract return type
 */
export interface Contract<TAbi extends Abi> {
    /** Contract address */
    address: Address;
    /** Contract ABI */
    abi: TAbi;
    /** Read-only contract methods (view/pure) plus simulated state-changing functions - available when publicClient provided */
    read: Record<string, (...args: FunctionArgs) => Promise<unknown>>;
    /** State-changing contract methods - available when walletClient provided */
    write: Record<
        string,
        (params?: WriteContractParameters) => Promise<string>
    >;
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
            params?: {
                args?: FunctionArgs;
                value?: bigint;
                revision?: Revision;
            }
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
 * Wrapper around ContractAdapter's getContract for backward compatibility.
 * This delegates to the official ContractAdapter implementation.
 */
function getContract<const TAbi extends Abi>({
    address,
    abi,
    publicClient,
    walletClient
}: ContractConfig<TAbi>): Contract<TAbi> {
    // Delegate to the ContractAdapter which uses ThorClient
    const adapterContract = getContractAdapter({
        address,
        abi,
        publicClient,
        walletClient
    }) as any;

    // Return the contract with the proper interface
    // The adapter contract already has all the required properties
    return adapterContract as Contract<TAbi>;
}

// Export the main function and re-export adapter types for advanced usage
export { getContract };
export type { Contract as AdapterContract } from './ContractAdapter';
