---
description: Thorest-client
---

# Thorest-client

The thorest-client serves as a RESTful API for seamless access to the VechainThor network. This client streamlines the interaction with the blockchain by providing a set of methods specifically tailored to retrieve information from various endpoints. By encapsulating the intricacies of the underlying communication with the VechainThor network, developers can easily integrate this client into their applications. Whether fetching details about specific blocks, querying transaction information, or accessing other blockchain-related data, the thorest-client simplifies the process, enabling efficient and straightforward integration with the VechainThor network through RESTful API calls.

## Blocks

```typescript { name=blocks, category=example }
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

```
