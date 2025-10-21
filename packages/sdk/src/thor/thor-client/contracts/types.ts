/* eslint-disable */
// TODO: Contracts module is pending rework - lint errors will be fixed during refactor
import type { Abi, AbiParameter } from 'abitype';
import { BlockRef, type Address, type Hex, type Revision } from '@common/vcdm';
import { type EstimateGasOptions } from '../../thor-client/model/gas/EstimateGasOptions';
import { type TransactionRequest } from '../../thor-client/model/transactions/TransactionRequest';
import { type SimulateTransactionOptions } from '../../thor-client/model/transactions/SimulateTransactionOptions';

// Proper function arguments type using VeChain SDK types
type FunctionArgs = AbiParameter[];

/* --------- Viem Compatibility Types Start --------- */

/**
 * Parameters for writing to a contract (viem compatibility)
 */
export interface WriteContractParameters {
    /**
     * The function arguments
     */
    args?: FunctionArgs;

    /**
     * The value to send with the transaction
     */
    value?: bigint;

    /**
     * Gas limit for the transaction
     */
    gas?: bigint;

    /**
     * Gas price coefficient for the transaction (VeChain specific)
     */
    gasPriceCoef?: bigint;

    /**
     * Maximum fee per gas (EIP-1559 dynamic fees)
     */
    maxFeePerGas?: bigint;

    /**
     * Maximum priority fee per gas (EIP-1559 dynamic fees)
     */
    maxPriorityFeePerGas?: bigint;
}

/**
 * Event filter for contract events (viem compatibility)
 */
export interface EventFilter {
    /**
     * The contract address
     */
    address?: string;

    /**
     * The event topics
     */
    topics?: string[];

    /**
     * Block range for filtering
     */
    fromBlock?: string | number;
    toBlock?: string | number;
}

/**
 * Contract simulation result
 */
export interface SimulationResult {
    /**
     * Whether the simulation was successful
     */
    success: boolean;

    /**
     * The simulation result data
     */
    result:
        | string
        | number
        | bigint
        | boolean
        | Address
        | Hex
        | (string | number | bigint | boolean | Address | Hex)[];

    /**
     * Gas used in the simulation
     */
    gasUsed?: bigint;

    /**
     * Any error that occurred during simulation
     */
    error?: string;
}

/**
 * Contract deployment options
 */
export interface ContractDeploymentOptions {
    /**
     * Constructor arguments
     */
    constructorArgs?: FunctionArgs;

    /**
     * Transaction request for the deployment
     */
    transactionRequest?: TransactionRequest;

    /**
     * Comment for the deployment
     */
    comment?: string;
}

/* --------- Viem Compatibility Types End --------- */

declare module 'abitype' {
    export interface Register {
        AddressType: Address;
    }
}

/* --------- Input types Start --------- */

/**
 * Defines the options for executing a contract call within a blockchain environment.
 */
type ContractCallOptions = EstimateGasOptions & {
    /**
     * Caller address
     */
    caller?: Address;

    /**
     * Comment for the call
     */
    comment?: string;

    /**
     * Include ABI in response
     */
    includeABI?: boolean;

    /**
     * The revision to query the contract state at (block number, block ID, or label like "best")
     * Can be a string, number, bigint, Hex, or Revision object
     * Strings can be: "best", "finalized", "justified", "next", or a block ID
     * Numbers/bigints represent block numbers
     */
    revision?: string | number | bigint | Revision;
};

// SimulateTransactionOptions is imported from model/transactions/SimulateTransactionOptions

/* --------- Input types End --------- */

/**
 * Represents the result of a contract call operation, encapsulating the output of the call.
 */
interface ContractCallResult {
    success: boolean;
    result: {
        plain?:
            | string
            | number
            | bigint
            | boolean
            | Address
            | Hex
            | (string | number | bigint | boolean | Address | Hex)[]; // Success result as a plain value or array
        array?: (string | number | bigint | boolean | Address | Hex)[]; // Success result as an array
        errorMessage?: string;
    };
}

// SendTransactionResult is now defined in model/types.ts

export type {
    ContractCallOptions,
    ContractCallResult,
    SimulateTransactionOptions
};
