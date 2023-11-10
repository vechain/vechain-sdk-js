import { revisionUtils } from '../../../src/utils';
import { describe, expect, test } from '@jest/globals';
import { accountRevisions, blockRevisions } from './fixture';

/**
 * Unit tests for the blockUtils module.
 *
 * @group unit/utils
 */
describe('blockUtils', () => {
    /**
     * Test case for the `isRevisionBlock` function.
     */
    test('isBlockRevision', () => {
        blockRevisions.forEach(({ revision, expected }) => {
            expect(revisionUtils.isRevisionBlock(revision)).toBe(expected);
        });
    });

    /**
     * Test case for the `isRevisionAccount` function.
     */
    test('isAccountRevision', () => {
        accountRevisions.forEach(({ revision, expected }) => {
            expect(revisionUtils.isRevisionAccount(revision)).toBe(expected);
        });
    });
});
