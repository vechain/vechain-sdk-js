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
         * getBlock tests with no parameter (best block is assumed)
         */
        test('get block without revision', async () => {
            const blockDetails = await thorClient.blocks.getBlock();
            expect(blockDetails).toBeDefined();
        });

        /**
         * getBestBlock test
         */
        test('getBestBlock', async () => {
            const blockDetails = await thorClient.blocks.getBestBlock();
            expect(blockDetails).toBeDefined();
        });

        /**
         * getFinalBlock test
         */
        test('getFinalBlock', async () => {
            const blockDetails = await thorClient.blocks.getFinalBlock();
            expect(blockDetails).toBeDefined();
        });
    });
});
