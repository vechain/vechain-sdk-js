import { describe, expect, test } from '@jest/globals';
import { thorestClient } from '../../../fixture';
import { Poll } from '../../../../src/utils/poll';

/**
 * Test the Synchronous with real world example
 * @group integration/utils/sync-poll-example-testnet
 */
describe('Synchronous poll tests - Testnet', () => {
    /**
     * Test the sync poll WITHOUT force stopping
     */
    describe('No force stopping', () => {
        /**
         * Test the new block event
         */
        test('Wait until a new block is created', async () => {
            // Current block
            const currentBlock = await thorestClient.blocks.getBestBlock();

            // Wait until a new block is created
            const newBlock = await Poll.SyncPoll(
                async () => await thorestClient.blocks.getBlock('best')
            ).waitUntil((newBlockData) => {
                return (
                    (newBlockData?.number as number) >
                    (currentBlock?.number as number)
                );
            });

            expect(newBlock).toBeDefined();
            expect(newBlock?.number).toBeGreaterThan(
                currentBlock?.number as number
            );
        }, 30000);
    });
});
