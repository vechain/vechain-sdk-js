---
description: Thor-client
---

# Thor-client

The Thor-client serves as an interface to interact with the vechain Thor blockchain. This client streamlines the interaction with the blockchain by providing a set of methods specifically tailored to retrieve information from various endpoints. By encapsulating the intricacies of the underlying communication with the VechainThor network, developers can easily integrate this client into their applications. Whether fetching details about specific blocks, querying transaction information, or accessing other blockchain-related data, the thor-client simplifies the process, enabling efficient and straightforward integration with the VechainThor network through RESTful API calls.

## Accounts

The Thor-client extends its functionality to provide seamless access to account-related information on the VechainThor network. The following code exemplifies how developers can utilize the Thor-client to interact with accounts:

```typescript { name=accounts, category=example }
import { HttpClient, ThorClient } from '@vechain/vechain-sdk-network';
import { expect } from 'expect';

// 1 - Create thor client for testnet

const _testnetUrl = 'https://testnet.vechain.org';
const testNetwork = new HttpClient(_testnetUrl);
const thorClient = new ThorClient(testNetwork);

// 2 - Get account details

// Account details
const accountDetails = await thorClient.accounts.getAccount(
    '0x5034aa590125b64023a0262112b98d72e3c8e40e'
);
expect(accountDetails).toBeDefined();

// Account code
const accountCode = await thorClient.accounts.getBytecode(
    '0x5034aa590125b64023a0262112b98d72e3c8e40e'
);
expect(accountCode).toEqual('0x');

// Get account storage
const accountStorage = await thorClient.accounts.getStorageAt(
    '0x5034aa590125b64023a0262112b98d72e3c8e40e',
    '0x0000000000000000000000000000000000000000000000000000000000000001'
);
expect(accountStorage).toEqual(
    '0x0000000000000000000000000000000000000000000000000000000000000000'
);

```

In this example, the code initializes a Thor client for the VechainThor testnet network and demonstrates three crucial methods for interacting with accounts:

 - getAccount(address: string): Promise<Account>

Retrieves details of a specific account based on its address. The provided code fetches details for the account with the address '0x5034aa590125b64023a0262112b98d72e3c8e40e'.

 - getBytecode(address: string): Promise<string>

Fetches the bytecode of the smart contract associated with the given account address.

 - getStorageAt(address: string, key: string): Promise<string>

Retrieves the value stored at a specific key in the storage of the smart contract associated with the given account address.

These methods showcase how Thor-client simplifies the process of obtaining account-related information, providing developers with efficient means to integrate VechainThor blockchain data into their applications.

## Blocks

The Thor-client facilitates easy interaction with blocks on the VechainThor network, as demonstrated in the following code snippet:

```typescript { name=blocks, category=example }
import { HttpClient, ThorClient } from '@vechain/vechain-sdk-network';
import { expect } from 'expect';

// 1 - Create thor client for testnet

const _testnetUrl = 'https://testnet.vechain.org';
const testNetwork = new HttpClient(_testnetUrl);
const thorClient = new ThorClient(testNetwork);

// 2 - Get block details

// Details of block
const blockDetails = await thorClient.blocks.getBlock(1);
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

// 3 - Get best block details

const bestBlockDetails = await thorClient.blocks.getBestBlock();
expect(bestBlockDetails).toBeDefined();

// 4 - Get finalizes block details

const finalBlockDetails = await thorClient.blocks.getFinalBlock();
expect(finalBlockDetails).toBeDefined();

```

In this example, the code initializes a Thor client for the VechainThor testnet network and showcases three essential methods for interacting with blocks:

 - getBlock(height: number): Promise<Block>

Retrieves details of a specific block based on its height. In the provided code, it fetches details for the block at height 1.

 - getBestBlock(): Promise<Block>

Fetches details of the latest block on the VechainThor network, representing the best-known block.

 - getFinalBlock(): Promise<Block>

Retrieves details of the finalized block, which is the latest block confirmed by the network consensus.

These methods demonstrate how the Thor-client simplifies the process of fetching block-related information, providing developers with straightforward ways to integrate VechainThor blockchain data into their applications.

## Logs

The Thor-client extends its capabilities to efficiently filter and retrieve event logs and transfer logs on the VechainThor network. The following code exemplifies how developers can use the Thor-client to filter event logs and transfer logs:

