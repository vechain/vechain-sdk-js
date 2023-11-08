import { blockUtils } from '../../../src/utils';
import { describe, expect, test } from '@jest/globals';
import { blockRevisions } from './fixture';

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
        blockRevisions.forEach(({ revision, expected }) => {
            expect(blockUtils.isBlockRevision(revision)).toBe(expected);
        });
    });
});
