import { describe, expect, test } from '@jest/globals';
import { validBlockRevisions, invalidBlockRevisions } from './fixture';
import { thorClient } from '../../../fixture';

/**
 * ThorClient class tests
 *
 * @group integration/client/thor/blocks
 */
describe('ThorClient - Blocks', () => {
    /**
     * getBlock tests
     */
    describe('getBlock', () => {
        /**
         * getBlock tests with revision block number or block id
         */
        validBlockRevisions.forEach(({ revision, expanded, expected }) => {
            test(revision, async () => {
                const blockDetails = await thorClient.blocks.getBlock(
                    revision,
                    expanded
                );
                expect(blockDetails).toEqual(expected);
            });
        });

        /**
         * getBlock tests with invalid revision block number or block id
         */
        invalidBlockRevisions.forEach(
            ({ description, revision, expectedError }) => {
                test(description, async () => {
                    await expect(
                        thorClient.blocks.getBlock(revision)
                    ).rejects.toThrowError(expectedError);
                });
            }
        );

        /**
         * getBlock tests with 'best' as revision
         */
        test('best', async () => {
            const blockDetails = await thorClient.blocks.getBlock('best');
            expect(blockDetails).toBeDefined();
        });

        /**
         * getBlock tests with 'finalized' as revision
         */
        test('finalized', async () => {
            const blockDetails = await thorClient.blocks.getBlock('finalized');
            expect(blockDetails).toBeDefined();
        });
    });
});
