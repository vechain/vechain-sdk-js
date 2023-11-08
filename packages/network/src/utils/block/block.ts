import { dataUtils } from '@vechain-sdk/core';

/**
 * Determines whether the provided string is a valid block revision.
 * A valid block revision can be:
 * - A hexadecimal string representing the block ID.
 * - A decimal string representing the block number.
 * - 'best' to refer to the latest block.
 * - 'finalized' to refer to the finalized block.
 *
 * @param revision - The string to be validated as a block revision.
 * @returns `true` if the string is a valid block revision, otherwise `false`.
 */
const isBlockRevision = (revision: string): boolean => {
    return (
        revision === 'best' ||
        revision === 'finalized' ||
        dataUtils.isHexString(revision) ||
        dataUtils.isDecimalString(revision)
    );
};

/**
 * A utility object for block-related utility operations.
 */
export const blockUtils = { isBlockRevision };
