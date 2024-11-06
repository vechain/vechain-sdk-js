import { type Address, type Hex, type VET } from '@vechain/sdk-core';

/**
 * Type for input for trace contract call - target contract.
 */
export interface ContractTraceTarget {
    /**
     * The recipient of the call.
     * Null indicates contract deployment.
     */
    to?: Address | null;

    /**
     * The input data for the contract call.
     */
    data?: Hex;

    /**
     * The amount of token to be transferred.
     */
    value?: VET;
}
