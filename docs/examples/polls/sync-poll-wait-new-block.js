import { Poll, TESTNET_URL, ThorClient } from '@vechain/sdk-network';
import { expect } from 'expect';
// 1 - Create thor client for testnet
const thorClient = ThorClient.at(TESTNET_URL);
// 2 - Get current block
const currentBlock = await thorClient.blocks.getBestBlockCompressed();
console.log('Current block:', currentBlock);
// 3 - Wait until a new block is created
// Wait until a new block is created with polling interval of 3 seconds
const newBlock = await Poll.SyncPoll(
// Get the latest block as polling target function
async () => await thorClient.blocks.getBlockCompressed('best'), 
// Polling interval is 3 seconds
{ requestIntervalInMilliseconds: 3000 }).waitUntil((newBlockData) => {
    // Stop polling when the new block number is greater than the current block number
    return newBlockData?.number > currentBlock?.number;
});
expect(newBlock).toBeDefined();
expect(newBlock?.number).toBeGreaterThan(currentBlock?.number);
console.log('New block:', newBlock);
