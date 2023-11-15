import { describe, expect, test } from '@jest/globals';
import { validBlockRevisions, invalidBlockRevisions } from './fixture';
import { thorClient } from '../../../fixture';
import { InvalidDataTypeError } from '@vechainfoundation/vechain-sdk-errors';

/**
 * ThorClient - BlockClient class tests
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

    /**
     * waitForBlock tests with valid revision
     */
    test('waitForBlock', async () => {
        const bestBlock = await thorClient.blocks.getBestBlock();
        const waitForBlock = bestBlock != null ? bestBlock.number + 2 : 2;
        const blockDetails = await thorClient.blocks.waitForBlock(waitForBlock);
        expect(blockDetails.number).toBe(waitForBlock);
    }, 20000);

    /**
     * waitForBlock tests with invalid revision
     */
    test('waitForBlock with invalid revision', async () => {
        await expect(thorClient.blocks.waitForBlock('a')).rejects.toThrowError(
            InvalidDataTypeError
        );
    });
});
