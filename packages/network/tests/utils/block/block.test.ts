import { blockUtils } from '../../../src/utils';
import { describe, expect, test } from '@jest/globals';
import { testAccount } from '../../fixture';

/**
 * Unit tests for the blockUtils module.
 *
 * @group unit/utils
 */
describe('blockUtils', () => {
    /**
     * Test case for the `isBlockRevision` function.
     */
    test('isBlockRevision', () => {
        // Test if an invalid address string is not a valid block revision
        expect(blockUtils.isBlockRevision('invalid-address')).toBe(false);

        // Test if a valid account address is a valid block revision
        expect(blockUtils.isBlockRevision(testAccount)).toBe(true);

        // Test if a valid decimal string is a valid block revision
        expect(blockUtils.isBlockRevision('100')).toBe(true);

        // Test if an invalid hex string is a valid block revision
        expect(blockUtils.isBlockRevision('0xG8656c6c6f')).toBe(false);
    });
});
