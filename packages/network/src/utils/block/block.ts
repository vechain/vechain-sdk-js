import { dataUtils } from '@vechain-sdk/core';

/**
 * Determines whether the provided string is a valid block revision.
 * A valid block revision is either a hex string for the block id or a decimal string for the block number.
 *
 * @param revision - The string to be validated as a block revision.
 * @returns `true` if the string is a valid block revision, otherwise `false`.
 */
const isBlockRevision = (revision: string): boolean => {
    if (
        !dataUtils.isHexString(revision) &&
        !dataUtils.isDecimalString(revision)
    ) {
        return false;
    }

    return true;
};

/**
 * A utility object for block-related utility operations.
 */
export const blockUtils = { isBlockRevision };