```typescript { name=logs, category=example }
import { HttpClient, ThorClient } from '@vechain/vechain-sdk-network';
import { expect } from 'expect';

// 1 - Create thor client for testnet

const _testnetUrl = 'https://testnet.vechain.org';
const testNetwork = new HttpClient(_testnetUrl);
const thorClient = new ThorClient(testNetwork);

// 2 - Filter event logs based on the provided criteria. (EXAMPLE 1)

const eventLogs = await thorClient.logs.filterEventLogs({
    // Specify the range of blocks to search for events
    range: {
        unit: 'block',
        from: 0,
        to: 100000
    },
    // Additional options for the query, such as offset and limit
    options: {
        offset: 0,
        limit: 3
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
expect(eventLogs).toEqual([
    {
        address: '0x0000000000000000000000000000456e65726779',
        topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
            '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
        ],
        data: '0x00000000000000000000000000000000000000000000124bc0ddd92e55fff280',
        meta: {
            blockID:
                '0x000060716a6decc7127d221e8a53cd7b33992db6236490f79d47585f9ae7ca14',
            blockNumber: 24689,
            blockTimestamp: 1530261290,
            txID: '0x0ee8df3a9de6787ec0848ea8951ed8899bb053b6b4af167228dd7c0c012f5346',
            txOrigin: '0x5034aa590125b64023a0262112b98d72e3c8e40e',
            clauseIndex: 0
        }
    },
    {
        address: '0x0000000000000000000000000000456e65726779',
        topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
            '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
        ],
        data: '0x00000000000000000000000000000000000000000000124bc0ddd92e56000000',
        meta: {
            blockID:
                '0x00006135c993e6cd1ed99aac34679caac80759764ecb01431c9bea0199f3bf4c',
            blockNumber: 24885,
            blockTimestamp: 1530263250,
            txID: '0x86b3364c0faf2df6365b975cf1bd8046264b1eeaa2f266fe15b2df27d7954f65',
            txOrigin: '0x5034aa590125b64023a0262112b98d72e3c8e40e',
            clauseIndex: 0
        }
    },
    {
        address: '0x0000000000000000000000000000456e65726779',
        topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
            '0x000000000000000000000000f881a94423f22ee9a0e3e1442f515f43c966b7ed'
        ],
        data: '0x00000000000000000000000000000000000000000000021e19e0c9bab2400000',
        meta: {
            blockID:
                '0x000069fa97729ea3aaddd0756bb2bf2044fc16cb7d2b391b7982059deb43a86c',
            blockNumber: 27130,
            blockTimestamp: 1530285700,
            txID: '0x9edf26009aa903e2c5e7afbb39a547c9cf324a7f3eedafc33691ce2c9e5c9541',
            txOrigin: '0x5034aa590125b64023a0262112b98d72e3c8e40e',
            clauseIndex: 0
        }
    }
]);

// 3 - Filter again event logs based on the provided criteria. (EXAMPLE 2)

const transferLogs = await thorClient.logs.filterTransferLogs({
    // Specify the range of blocks to search for transfer events
    range: {
        unit: 'block',
        from: 0,
        to: 100000
    },
    // Additional options for the query, such as offset and limit
    options: {
        offset: 0,
        limit: 3
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

expect(transferLogs).toEqual([
    {
        sender: '0xe59d475abe695c7f67a8a2321f33a856b0b4c71d',
        recipient: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        amount: '0x152d02c7e14af6800000',
        meta: {
            blockID:
                '0x00003abbf8435573e0c50fed42647160eabbe140a87efbe0ffab8ef895b7686e',
            blockNumber: 15035,
            blockTimestamp: 1530164750,
            txID: '0x9daa5b584a98976dfca3d70348b44ba5332f966e187ba84510efb810a0f9f851',
            txOrigin: '0xe59d475abe695c7f67a8a2321f33a856b0b4c71d',
            clauseIndex: 0
        }
    }
]);

```

In this example, the code initializes a Thor client for the VechainThor testnet network and demonstrates two essential methods for interacting with logs:

 - filterEventLogs(
        filterOptions: FilterEventLogsOptions
    ): Promise<EventLogs>

The `filterEventLogs` method simplifies the process of retrieving event logs from the VechainThor network. Developers can set criteria for the block range, apply pagination options, and define filters based on specific addresses and topics. The result is an array of event logs that match the specified criteria.

 - filterTransferLogs(
        filterOptions: FilterTransferLogsOptions
    ): Promise<TransferLogs>

The `filterTransferLogs` method provides a streamlined way to retrieve transfer logs from the VechainThor network. Developers can define criteria, including the block range, pagination options, and filters for transaction origin, sender, and recipient. The method returns an array of transfer logs that meet the specified criteria.

## Nodes

The Thor-client allows developers to interact with nodes on the VechainThor network, providing information about connected peers. The following code demonstrates how to use the Thor-client to retrieve connected peers of a node:

