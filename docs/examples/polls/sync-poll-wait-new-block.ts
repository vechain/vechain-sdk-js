import {
    HttpClient,
    Poll,
    ThorestClient
} from '@vechainfoundation/vechain-sdk-network';
import { expect } from 'expect';

// 1 - Create client for testnet

const _testnetUrl = 'https://testnet.vechain.org';
const testNetwork = new HttpClient(_testnetUrl);
const thorestClient = new ThorestClient(testNetwork);

// 2 - Get current block

const currentBlock = await thorestClient.blocks.getBestBlock();

console.log('Current block:', currentBlock);

// 3 - Wait until a new block is created

const newBlock = await Poll.SyncPoll(
    // Get the latest block as polling target function
    async () => await thorestClient.blocks.getBlock('best'),
    // Polling interval is 3 seconds
    { requestIntervalInMilliseconds: 3000 }
).waitUntil((newBlockData) => {
    // Stop polling when the new block number is greater than the current block number
    return (newBlockData?.number as number) > (currentBlock?.number as number);
});

expect(newBlock).toBeDefined();
expect(newBlock?.number).toBeGreaterThan(currentBlock?.number as number);

console.log('New block:', newBlock);
