import {
    HttpClient,
    ThorestClient
} from '@vechainfoundation/vechain-sdk-network';

// Url of the testnet network
const _testnetUrl = 'https://testnet.vechain.org/';

// Testnet network instance
const testNetwork = new HttpClient(_testnetUrl);

// Thorest client testnet instance
const thorestTestnetClient = new ThorestClient(testNetwork);

// Get block details
const blockDetails = await thorestTestnetClient.blocks.getBlock(1);
console.log(blockDetails);

// Get best block details
const bestBlockDetails = await thorestTestnetClient.blocks.getBestBlock();
console.log(bestBlockDetails);

// Get finalizes block details
const finalBlockDetails = await thorestTestnetClient.blocks.getFinalBlock();
console.log(finalBlockDetails);
