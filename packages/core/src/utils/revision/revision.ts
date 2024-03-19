import { dataUtils } from '../data';
import { Hex0x } from '../hex';

/**
 * Determines whether the provided revision is a valid for blocks functions.
 * A valid block revision can be:
 * - A hexadecimal string representing the block ID.
 * - A decimal string representing the block number.
 * - 'best' to refer to the latest block.
 * - 'finalized' to refer to the finalized block.
 *
 * @param revision - The string to be validated as a block revision.
 * @returns `true` if the string is a valid block revision, otherwise `false`.
 */
const isRevisionBlock = (revision: string | number): boolean => {
    return revision === 'finalized' || isRevisionAccount(revision);
};

/**
 * Determines whether the provided revision is a valid for accounts functions.
 * A valid account revision can be:
 * - A hexadecimal string representing the block ID.
 * - A decimal string representing the block number.
 * - 'best' to refer to the latest block.
 *
 * @param revision - The string to be validated as an account revision.
 * @returns `true` if the string is a valid account revision, otherwise `false`.
 */
const isRevisionAccount = (revision: string | number): boolean => {
    return (
        revision === 'best' ||
        (typeof revision === 'string' && Hex0x.isValid(revision)) ||
        (typeof revision === 'string' && dataUtils.isDecimalString(revision)) ||
        (typeof revision === 'number' && revision >= 0)
    );
};

/**
 * A utility object for revision-related utility operations.
 */
export const revisionUtils = { isRevisionBlock, isRevisionAccount };
