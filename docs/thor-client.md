---
description: Thor-client
---

# Thor-client

The Thor-client serves as an interface to interact with the VeChainThor blockchain. This client streamlines the interaction with the blockchain by providing a set of methods specifically tailored to retrieve information from various endpoints. By encapsulating the intricacies of the underlying communication with the VeChainThor network, developers can easily integrate this client into their applications. Whether fetching details about specific blocks, querying transaction information, or accessing other blockchain-related data, the thor-client simplifies the process, enabling efficient and straightforward integration with the VeChainThor network through RESTful API calls.

## Initialization

To initialize a Thor client, there are two straightforward methods. The first involves creating an HTTP client with the desired network URL, then passing it to ThorClient. Alternatively, the ThorClient can be directly initialized from the network URL. The choice between them depends on whether you prefer a two-step setup with explicit HTTP client configuration or a more concise, one-step initialization.

```typescript { name=initialize, category=example }
// First way to initialize thor client
const httpClient = new HttpClient(TESTNET_URL);
const thorClient = new ThorClient(httpClient);

// Second way to initialize thor client
const thorClient2 = ThorClient.fromUrl(TESTNET_URL);
```

## Accounts

The Thor-client extends its functionality to provide seamless access to account-related information on the VeChainThor network. The following code exemplifies how developers can utilize the Thor-client to interact with accounts:

```typescript { name=accounts, category=example }
// 1 - Create thor client for testnet

const thorClient = ThorClient.fromUrl(TESTNET_URL);

// 2 - Get account details

// Account details
const accountDetails = await thorClient.accounts.getAccount(
    '0x5034aa590125b64023a0262112b98d72e3c8e40e'
);

// Account code
const accountCode = await thorClient.accounts.getBytecode(
    '0x5034aa590125b64023a0262112b98d72e3c8e40e'
);

// Get account storage
const accountStorage = await thorClient.accounts.getStorageAt(
    '0x5034aa590125b64023a0262112b98d72e3c8e40e',
    '0x0000000000000000000000000000000000000000000000000000000000000001'
);
```

In this example, the code initializes a Thor client for the VeChainThor testnet network and demonstrates three crucial methods for interacting with accounts:

 - `getAccount(address: string, options?: AccountInputOptions): Promise<AccountDetail>`

Retrieves details of a specific account based on its address. The provided code fetches details for the account with the address '0x5034aa590125b64023a0262112b98d72e3c8e40e'.

 - `getBytecode(address: string, options?: AccountInputOptions): Promise<string>`

Fetches the bytecode of the smart contract associated with the given account address.

 - `getStorageAt(address: string, position: string, options?: AccountInputOptions): Promise<string>`

Retrieves the value stored at a specific key in the storage of the smart contract associated with the given account address.

These methods showcase how Thor-client simplifies the process of obtaining account-related information, providing developers with efficient means to integrate VeChainThor blockchain data into their applications.

## Blocks

The Thor-client facilitates easy interaction with blocks on the VeChainThor network, as demonstrated in the following code snippet:

```typescript { name=blocks, category=example }
// 1 - Create thor client for testnet

const thorClient = ThorClient.fromUrl(TESTNET_URL);

// 2 - Get block details

// Details of block
const blockDetails = await thorClient.blocks.getBlockCompressed(1);

// 3 - Get best block details

const bestBlockDetails = await thorClient.blocks.getBestBlockExpanded();
expect(bestBlockDetails).toBeDefined();

// 4 - Get finalizes block details

const finalBlockDetails = await thorClient.blocks.getFinalBlockExpanded();
```

In this example, the code initializes a Thor client for the VeChainThor testnet network and showcases three essential methods for interacting with blocks:

 - `getBlockCompressed(revision: string | number): Promise<CompressedBlockDetail | null>`

Retrieves details of a specific block based on its height. In the provided code, it fetches details for the block at height 1.

 - `getBestBlockExpanded(): Promise<ExpandedBlockDetail | null>`

Fetches details of the latest block on the VeChainThor network, representing the best-known block.

 - `getFinalBlockExpanded(): Promise<ExpandedBlockDetail | null>`

Retrieves details of the finalized block, which is the latest block confirmed by the network consensus.

These methods demonstrate how the Thor-client simplifies the process of fetching block-related information, providing developers with straightforward ways to integrate VeChainThor blockchain data into their applications.

## Logs

The Thor-client extends its capabilities to efficiently filter and retrieve event logs and transfer logs on the VeChainThor network. The following code exemplifies how developers can use the Thor-client to filter event logs and transfer logs:

