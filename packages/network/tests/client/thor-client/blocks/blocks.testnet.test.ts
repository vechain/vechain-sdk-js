import { describe, expect, test } from '@jest/globals';
import { blockRevisions } from './fixture';
import { thorClient } from '../../../fixture';

/**
 * ThorClient class tests
 *
 * @group integration/client/thor/blocks
 */
describe('ThorClient - Blocks', () => {
    /**
     * getAccount tests
     */
    describe('getBlock', () => {
        /**
         * getBlock tests with revision block number or block id
         */
        blockRevisions.forEach(({ revision, expanded, expected }) => {
            test(revision, async () => {
                const blockDetails = await thorClient.blocks.getBlock(
                    revision,
                    expanded
                );
                expect(blockDetails).toEqual(expected);
            });
        });

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
