import { describe, expect, test } from '@jest/globals';
import { thorestClient } from '../../fixture';
import { Poll } from '../../../src/utils/poll';

/**
 * Test the Synchronous
 * @group integration/utils/sync-poll
 */
describe('Synchronous poll tests - Testnet', () => {
    /**
     * Test the new block event
     */
    test('Wait until a new block is created', async () => {
        // Current block
        const currentBlock = await thorestClient.blocks.getBestBlock();

        // Wait until a new block is created
        const newBlock = await Poll.syncPoll(
            async () => await thorestClient.blocks.getBlock('best'),
            1000
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
    }, 100000);
});
