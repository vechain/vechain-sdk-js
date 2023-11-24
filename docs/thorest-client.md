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
import { expect } from 'expect';

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
expect(accountDetails).toBeDefined();

// Get account code
const accountCode = await thorestTestnetClient.accounts.getBytecode(
    '0x5034aa590125b64023a0262112b98d72e3c8e40e'
);
expect(accountCode).toEqual('0x');

// Get account storage
const accountStorage = await thorestTestnetClient.accounts.getStorageAt(
    '0x5034aa590125b64023a0262112b98d72e3c8e40e',
    '0x0000000000000000000000000000000000000000000000000000000000000001'
);
expect(accountStorage).toEqual(
    '0x0000000000000000000000000000000000000000000000000000000000000000'
);

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
import { expect } from 'expect';

// Url of the testnet network
const _testnetUrl = 'https://testnet.vechain.org/';

// Testnet network instance
const testNetwork = new HttpClient(_testnetUrl);

// Thorest client testnet instance
const thorestTestnetClient = new ThorestClient(testNetwork);

// Get block details
const blockDetails = await thorestTestnetClient.blocks.getBlock(1);
expect(blockDetails).toEqual({
    number: 1,
    id: '0x000000019015bbd98fc1c9088d793ba9add53896a29cd9aa3a4dcabd1f561c38',
    size: 236,
    parentID:
        '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
    timestamp: 1530014410,
    gasLimit: 10000000,
    beneficiary: '0xb4094c25f86d628fdd571afc4077f0d0196afb48',
    gasUsed: 0,
    totalScore: 1,
    txsRoot:
        '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
    txsFeatures: 0,
    stateRoot:
        '0x4ec3af0acbad1ae467ad569337d2fe8576fe303928d35b8cdd91de47e9ac84bb',
    receiptsRoot:
        '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
    com: false,
    signer: '0x25ae0ef84da4a76d5a1dfe80d3789c2c46fee30a',
    isTrunk: true,
    isFinalized: true,
    transactions: []
});

// Get best block details
const bestBlockDetails = await thorestTestnetClient.blocks.getBestBlock();
expect(bestBlockDetails).toBeDefined();

// Get finalizes block details
const finalBlockDetails = await thorestTestnetClient.blocks.getFinalBlock();
expect(finalBlockDetails).toBeDefined();

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
import { expect } from 'expect';

// Url of the testnet network
const _testnetUrl = 'https://testnet.vechain.org/';

// Testnet network instance
const testNetwork = new HttpClient(_testnetUrl);

// Thorest client testnet instance
const thorestTestnetClient = new ThorestClient(testNetwork);

// Filters event logs based on the provided criteria.
const eventLogs = await thorestTestnetClient.logs.filterEventLogs({
    // Specify the range of blocks to search for events
    range: {
        unit: 'block',
        from: 0,
        to: 100000
    },
    // Additional options for the query, such as offset and limit
    options: {
        offset: 0,
        limit: 10
    },
    // Define criteria for filtering events
    criteriaSet: [
        {
            // Contract address to filter events
            address: '0x0000000000000000000000000000456E65726779',
            // Topics to further narrow down the search
            topic0: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            topic1: '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
        }
    ],
    // Specify the order in which logs should be retrieved (ascending in this case)
    order: 'asc'
});
expect(eventLogs).toBeDefined();

// Filters transfer logs based on the provided criteria.
const transferLogs = await thorestTestnetClient.logs.filterTransferLogs({
    // Specify the range of blocks to search for transfer events
    range: {
        unit: 'block',
        from: 0,
        to: 100000
    },
    // Additional options for the query, such as offset and limit
    options: {
        offset: 0,
        limit: 10
    },
    // Define criteria for filtering transfer events
    criteriaSet: [
        {
            // Transaction origin, sender, and recipient addresses to filter transfer events
            txOrigin: '0xe59d475abe695c7f67a8a2321f33a856b0b4c71d',
            sender: '0xe59d475abe695c7f67a8a2321f33a856b0b4c71d',
            recipient: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'
        }
    ],
    // Specify the order in which transfer logs should be retrieved (ascending in this case)
    order: 'asc'
});
expect(transferLogs).toBeDefined();

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

## Nodes

The Thorest-client allows developers to interact with nodes on the VechainThor network, providing information about connected peers. The following code demonstrates how to use the Thorest-client to retrieve connected peers of a node:

