import { describe, expect, test } from '@jest/globals';
import { blockAssertionsTests } from './fixture';
import {
    assertIsRevisionForAccount,
    assertIsRevisionForBlock
} from '../../../src';

/**
 * Block assertions
 *
 * @group unit/utils-assertions
 */
describe('Block assertions', () => {
    /**
     * Assert is valid revision
     */
    describe('assertIsRevision', () => {
        /**
         * Valid account endpoint revisions
         */
        blockAssertionsTests.assertIsRevisionForAccount.valid.forEach(
            ({ value }) => {
                test(`should not throw error for assertIsRevision of ${value}`, () => {
                    expect(() => {
                        assertIsRevisionForAccount(value);
                    }).not.toThrow();
                });
            }
        );

        /**
         * Invalid account endpoint revisions
         */
        blockAssertionsTests.assertIsRevisionForAccount.invalid.forEach(
            ({ value }) => {
                test(`should throw error for assertIsRevision of ${value}`, () => {
                    expect(() => {
                        assertIsRevisionForAccount(value);
                    }).toThrow();
                });
            }
        );
    });

    /**
     * Assert is valid block revision
     */
    describe('assertIsRevisionForBlock', () => {
        /**
         * Valid block endpoint revisions
         */
        blockAssertionsTests.assertIsRevisionForBlock.valid.forEach(
            ({ value }) => {
                test(`should not throw error for assertIsRevision of ${value}`, () => {
                    expect(() => {
                        assertIsRevisionForBlock(value);
                    }).not.toThrow();
                });
            }
        );

        /**
         * Invalid block endpoint revisions
         */
        blockAssertionsTests.assertIsRevisionForBlock.invalid.forEach(
            ({ value }) => {
                test(`should throw error for assertIsRevision of ${value}`, () => {
                    expect(() => {
                        assertIsRevisionForBlock(value);
                    }).toThrow();
                });
            }
        );
    });
});
