import {
    HttpClient,
    ThorestClient
} from '@vechainfoundation/vechain-sdk-network';

// Url of the solo network
const _soloUrl = 'http://localhost:8669';

// Solo network instance
const soloNetwork = new HttpClient(_soloUrl);

// Thorest client solo instance
const thorestSoloClient = new ThorestClient(soloNetwork);

// Get block details
const blockDetails = await thorestSoloClient.blocks.getBlock(1);
console.log(blockDetails);
