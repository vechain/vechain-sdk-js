import { type Address, type BlockId } from '@vechain/sdk-core';

/**
 * Type for input options
 * for retrieve storage range function
 */
export interface RetrieveStorageRangeOptions {
    /**
     * The address of the contract/ account to be traced.
     */
    address?: Address;

    /**
     * The start key of the storage range.
     * Default is 0x0000000000000000000000000000000000000000000000000000000000000000.
     */
    keyStart?: BlockId;

    /**
     * The maximum number of results to be returned. Default is 1000.
     */
    maxResult?: number;
}