```typescript { name=nodes, category=example }
import {
    HttpClient,
    ThorestClient
} from '@vechainfoundation/vechain-sdk-network';
import { expect } from 'expect';

// Url of the testnet network
const _testnetUrl = 'https://testnet.vechain.org/';

// Testnet network instance
const testNetwork = new HttpClient(_testnetUrl);

// Thorest client testnet instance
const thorestTestnetClient = new ThorestClient(testNetwork);

// Retrieves connected peers of a node.
const peerNodes = await thorestTestnetClient.nodes.getNodes();
expect(peerNodes).toBeDefined();

```

In this example, the code initializes a Thorest client for the VechainThor testnet network and utilizes the `getNodes` method to retrieve information about connected peers.

 - getNodes(): Promise<ConnectedPeer | null>

The `getNodes` method simplifies the process of obtaining details about connected peers of a node in the VechainThor network. The method returns information about the connected peers, allowing developers to monitor and analyze the network's node connectivity.

## Transactions

The Thorest-client provides methods for developers to interact with transactions on the VechainThor network, allowing retrieval of transaction details and transaction receipts. The following code illustrates how to use the Thorest-client to fetch information about a specific transaction:

```typescript { name=transactions, category=example }
import {
    HttpClient,
    ThorestClient
} from '@vechainfoundation/vechain-sdk-network';
import { expect } from 'expect';

// Url of the testnet network
const _testnetUrl = 'https://testnet.vechain.org/';

// Testnet network instance
const testNetwork = new HttpClient(_testnetUrl);

// Thorest client testnet instance
const thorestTestnetClient = new ThorestClient(testNetwork);

// Retrieves the details of a transaction.
const transactionDetails =
    await thorestTestnetClient.transactions.getTransaction(
        '0x46d195f69e1ac3922d42c207e4705a3d1642883d97e58f7efc72f179ea326adb'
    );
expect(transactionDetails).toEqual({
    id: '0x46d195f69e1ac3922d42c207e4705a3d1642883d97e58f7efc72f179ea326adb',
    chainTag: 39,
    blockRef: '0x010284a0b704e751',
    expiration: 2000,
    clauses: [
        {
            to: '0x5d57f07dfeb8c224121433d5b1b401c82bd88f3d',
            value: '0x2ea11e32ad50000',
            data: '0x'
        }
    ],
    gasPriceCoef: 0,
    gas: 41192,
    origin: '0x2d4ed6b8abd00bc2ef0bdb2258a946c214d9d0af',
    delegator: null,
    nonce: '0x76eed751cef0e52d',
    dependsOn: null,
    size: 130,
    meta: {
        blockID:
            '0x010284a1fea0635a2e47dd21f8a1761406df1013e5f4af79e311d8a27373980d',
        blockNumber: 16942241,
        blockTimestamp: 1699453780
    }
});

// Retrieves the receipt of a transaction.
const transactionReceipt =
    await thorestTestnetClient.transactions.getTransactionReceipt(
        '0x46d195f69e1ac3922d42c207e4705a3d1642883d97e58f7efc72f179ea326adb'
    );
expect(transactionReceipt).toEqual({
    gasUsed: 21000,
    gasPayer: '0x2d4ed6b8abd00bc2ef0bdb2258a946c214d9d0af',
    paid: '0x2ea11e32ad50000',
    reward: '0xdfd22a8cd98000',
    reverted: false,
    meta: {
        blockID:
            '0x010284a1fea0635a2e47dd21f8a1761406df1013e5f4af79e311d8a27373980d',
        blockNumber: 16942241,
        blockTimestamp: 1699453780,
        txID: '0x46d195f69e1ac3922d42c207e4705a3d1642883d97e58f7efc72f179ea326adb',
        txOrigin: '0x2d4ed6b8abd00bc2ef0bdb2258a946c214d9d0af'
    },
    outputs: [
        {
            contractAddress: null,
            events: [],
            transfers: [
                {
                    sender: '0x2d4ed6b8abd00bc2ef0bdb2258a946c214d9d0af',
                    recipient: '0x5d57f07dfeb8c224121433d5b1b401c82bd88f3d',
                    amount: '0x2ea11e32ad50000'
                }
            ]
        }
    ]
});

```

In this example, the code initializes a Thorest client for the VechainThor testnet network and showcases two essential methods for interacting with transactions:

 - getTransaction(
        id: string,
        options?: GetTransactionInputOptions
    ): Promise<TransactionDetail | null>

The `getTransaction` method facilitates the retrieval of detailed information about a specific transaction on the VechainThor network. Developers can use this method to access data such as the sender, recipient, amount, and other transaction details.

 - getTransactionReceipt(
        id: string,
        options?: GetTransactionReceiptInputOptions
    ): Promise<TransactionReceipt | null> 

The `getTransactionReceipt` method allows developers to retrieve the receipt of a specific transaction on the VechainThor network. This includes information such as the transaction status, block number, and gas used.
