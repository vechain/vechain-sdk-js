import {
    HttpClient,
    ThorestClient
} from '@vechainfoundation/vechain-sdk-network';

// Url of the solo network
const _soloUrl = 'https://testnet.vechain.org/';

// Solo network instance
const soloNetwork = new HttpClient(_soloUrl);

// Thorest client solo instance
const thorestSoloClient = new ThorestClient(soloNetwork);

// Get block details
const blockDetails = await thorestSoloClient.blocks.getBlock(1);
console.log(blockDetails);

// Get best block details
const bestBlockDetails = await thorestSoloClient.blocks.getBestBlock();
console.log(bestBlockDetails);

// Get finalizes block details
const finalBlockDetails = await thorestSoloClient.blocks.getFinalBlock();
console.log(finalBlockDetails);