```typescript { name=logs, category=example }
// 1 - Create thor client for testnet

const thorClient = ThorClient.fromUrl(TESTNET_URL);

// 2 - Filter event logs based on the provided criteria. (EXAMPLE 1)

const eventLogs = await thorClient.logs.filterRawEventLogs({
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
```

In this example, the code initializes a Thor client for the VeChainThor testnet network and demonstrates two essential methods for interacting with logs:

 - `filterGroupedEventLogs(
        filterOptions: FilterEventLogsOptions
    ): Promise<EventLogs[]>`

The `filterGroupedEventLogs` method simplifies the process of retrieving event logs from the VeChainThor network. Developers can set criteria for the block range, apply pagination options, and define filters based on specific addresses and topics. The result is an array of event logs that match the specified criteria.

 - `filterTransferLogs(
        filterOptions: FilterTransferLogsOptions
    ): Promise<TransferLogs[]>`

The `filterTransferLogs` method provides a streamlined way to retrieve transfer logs from the VeChainThor network. Developers can define criteria, including the block range, pagination options, and filters for transaction origin, sender, and recipient. The method returns an array of transfer logs that meet the specified criteria.

## Nodes

The Thor-client allows developers to interact with nodes on the VeChainThor network, providing information about connected peers. The following code demonstrates how to use the Thor-client to retrieve connected peers of a node:

```typescript { name=nodes, category=example }
// 1 - Create thor client for testnet

const thorClient = ThorClient.fromUrl(TESTNET_URL);

// 2 - Retrieves connected peers of a node

const peerNodes = await thorClient.nodes.getNodes();
```

In this example, the code initializes a Thor client for the VeChainThor testnet network and utilizes the `getNodes` method to retrieve information about connected peers.

 - `getNodes(): Promise<ConnectedPeer | null>`

The `getNodes` method simplifies the process of obtaining details about connected peers of a node in the VeChainThor network. The method returns information about the connected peers, allowing developers to monitor and analyze the network's node connectivity.

## Transactions

Thor-client provides methods for developers to interact with transactions on the VeChainThor network, allowing retrieval of transaction details and transaction receipts. The following code illustrates how to use the Thor-client to fetch information about a specific transaction:

```typescript { name=transactions, category=example }
// Sender account with private key
const senderAccount = {
    privateKey:
        'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5',
    address: '0x2669514f9fe96bc7301177ba774d3da8a06cace4'
};

// 1 - Create thor client for solo network

const thorSoloClient = ThorClient.fromUrl(THOR_SOLO_URL);

// 2 - Get latest block

const latestBlock = await thorSoloClient.blocks.getBestBlockCompressed();

// 3 - Create clauses

const clauses = [
    Clause.transferVET(
        Address.of('0x9e7911de289c3c856ce7f421034f66b6cde49c39'),
        VET.of(10000)
    )
];

// Get gas estimate
const gasResult = await thorSoloClient.gas.estimateGas(
    clauses,
    senderAccount.address
);

// 4 - Create transaction

const transactionBody = {
    chainTag: 0xf6,
    blockRef: latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
    expiration: 32,
    clauses,
    gasPriceCoef: 128,
    gas: gasResult.totalGas,
    dependsOn: null,
    nonce: 12345678
};

// 5 - Normal signature (NO delegation)

const rawNormalSigned = TransactionHandler.sign(
    transactionBody,
    HexUInt.of(senderAccount.privateKey).bytes
).encoded;

// 6 - Send transaction

const send = await thorSoloClient.transactions.sendRawTransaction(
    HexUInt.of(rawNormalSigned).toString()
);
expect(send).toBeDefined();
expect(send).toHaveProperty('id');
expect(Hex.isValid0x(send.id)).toBe(true);

// 7 - Get transaction details and receipt

const transactionDetails = await thorSoloClient.transactions.getTransaction(
    send.id
);
const transactionReceipt =
    await thorSoloClient.transactions.getTransactionReceipt(send.id);
```

In this example, the code initializes a Thor client for the VeChainThor testnet network and showcases three essential methods for interacting with transactions:

 - `sendTransaction(signedTx: Transaction): Promise<SendTransactionResult>`

The `sendTransaction` method enables developers to broadcast a raw transaction to the VeChainThor network. This method is crucial for initiating new transactions and executing smart contract functions.

 - `getTransaction(
        id: string,
        options?: GetTransactionInputOptions
    ): Promise<TransactionDetail | null>`

