import {
    HttpClient,
    Poll,
    ThorestClient
} from '@vechainfoundation/vechain-sdk-network';
import { expect } from 'expect';

// Create client for testnet
const _testnetUrl = 'https://testnet.vechain.org';
const testNetwork = new HttpClient(_testnetUrl);
const thorestClient = new ThorestClient(testNetwork);

// Current block
const currentBlock = await thorestClient.blocks.getBestBlock();
console.log(currentBlock);

// Wait until a new block is created
const newBlock = await Poll.SyncPoll(
    async () => await thorestClient.blocks.getBlock('best'),
    { requestIntervalInMilliseconds: 3000 }
).waitUntil((newBlockData) => {
    return (newBlockData?.number as number) > (currentBlock?.number as number);
});

expect(newBlock).toBeDefined();
expect(newBlock?.number).toBeGreaterThan(currentBlock?.number as number);
console.log(newBlock);
