import type { Abi } from 'abitype';
import { type Address } from '@common/vcdm';
import { type EstimateGasOptions } from '../../thor-client/model/gas/EstimateGasOptions';
import { type ClauseOptions } from '@thor/thorest/transactions/model/ClauseOptions';

declare module 'abitype' {
    export interface Register {
        AddressType: Address;
    }
}

/* --------- Input types Start --------- */

/**
 * Defines the options for executing a contract transaction.
 */
type ContractTransactionOptions = {
    /**
     * The value to send with the transaction (in wei)
     */
    value?: string | number | bigint;

    /**
     * Gas limit for the transaction
     */
    gas?: number;

    /**
     * Gas price for the transaction
     */
    gasPrice?: string;

    /**
     * Transaction expiration
     */
    expiration?: number;

    /**
     * Block reference
     */
    blockRef?: string;

    /**
     * Comment for the transaction
     */
    comment?: string;

    /**
     * The delegation URL to use to sponsor the transaction.
     */
    delegationUrl?: string;
};

/**
 * Defines the options for executing a contract call within a blockchain environment.
 */
type ContractCallOptions = EstimateGasOptions & {
    /**
     * Caller address
     */
    caller?: string;

    /**
     * Comment for the call
     */
    comment?: string;

    /**
     * Include ABI in response
     */
    includeABI?: boolean;
};

/**
 * Defines the options for simulating a contract transaction.
 */
interface SimulateTransactionOptions {
    /**
     * Revision to use for the simulation
     */
    revision?: string | number;

    /**
     * Caller address
     */
    caller?: string;

    /**
     * Gas limit for simulation
     */
    gas?: number;

    /**
     * Gas price for simulation
     */
    gasPrice?: string;

    /**
     * Comment for the simulation
     */
    comment?: string;
}

/* --------- Input types End --------- */

/**
 * Represents the result of a contract call operation, encapsulating the output of the call.
 */
interface ContractCallResult {
    success: boolean;
    result: {
        plain?: unknown; // Success result as a plain value (might be literal or object).
        array?: unknown[]; // Success result as an array (values are the same as in plain).
        errorMessage?: string;
    };
}

/**
 * Send transaction result
 */
interface SendTransactionResult {
    transactionId: string;
    signer: string;
}

/**
 * Contract clause for transaction building
 */
interface ContractClause {
    to: string;
    data: string;
    value: string;
    comment?: string;
}

export type {
    ContractCallOptions,
    ContractCallResult,
    ContractTransactionOptions,
    SendTransactionResult,
    ContractClause,
    SimulateTransactionOptions
};