```typescript { name=nodes, category=example }
import { HttpClient, ThorClient } from '@vechain/vechain-sdk-network';
import { expect } from 'expect';

// 1 - Create thor client for testnet

const _testnetUrl = 'https://testnet.vechain.org';
const testNetwork = new HttpClient(_testnetUrl);
const thorClient = new ThorClient(testNetwork);

// 2 - Retrieves connected peers of a node

const peerNodes = await thorClient.nodes.getNodes();

expect(peerNodes).toBeDefined();

```

In this example, the code initializes a Thor client for the VechainThor testnet network and utilizes the `getNodes` method to retrieve information about connected peers.

 - getNodes(): Promise<ConnectedPeer | null>

The `getNodes` method simplifies the process of obtaining details about connected peers of a node in the VechainThor network. The method returns information about the connected peers, allowing developers to monitor and analyze the network's node connectivity.

## Transactions

Thor-client provides methods for developers to interact with transactions on the VechainThor network, allowing retrieval of transaction details and transaction receipts. The following code illustrates how to use the Thor-client to fetch information about a specific transaction:

```typescript { name=transactions, category=example }
import {
    Transaction,
    TransactionHandler,
    dataUtils,
    unitsUtils,
    contract
} from '@vechain/vechain-sdk-core';
import { HttpClient, ThorClient } from '@vechain/vechain-sdk-network';
import { expect } from 'expect';

// Sender account with private key
const senderAccount = {
    privateKey:
        'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5',
    address: '0x2669514f9fe96bc7301177ba774d3da8a06cace4'
};

// 1 - Create thor client for solo network

const _soloUrl = 'http://localhost:8669';
const soloNetwork = new HttpClient(_soloUrl);
const thorSoloClient = new ThorClient(soloNetwork);

// 2 - Get latest block

const latestBlock = await thorSoloClient.blocks.getBestBlock();

// 3 - Create clauses

const clauses = [
    contract.clauseBuilder.transferVET(
        '0x9e7911de289c3c856ce7f421034f66b6cde49c39',
        unitsUtils.parseVET('10000')
    )
];

// Get gas estimate
const gasResult = await thorSoloClient.gas.estimateGas(
    clauses,
    senderAccount.address
);

// 4 - Create transaction

const transaction = new Transaction({
    chainTag: 0xf6,
    blockRef: latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
    expiration: 32,
    clauses,
    gasPriceCoef: 128,
    gas: gasResult.totalGas,
    dependsOn: null,
    nonce: 12345678
});

// 5 - Normal signature (NO delegation)

const rawNormalSigned = TransactionHandler.sign(
    transaction,
    Buffer.from(senderAccount.privateKey, 'hex')
).encoded;

// 6 - Send transaction

const send = await thorSoloClient.transactions.sendRawTransaction(
    `0x${rawNormalSigned.toString('hex')}`
);
expect(send).toBeDefined();
expect(send).toHaveProperty('id');
expect(dataUtils.isHexString(send.id)).toBe(true);

// 7 - Get transaction details and receipt

const transactionDetails = await thorSoloClient.transactions.getTransaction(
    send.id
);
const transactionReceipt =
    await thorSoloClient.transactions.getTransactionReceipt(send.id);

expect(transactionDetails).toBeDefined();
expect(transactionReceipt).toBeDefined();

```

In this example, the code initializes a Thor client for the VechainThor testnet network and showcases three essential methods for interacting with transactions:

 - sendTransaction(raw: string): Promise<TransactionSendResult>

The `sendTransaction` method enables developers to broadcast a raw transaction to the VechainThor network. This method is crucial for initiating new transactions and executing smart contract functions.

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

### Fee Delegation

Fee delegation is a feature on the VechainThor blockchain which enables the transaction sender to request another entity, a sponsor, to pay for the transaction fee on the sender's behalf. Fee delegation greatly improves the user experience, especially in the case of onboarding new users by removing the necessity of the user having to first acquire cryptocurrency assets before being able to interact on-chain.

The following code demonstrates how to use Thor-client with the fee delegation feature:

