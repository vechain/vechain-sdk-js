---
description: Thorest-client
---

# Thorest-client

The thorest-client serves as a RESTful API for seamless access to the VechainThor network. This client streamlines the interaction with the blockchain by providing a set of methods specifically tailored to retrieve information from various endpoints. By encapsulating the intricacies of the underlying communication with the VechainThor network, developers can easily integrate this client into their applications. Whether fetching details about specific blocks, querying transaction information, or accessing other blockchain-related data, the thorest-client simplifies the process, enabling efficient and straightforward integration with the VechainThor network through RESTful API calls.

## Accounts

The Thorest-client extends its functionality to provide seamless access to account-related information on the VechainThor network. The following code exemplifies how developers can utilize the Thorest-client to interact with accounts:

```typescript { name=accounts, category=example }
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

// Get account details
const accountDetails = await thorestTestnetClient.accounts.getAccount(
    '0x5034aa590125b64023a0262112b98d72e3c8e40e'
);
console.log(accountDetails);

// Get account code
const accountCode = await thorestTestnetClient.accounts.getBytecode(
    '0x5034aa590125b64023a0262112b98d72e3c8e40e'
);
console.log(accountCode);

// Get account storage
const accountStorage = await thorestTestnetClient.accounts.getStorageAt(
    '0x5034aa590125b64023a0262112b98d72e3c8e40e',
    '0x0000000000000000000000000000000000000000000000000000000000000001'
);
console.log(accountStorage);

```

In this example, the code initializes a Thorest client for the VechainThor testnet network and demonstrates three crucial methods for interacting with accounts:

 - getAccount(address: string): Promise<Account>

Retrieves details of a specific account based on its address. The provided code fetches details for the account with the address '0x5034aa590125b64023a0262112b98d72e3c8e40e'.

 - getBytecode(address: string): Promise<string>

Fetches the bytecode of the smart contract associated with the given account address.

 - getStorageAt(address: string, key: string): Promise<string>

Retrieves the value stored at a specific key in the storage of the smart contract associated with the given account address.

These methods showcase how the Thorest-client simplifies the process of obtaining account-related information, providing developers with efficient means to integrate VechainThor blockchain data into their applications.

## Blocks

The Thorest-client facilitates easy interaction with blocks on the VechainThor network, as demonstrated in the following code snippet:

```typescript { name=blocks, category=example }
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

```

In this example, the code initializes a Thorest client for the VechainThor testnet network and showcases three essential methods for interacting with blocks:

 - getBlock(height: number): Promise<Block>

Retrieves details of a specific block based on its height. In the provided code, it fetches details for the block at height 1.

 - getBestBlock(): Promise<Block>

Fetches details of the latest block on the VechainThor network, representing the best-known block.

 - getFinalBlock(): Promise<Block>

Retrieves details of the finalized block, which is the latest block confirmed by the network consensus.

These methods demonstrate how the Thorest-client simplifies the process of fetching block-related information, providing developers with straightforward ways to integrate VechainThor blockchain data into their applications.

## Logs

The Thorest-client extends its capabilities to efficiently filter and retrieve event logs and transfer logs on the VechainThor network. The following code exemplifies how developers can use the Thorest-client to filter event logs and transfer logs:

```typescript { name=logs, category=example }
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

// Filters event logs based on the provided criteria.
const eventLogs = await thorestTestnetClient.logs.filterEventLogs({
    range: {
        unit: 'block',
        from: 0,
        to: 100000
    },
    options: {
        offset: 0,
        limit: 10
    },
    criteriaSet: [
        {
            address: '0x0000000000000000000000000000456E65726779',
            topic0: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            topic1: '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
        }
    ],
    order: 'asc'
});
console.log(eventLogs);

// Filters transfer logs based on the provided criteria.
const transferLogs = await thorestTestnetClient.logs.filterTransferLogs({
    range: {
        unit: 'block',
        from: 0,
        to: 100000
    },
    options: {
        offset: 0,
        limit: 10
    },
    criteriaSet: [
        {
            txOrigin: '0xe59d475abe695c7f67a8a2321f33a856b0b4c71d',
            sender: '0xe59d475abe695c7f67a8a2321f33a856b0b4c71d',
            recipient: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'
        }
    ],
    order: 'asc'
});
console.log(transferLogs);

```

In this example, the code initializes a Thorest client for the VechainThor testnet network and demonstrates two essential methods for interacting with logs:

 - filterEventLogs(
        filterOptions: FilterEventLogsOptions
    ): Promise<EventLogs>

The `filterEventLogs` method simplifies the process of retrieving event logs from the VechainThor network. Developers can set criteria for the block range, apply pagination options, and define filters based on specific addresses and topics. The result is an array of event logs that match the specified criteria.

 - filterTransferLogs(
        filterOptions: FilterTransferLogsOptions
    ): Promise<TransferLogs>

The `filterTransferLogs` method provides a streamlined way to retrieve transfer logs from the VechainThor network. Developers can define criteria, including the block range, pagination options, and filters for transaction origin, sender, and recipient. The method returns an array of transfer logs that meet the specified criteria.
