# Create a sample ERC20 token

### Overview
The ERC20 token standard is widely used for creating and issuing smart contracts on Ethereum blockchain. Vechain, being compatible with Ethereum's EVM, allows for the implementation of ERC20 tokens on its platform. This provides the benefits of VeChain's features, such as improved scalability and lower transaction costs, while maintaining the familiar ERC20 interface.

### Example

The vechain SDK allows to create a sample ERC20 token with a few lines of code. The example below shows how to create a sample ERC20 token with the name "SampleToken" and symbol "ST" with a total supply of 1000000000000000000000000.

#### Compile the contract

The first step is to compile the contract using a solidity compiler. In this example we will compile an ERC20 token contract based on the OpenZeppelin ERC20 implementation. The contract is the following one:

The bytecode and the ABI have been obtained by compiling the following contract:

```solidity
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SampleToken is ERC20 {
    constructor() ERC20("SampleToken", "ST") {
        _mint(msg.sender, 1000000 * (10 ** uint256(decimals())));
    }
}
```

#### Deploy the contract

Once the contract is compiled, we can deploy it using the vechain SDK. The following code shows how to deploy the contract:


```typescript { name=contract-create-erc20-token, category=example }
const soloNetwork = new HttpClient(_soloUrl);
const thorSoloClient = new ThorClient(soloNetwork);

// Creating the contract factory
const contractFactory = thorSoloClient.contracts.createContractFactory(
    VIP180_ABI,
    erc20ContractBytecode,
    privateKeyDeployer
);

// Deploying the contract
await contractFactory.startDeployment();

// Awaiting the contract deployment
const contract = await contractFactory.waitForDeployment();

// Awaiting the transaction receipt to confirm successful contract deployment
const receipt = contract.deployTransactionReceipt;

// Asserting that the contract deployment didn't revert, indicating a successful deployment
expect(receipt.reverted).toEqual(false);

const balance = await contract.read.balanceOf(
    addressUtils.fromPrivateKey(Buffer.from(privateKeyDeployer, 'hex'))
);

// Asserting that the initial balance of the deployer is the expected amount (1e24)
expect(balance).toEqual([unitsUtils.parseUnits('1', 24)]);
```


#### Transfer tokens to another address

Once the contract is deployed, we can transfer tokens to another address using the vechain SDK. The following code shows how to transfer 10000 token smallest unit to another address:

```typescript { name=contract-transfer-erc20-token, category=example }
const transferResult = await contract.transact.transfer(
    '0x9e7911de289c3c856ce7f421034f66b6cde49c39',
    10000
);

// Wait for the transfer transaction to complete and obtain its receipt
const transactionReceiptTransfer =
    (await transferResult.wait()) as TransactionReceipt;

// Asserting that the transaction has not been reverted
expect(transactionReceiptTransfer.reverted).toEqual(false);
```


#### Filter the Transfer event

In blockchain and smart contract contexts, events are significant occurrences or state changes within a contract that are emitted (or logged) for external systems and interfaces to detect and act upon. These events provide a way to signal to external entities that something of note has occurred within the contract, without requiring constant monitoring of the contract's state. They are especially useful in decentralized applications (dApps) for triggering updates in the UI in response to contract state changes.

The Transfer event is a common event found in token contracts, especially those following standards like ERC-20 or ERC-721. It signifies the transfer of tokens from one address to another and typically includes information such as the sender's address, the recipient's address, and the amount transferred.

Filtering events allows applications to listen for specific occurrences within a contract rather than polling the contract's state continually. This is both efficient and effective for staying updated with relevant contract interactions.



For instance, once an ERC20 token contract is deployed, we can filter the Transfer events using the vechain SDK. The following code shows the filtering of a transfer event for a specific receiver address

```typescript { name=contract-event-filter, category=example }
// Starting from a deployed contract instance, transfer some tokens to a specific address
const transferResult = await contract.transact.transfer(
    '0x9e7911de289c3c856ce7f421034f66b6cde49c39',
    10000
);

// Wait for the transfer transaction to complete and obtain its receipt
const transactionReceiptTransfer =
    (await transferResult.wait()) as TransactionReceipt;

// Asserting that the transaction has not been reverted
expect(transactionReceiptTransfer.reverted).toEqual(false);

// Check transfer event logs by also passing the destination address
const transferEvents = await contract.filters
    .Transfer(undefined, '0x9e7911de289c3c856ce7f421034f66b6cde49c39')
    .get();

// Asserting that the transfer event has been emitted
expect(transferEvents.length).toEqual(1);

// log the transfer events
console.log(transferEvents);
```

We are transferring tokens from the deployer address to another address. We can filter the Transfer event to get the transfer details by passing the receiver address (to restrict the event logs to a specific receiver). The filter parameters depend on the event signature and the indexed parameters of the event. In this example, the Transfer event has two indexed parameters, `from` and `to`. We are filtering the event logs by passing the `to` address.