The `getTransaction` method facilitates the retrieval of detailed information about a specific transaction on the VeChainThor network. Developers can use this method to access data such as the sender, recipient, amount, and other transaction details.

 - `getTransactionReceipt(
        id: string,
        options?: GetTransactionReceiptInputOptions
    ): Promise<TransactionReceipt | null>`

The `getTransactionReceipt` method allows developers to retrieve the receipt of a specific transaction on the VeChainThor network. This includes information such as the transaction status, block number, and gas used.

### Fee Delegation

Fee delegation is a feature on the VeChainThor blockchain which enables the transaction sender to request another entity, a sponsor, to pay for the transaction fee on the sender's behalf. Fee delegation greatly improves the user experience, especially in the case of onboarding new users by removing the necessity of the user having to first acquire cryptocurrency assets before being able to interact on-chain.

The following code demonstrates how to use Thor-client with the fee delegation feature:

```typescript { name=delegated-transactions, category=example }
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

const thorSoloClient = ThorClient.fromUrl(THOR_SOLO_URL);

// 2 - Get latest block

const latestBlock = await thorSoloClient.blocks.getBestBlockCompressed();

// 3 - Create transaction clauses

const clauses = [
    Clause.transferVET(
        Address.of('0x9e7911de289c3c856ce7f421034f66b6cde49c39'),
        VET.of('10000')
    ) as TransactionClause
];

// Get gas estimate
const gasResult = await thorSoloClient.gas.estimateGas(
    clauses,
    senderAccount.address
);

//  4 - Create delegated transaction

const delegatedTransactionBody = {
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
};

// 5 - Normal signature and delegation signature

const rawDelegatedSigned = TransactionHandler.signWithDelegator(
    delegatedTransactionBody,
    HexUInt.of(senderAccount.privateKey).bytes,
    HexUInt.of(delegateAccount.privateKey).bytes
).encoded;

// 6 - Send transaction

const send = await thorSoloClient.transactions.sendRawTransaction(
    HexUInt.of(rawDelegatedSigned).toString()
);
expect(send).toBeDefined();
expect(send).toHaveProperty('id');
expect(Hex.isValid0x(send.id)).toBe(true);

// 7 - Get transaction details and receipt

// Details of transaction
const transactionDetails = await thorSoloClient.transactions.getTransaction(
    send.id
);

// Receipt of transaction
const transactionReceipt =
    await thorSoloClient.transactions.getTransactionReceipt(send.id);
```

## Gas

The `GasModule` in Thor-client is designed to handle gas-related operations on the VeChainThor blockchain. Gas is a crucial aspect of executing transactions on the blockchain, representing the computational and storage resources consumed during transaction processing. This module provides convenient methods for estimating the gas cost of a transaction, allowing developers to optimize their interactions with the VeChainThor network.

### gasPadding

The `gasPadding` option adds a safety margin to estimated gas costs. It allows developers to specify a percentage increase in gas estimation to account for potential variations or complexities in transaction execution. This helps ensure transaction success by providing extra resources while managing costs effectively.

```typescript { name=gas, category=example }
// 1 - Create thor client for solo network
const thorSoloClient = ThorClient.fromUrl(THOR_SOLO_URL);

// 2- Init transaction

// 2.1 - Get latest block
const latestBlock = await thorSoloClient.blocks.getBestBlockCompressed();

// 2.2 - Transaction sender and receiver
const senderAccount = {
    address: '0x2669514f9fe96bc7301177ba774d3da8a06cace4',
    privateKey: HexUInt.of(
        'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5'
    ).bytes
};

const receiverAccount = {
    address: '0x9e7911de289c3c856ce7f421034f66b6cde49c39',
    privateKey: HexUInt.of(
        '1758771c54938e977518e4ff1c297aca882f6598891df503030734532efa790e'
    ).bytes
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

const transactionBody = {
    chainTag: networkInfo.solo.chainTag,
    blockRef: latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
    expiration: 32,
    clauses,
    gasPriceCoef: 128,
    gas: gasResult.totalGas,
    dependsOn: null,
    nonce: 12345678
};

// 5 - Sign transaction
const rawNormalSigned = TransactionHandler.sign(
    transactionBody,
    senderAccount.privateKey
).encoded;

// 6 - Send transaction

const send = await thorSoloClient.transactions.sendRawTransaction(
    HexUInt.of(rawNormalSigned).toString()
);

// 7 - Get transaction details and receipt

const transactionDetails = await thorSoloClient.transactions.getTransaction(
    send.id
);
const transactionReceipt =
    await thorSoloClient.transactions.getTransactionReceipt(send.id);
```
