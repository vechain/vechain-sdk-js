import { describe, expect, test } from '@jest/globals';
import { validBlockRevisions, invalidBlockRevisions } from './fixture';
import { thorestClient } from '../../../fixture';

/**
 * ThorestClient - BlockClient class tests
 *
 * @group integration/clients/thorest-client/blocks
 */
describe('ThorestClient - Blocks', () => {
    /**
     * getBlock tests
     */
    describe('getBlock', () => {
        /**
         * getBlock tests with revision block number or block id
         */
        validBlockRevisions.forEach(({ revision, expanded, expected }) => {
            test(revision, async () => {
                const blockDetails = await thorestClient.blocks.getBlock(
                    revision,
                    {
                        expanded
                    }
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
                        thorestClient.blocks.getBlock(revision)
                    ).rejects.toThrowError(expectedError);
                });
            }
        );

        /**
         * getBestBlock test
         */
        test('getBestBlock', async () => {
            const blockDetails = await thorestClient.blocks.getBestBlock();
            expect(blockDetails).toBeDefined();
        });

        /**
         * getFinalBlock test
         */
        test('getFinalBlock', async () => {
            const blockDetails = await thorestClient.blocks.getFinalBlock();
            expect(blockDetails).toBeDefined();
        });
    });
});
