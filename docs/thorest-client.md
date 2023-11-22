---
description: Thorest-client
---

# Thorest-client

The thorest-client serves as a RESTful API for seamless access to the VechainThor network. This client streamlines the interaction with the blockchain by providing a set of methods specifically tailored to retrieve information from various endpoints. By encapsulating the intricacies of the underlying communication with the VechainThor network, developers can easily integrate this client into their applications. Whether fetching details about specific blocks, querying transaction information, or accessing other blockchain-related data, the thorest-client simplifies the process, enabling efficient and straightforward integration with the VechainThor network through RESTful API calls.

## Blocks

The Thorest-client facilitates easy interaction with blocks on the VechainThor network, as demonstrated in the following code snippet:

```typescript { name=blocks, category=example }
import {
    HttpClient,
    ThorestClient
} from '@vechainfoundation/vechain-sdk-network';

// Url of the solo network
const _testnetUrl = 'https://testnet.vechain.org/';

// Solo network instance
const testNetwork = new HttpClient(_testnetUrl);

// Thorest client solo instance
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

```

In this example, the code initializes a Thorest client for the VechainThor testnet network and showcases three essential methods for interacting with blocks:

 - getBlock(height: number): Promise<Block>

Retrieves details of a specific block based on its height. In the provided code, it fetches details for the block at height 1.

 - getBestBlock(): Promise<Block>

Fetches details of the latest block on the VechainThor network, representing the best-known block.

 - getFinalBlock(): Promise<Block>

Retrieves details of the finalized block, which is the latest block confirmed by the network consensus.

These methods demonstrate how the Thorest-client simplifies the process of fetching block-related information, providing developers with straightforward ways to integrate VechainThor blockchain data into their applications.
