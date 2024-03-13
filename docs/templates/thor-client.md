---
description: Thor-client
---

# Thor-client

The Thor-client serves as an interface to interact with the vechain Thor blockchain. This client streamlines the interaction with the blockchain by providing a set of methods specifically tailored to retrieve information from various endpoints. By encapsulating the intricacies of the underlying communication with the VechainThor network, developers can easily integrate this client into their applications. Whether fetching details about specific blocks, querying transaction information, or accessing other blockchain-related data, the thor-client simplifies the process, enabling efficient and straightforward integration with the VechainThor network through RESTful API calls.

## Accounts

The Thor-client extends its functionality to provide seamless access to account-related information on the VechainThor network. The following code exemplifies how developers can utilize the Thor-client to interact with accounts:

[example](examples/thor-client/accounts.ts)

In this example, the code initializes a Thor client for the VechainThor testnet network and demonstrates three crucial methods for interacting with accounts:

 - `getAccount(address: string, options?: AccountInputOptions): Promise<AccountDetail>`

Retrieves details of a specific account based on its address. The provided code fetches details for the account with the address '0x5034aa590125b64023a0262112b98d72e3c8e40e'.

 - `getBytecode(address: string, options?: AccountInputOptions): Promise<string>`

Fetches the bytecode of the smart contract associated with the given account address.

 - `getStorageAt(address: string, position: string, options?: AccountInputOptions): Promise<string>`

Retrieves the value stored at a specific key in the storage of the smart contract associated with the given account address.

These methods showcase how Thor-client simplifies the process of obtaining account-related information, providing developers with efficient means to integrate VechainThor blockchain data into their applications.

## Blocks

The Thor-client facilitates easy interaction with blocks on the VechainThor network, as demonstrated in the following code snippet:

[example](examples/thor-client/blocks.ts)

In this example, the code initializes a Thor client for the VechainThor testnet network and showcases three essential methods for interacting with blocks:

 - `getBlockCompressed(revision: string | number): Promise<CompressedBlockDetail | null>`

Retrieves details of a specific block based on its height. In the provided code, it fetches details for the block at height 1.

 - `getBestBlockExpanded(): Promise<ExpandedBlockDetail | null>`

Fetches details of the latest block on the VechainThor network, representing the best-known block.

 - `getFinalBlockExpanded(): Promise<ExpandedBlockDetail | null>`

Retrieves details of the finalized block, which is the latest block confirmed by the network consensus.

These methods demonstrate how the Thor-client simplifies the process of fetching block-related information, providing developers with straightforward ways to integrate VechainThor blockchain data into their applications.

## Logs

The Thor-client extends its capabilities to efficiently filter and retrieve event logs and transfer logs on the VechainThor network. The following code exemplifies how developers can use the Thor-client to filter event logs and transfer logs:

[example](examples/thor-client/logs.ts)

In this example, the code initializes a Thor client for the VechainThor testnet network and demonstrates two essential methods for interacting with logs:

 - `filterEventLogs(
        filterOptions: FilterEventLogsOptions
    ): Promise<EventLogs[]>`

The `filterEventLogs` method simplifies the process of retrieving event logs from the VechainThor network. Developers can set criteria for the block range, apply pagination options, and define filters based on specific addresses and topics. The result is an array of event logs that match the specified criteria.

 - `filterTransferLogs(
        filterOptions: FilterTransferLogsOptions
    ): Promise<TransferLogs[]>`

The `filterTransferLogs` method provides a streamlined way to retrieve transfer logs from the VechainThor network. Developers can define criteria, including the block range, pagination options, and filters for transaction origin, sender, and recipient. The method returns an array of transfer logs that meet the specified criteria.

## Nodes

The Thor-client allows developers to interact with nodes on the VechainThor network, providing information about connected peers. The following code demonstrates how to use the Thor-client to retrieve connected peers of a node:

[example](examples/thor-client/nodes.ts)

In this example, the code initializes a Thor client for the VechainThor testnet network and utilizes the `getNodes` method to retrieve information about connected peers.

 - `getNodes(): Promise<ConnectedPeer | null>`

The `getNodes` method simplifies the process of obtaining details about connected peers of a node in the VechainThor network. The method returns information about the connected peers, allowing developers to monitor and analyze the network's node connectivity.

## Transactions

Thor-client provides methods for developers to interact with transactions on the VechainThor network, allowing retrieval of transaction details and transaction receipts. The following code illustrates how to use the Thor-client to fetch information about a specific transaction:

[example](examples/thor-client/transactions.ts)

In this example, the code initializes a Thor client for the VechainThor testnet network and showcases three essential methods for interacting with transactions:

 - `sendTransaction(signedTx: Transaction): Promise<SendTransactionResult>`

The `sendTransaction` method enables developers to broadcast a raw transaction to the VechainThor network. This method is crucial for initiating new transactions and executing smart contract functions.

 - `getTransaction(
        id: string,
        options?: GetTransactionInputOptions
    ): Promise<TransactionDetail | null>`

The `getTransaction` method facilitates the retrieval of detailed information about a specific transaction on the VechainThor network. Developers can use this method to access data such as the sender, recipient, amount, and other transaction details.

 - `getTransactionReceipt(
        id: string,
        options?: GetTransactionReceiptInputOptions
    ): Promise<TransactionReceipt | null>`

The `getTransactionReceipt` method allows developers to retrieve the receipt of a specific transaction on the VechainThor network. This includes information such as the transaction status, block number, and gas used.

### Fee Delegation

Fee delegation is a feature on the VechainThor blockchain which enables the transaction sender to request another entity, a sponsor, to pay for the transaction fee on the sender's behalf. Fee delegation greatly improves the user experience, especially in the case of onboarding new users by removing the necessity of the user having to first acquire cryptocurrency assets before being able to interact on-chain.

The following code demonstrates how to use Thor-client with the fee delegation feature:

[example](examples/thor-client/delegated-transactions.ts)

## Gas

The `GasModule` in Thor-client is designed to handle gas-related operations on the VechainThor blockchain. Gas is a crucial aspect of executing transactions on the blockchain, representing the computational and storage resources consumed during transaction processing. This module provides convenient methods for estimating the gas cost of a transaction, allowing developers to optimize their interactions with the VechainThor network.

### gasPadding

The `gasPadding` option adds a safety margin to estimated gas costs. It allows developers to specify a percentage increase in gas estimation to account for potential variations or complexities in transaction execution. This helps ensure transaction success by providing extra resources while managing costs effectively.

[example](examples/thor-client/gas.ts)