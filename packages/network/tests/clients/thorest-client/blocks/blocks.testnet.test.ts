import { describe, expect, test } from '@jest/globals';
import { validBlockRevisions, invalidBlockRevisions } from './fixture';
import { thorestClient } from '../../../fixture';
import { ThorClient } from '../../../../src';

/**
 * ThorestClient - BlockClient class tests
 *
 * @group integration/clients/thorest-client/blocks
 */
describe('ThorestClient - Blocks', () => {
    const thorClient = new ThorClient(thorestClient);
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
                        thorClient.blocks.getBlock(revision)
                    ).rejects.toThrowError(expectedError);
                });
            }
        );

        /**
         * getBestBlock test
         */
        test('getBestBlock', async () => {
            const blockDetails = await thorClient.blocks.getBestBlock();
            expect(blockDetails).not.toBeNull();
            expect(blockDetails).toBeDefined();
        });

        /**
         * getBestBlockRef test
         */
        test('getBestBlockRef', async () => {
            const bestBlockRef = await thorClient.blocks.getBestBlockRef();
            expect(bestBlockRef).not.toBeNull();
            expect(bestBlockRef).toBeDefined();
        });

        /**
         * getFinalBlock test
         */
        test('getFinalBlock', async () => {
            const blockDetails = await thorClient.blocks.getFinalBlock();
            expect(blockDetails).not.toBeNull();
            expect(blockDetails).toBeDefined();
        });
    });
});
