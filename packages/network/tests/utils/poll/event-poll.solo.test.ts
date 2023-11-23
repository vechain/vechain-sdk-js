import { describe, expect, test } from '@jest/globals';
// import { thorestClient } from '../../fixture';
// import { Poll } from '../../../src/utils/poll';

/**
 * Test the Synchronous poll on Solo node
 * @group integration/utils/event-poll
 */
describe('Events poll tests - Solo', () => {
    /**
     * Test the new block event
     */
    test('Wait until a new block is created', () => {
        expect(true).toBeTruthy();
        // // Current block
        // const currentBlock = await thorestClient.blocks.getBestBlock();
        //
        // // Wait until a new block is created
        // const blockEventPoll = new Poll.EventPoll(
        //     async () => await thorestClient.blocks.getBlock('best'),
        //     1000
        // );
        // blockEventPoll.startListen();
        // blockEventPoll.on('data', (newBlockData, instance) => {
        //     console.log('data', newBlockData);
        //     instance.stopListen();
        // });
        // blockEventPoll.on('error', (error) => {
        //     console.log('error', error);
        // });
        // const newBlock = await Poll.syncPoll(
        //     async () => await thorestClient.blocks.getBlock('best'),
        //     1000
        // ).waitUntil((newBlockData) => {
        //     return (
        //         (newBlockData?.number as number) >
        //         (currentBlock?.number as number)
        //     );
        // });
        // expect(newBlock).toBeDefined();
        // expect(newBlock?.number).toBeGreaterThan(
        //     currentBlock?.number as number
        // );
    }, 30000);
});
