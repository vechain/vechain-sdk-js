import {
    type Abi,
    type AbiParameter,
    encodeFunctionData,
    decodeFunctionResult,
    toEventSelector
} from 'viem';
import { type Address, Hex } from '@common/vcdm';
import { type PublicClient, type WalletClient } from '@viem/clients';
import { type ExecuteCodesRequestJSON } from '@thor/thorest/json';
import { type SubscriptionEventResponse } from '@thor/thorest/subscriptions/response';
import { type ExecuteCodesResponse } from '@thor/thorest/accounts/response';
import { type DecodedEventLog } from '@/thor/thor-client/model/logs/DecodedEventLog';
// Import the new adapter layer
import {
    getContract as getContractAdapter,
    type Contract as AdapterContract
} from './ContractAdapter';

// Type alias for hex-convertible values

// Type alias for function arguments
type FunctionArgs = AbiParameter[];

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
}

function getContract<const TAbi extends Abi>({
    address,
    abi,
    publicClient,
    walletClient
}: ContractConfig<TAbi>): AdapterContract<TAbi> {
    // Delegate to the new adapter layer that uses the official VeChain contracts module
    return getContractAdapter({
        address,
        abi,
        publicClient,
        walletClient
    });
}

// Export the main function and re-export adapter types for advanced usage
export { getContract };
export type { Contract as AdapterContract } from './ContractAdapter';
