# Contract Transactions

## Build a deploy contract clause

### Overview

This example showcases the process of building a clause to deploy a smart contract using the Vechain SDK.

```typescript { name=contract-deploy, category=example }
import { clauseBuilder } from '@vechain/sdk-core';
import { expect } from 'expect';

// 1 - Init contract bytecode to deploy

const contractBytecode =
    '0x608060405234801561000f575f80fd5b506101438061001d5f395ff3fe608060405234801561000f575f80fd5b5060043610610034575f3560e01c806360fe47b1146100385780636d4ce63c14610054575b5f80fd5b610052600480360381019061004d91906100ba565b610072565b005b61005c61007b565b60405161006991906100f4565b60405180910390f35b805f8190555050565b5f8054905090565b5f80fd5b5f819050919050565b61009981610087565b81146100a3575f80fd5b50565b5f813590506100b481610090565b92915050565b5f602082840312156100cf576100ce610083565b5b5f6100dc848285016100a6565b91505092915050565b6100ee81610087565b82525050565b5f6020820190506101075f8301846100e5565b9291505056fea2646970667358221220427ff5682ef89b62b910bb1286c1028d32283512122854159ad59f1c71fb6d8764736f6c63430008160033';

// 2 - Create a clause to deploy the contract
const clause = clauseBuilder.deployContract(contractBytecode);

// The first clause of the transaction should be a deployed contract clause
expect(clause.data).toEqual(contractBytecode);

```

### Code Explanation

-   The `clauseBuilder.deployContract` function from `@vechain/sdk-core` is employed to construct a clause needed to perform a deploy contract transaction.

-   The smart contract bytecode is represented by the `contractBytecode` variable.

-   The `clauseBuilder.deployContract` function is invoked with the contract bytecode, resulting in the creation of a clause object.

### Conclusion

This example provides a practical demonstration of utilizing the vechain SDK to build a clause which can be used to deploy a smart contract.

## Build a Contract Function Call clause

### Overview

This example demonstrates the process of building a clause to call a function on a deployed smart contract using the vechain SDK.

```typescript { name=contract-function-call, category=example }
import {
    clauseBuilder,
    coder,
    type FunctionFragment
} from '@vechain/sdk-core';
import { expect } from 'expect';

// 1 - Init a simple contract ABI
const contractABI = JSON.stringify([
    {
        constant: false,
        inputs: [
            {
                name: 'value',
                type: 'uint256'
            }
        ],
        name: 'setValue',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'getValue',
        outputs: [
            {
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
]);

// 2 - Create a clause to call setValue(123)
const clause = clauseBuilder.functionInteraction(
    '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed', // just a sample deployed contract address
    coder
        .createInterface(contractABI)
        .getFunction('setValue') as FunctionFragment,
    [123]
);

// 3 - Check the parameters of the clause

expect(clause.to).toBe('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed');
expect(clause.value).toBe(0);
expect(clause.data).toBeDefined();

```

### Code Explanation

-   The example involves a smart contract with an ABI (Application Binary Interface) defined in JSON format. The ABI describes the functions and their parameters in the contract.

-   The `clauseBuilder.functionInteraction` function from `@vechain/sdk-core` is used to create a clause for calling a specific function on the smart contract.

-   The function `setValue` is called with an argument of 123, representing the value to be set in the smart contract.

### Conclusion

This example illustrates the process of creating a clause that is useful for interacting with a deployed smart contract on vechain.

   
## Create a sample ERC20 token

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


Once the contract is deployed, we can filter the Transfer event using the vechain SDK. The following code shows how to filter the Transfer event:

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