```typescript { name=delegated-transactions, category=example }
import {
    Transaction,
    TransactionHandler,
    dataUtils,
    unitsUtils,
    contract
} from '@vechain/vechain-sdk-core';
import { HttpClient, ThorClient } from '@vechain/vechain-sdk-network';
import { expect } from 'expect';

// Sender account with private key
const senderAccount = {
    privateKey:
        'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5',
    address: '0x2669514f9fe96bc7301177ba774d3da8a06cace4'
};

/** Delegate account with private key
 * @NOTE The delegate account must have enough VET and VTHO to pay for the gas
 */
const delegateAccount = {
    privateKey:
        '432f38bcf338c374523e83fdb2ebe1030aba63c7f1e81f7d76c5f53f4d42e766',
    address: '0x88b2551c3ed42ca663796c10ce68c88a65f73fe2'
};

// 1 - Create thor client for solo network

const _soloUrl = 'http://localhost:8669';
const soloNetwork = new HttpClient(_soloUrl);
const thorSoloClient = new ThorClient(soloNetwork);

// 2 - Get latest block

const latestBlock = await thorSoloClient.blocks.getBestBlock();

// 3 - Create transaction clauses

const clauses = [
    contract.clauseBuilder.transferVET(
        '0x9e7911de289c3c856ce7f421034f66b6cde49c39',
        unitsUtils.parseVET('10000')
    )
];

// Get gas estimate
const gasResult = await thorSoloClient.gas.estimateGas(
    clauses,
    senderAccount.address
);

//  4 - Create delegated transaction

const delegatedTransaction = new Transaction({
    chainTag: 0xf6,
    blockRef: latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
    expiration: 32,
    clauses,
    gasPriceCoef: 128,
    gas: gasResult.totalGas,
    dependsOn: null,
    nonce: 12345678,
    reserved: {
        features: 1
    }
});

// 5 - Normal signature and delegation signature

const rawDelegatedSigned = TransactionHandler.signWithDelegator(
    delegatedTransaction,
    Buffer.from(senderAccount.privateKey, 'hex'),
    Buffer.from(delegateAccount.privateKey, 'hex')
).encoded;

// 6 - Send transaction

const send = await thorSoloClient.transactions.sendRawTransaction(
    `0x${rawDelegatedSigned.toString('hex')}`
);
expect(send).toBeDefined();
expect(send).toHaveProperty('id');
expect(dataUtils.isHexString(send.id)).toBe(true);

// 7 - Get transaction details and receipt

// Details of transaction
const transactionDetails = await thorSoloClient.transactions.getTransaction(
    send.id
);

// Receipt of transaction
const transactionReceipt =
    await thorSoloClient.transactions.getTransactionReceipt(send.id);

expect(transactionDetails).toBeDefined();
expect(transactionReceipt).toBeDefined();

```

## Gas

The `GasModule` in Thor-client is designed to handle gas-related operations on the VechainThor blockchain. Gas is a crucial aspect of executing transactions on the blockchain, representing the computational and storage resources consumed during transaction processing. This module provides convenient methods for estimating the gas cost of a transaction, allowing developers to optimize their interactions with the VechainThor network.

### gasPadding
The `gasPadding` option is a percentage of gas to add on top of the estimated gas. The value must be between (0, 1].

```typescript { name=gas, category=example }
import {
    Transaction,
    TransactionHandler,
    networkInfo
} from '@vechain/vechain-sdk-core';
import { HttpClient, ThorClient } from '@vechain/vechain-sdk-network';
import { expect } from 'expect';

// 1 - Create thor client for solo network
const _soloUrl = 'http://localhost:8669';
const soloNetwork = new HttpClient(_soloUrl);
const thorSoloClient = new ThorClient(soloNetwork);

// 2- Init transaction

// 2.1 - Get latest block
const latestBlock = await thorSoloClient.blocks.getBestBlock();

// 2.2 - Transaction sender and receiver
const senderAccount = {
    address: '0x2669514f9fe96bc7301177ba774d3da8a06cace4',
    privateKey: Buffer.from(
        'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5',
        'hex'
    )
};

const receiverAccount = {
    address: '0x9e7911de289c3c856ce7f421034f66b6cde49c39',
    privateKey: Buffer.from(
        '1758771c54938e977518e4ff1c297aca882f6598891df503030734532efa790e',
        'hex'
    )
};

// 2 - Create transaction clauses and calcolate gas
const clauses = [
    {
        to: receiverAccount.address,
        value: 1000000,
        data: '0x'
    }
];

// Options to use gasPadding
const options = {
    gasPadding: 0.2 // 20%
};

// Estimate gas
const gasResult = await thorSoloClient.gas.estimateGas(
    clauses,
    senderAccount.address,
    options
);

// 4 - Create transaction

const transaction = new Transaction({
    chainTag: networkInfo.solo.chainTag,
    blockRef: latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
    expiration: 32,
    clauses,
    gasPriceCoef: 128,
    gas: gasResult.totalGas,
    dependsOn: null,
    nonce: 12345678
});

// 5 - Sign transaction
const rawNormalSigned = TransactionHandler.sign(
    transaction,
    senderAccount.privateKey
).encoded;

// 6 - Send transaction

const send = await thorSoloClient.transactions.sendRawTransaction(
    `0x${rawNormalSigned.toString('hex')}`
);

// 7 - Get transaction details and receipt

const transactionDetails = await thorSoloClient.transactions.getTransaction(
    send.id
);
const transactionReceipt =
    await thorSoloClient.transactions.getTransactionReceipt(send.id);

expect(transactionDetails).toBeDefined();
expect(transactionReceipt).toBeDefined();

```
