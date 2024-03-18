# Contract Transactions

## Build a deploy contract clause

### Overview

This example showcases the process of building a clause to deploy a smart contract using the Vechain SDK.

[example](examples/contracts/contract-deploy.ts)

### Code Explanation

-   The `clauseBuilder.deployContract` function from `@vechain/sdk-core` is employed to construct a clause needed to perform a deploy contract transaction.

-   The smart contract bytecode is represented by the `contractBytecode` variable.

-   The `clauseBuilder.deployContract` function is invoked with the contract bytecode, resulting in the creation of a clause object.

### Conclusion

This example provides a practical demonstration of utilizing the vechain SDK to build a clause which can be used to deploy a smart contract.

## Build a Contract Function Call clause

### Overview

This example demonstrates the process of building a clause to call a function on a deployed smart contract using the vechain SDK.

[example](examples/contracts/contract-function-call.ts)

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


[DeployContractSnippet](examples/contracts/contract-create-ERC20-token.ts)


#### Transfer tokens to another address

Once the contract is deployed, we can transfer tokens to another address using the vechain SDK. The following code shows how to transfer 10000 token smallest unit to another address:

[ERC20FunctionCallSnippet](examples/contracts/contract-transfer-ERC20-token.ts)


#### Filter the Transfer event

In blockchain and smart contract contexts, events are significant occurrences or state changes within a contract that are emitted (or logged) for external systems and interfaces to detect and act upon. These events provide a way to signal to external entities that something of note has occurred within the contract, without requiring constant monitoring of the contract's state. They are especially useful in decentralized applications (dApps) for triggering updates in the UI in response to contract state changes.

The Transfer event is a common event found in token contracts, especially those following standards like ERC-20 or ERC-721. It signifies the transfer of tokens from one address to another and typically includes information such as the sender's address, the recipient's address, and the amount transferred.

Filtering events allows applications to listen for specific occurrences within a contract rather than polling the contract's state continually. This is both efficient and effective for staying updated with relevant contract interactions.



For instance, once an ERC20 token contract is deployed, we can filter the Transfer events using the vechain SDK. The following code shows the filtering of a transfer event for a specific receiver address

[ERC20FilterEventSnippet](examples/contracts/contract-event-filter.ts)

We are transferring tokens from the deployer address to another address. We can filter the Transfer event to get the transfer details by passing the receiver address (to restrict the event logs to a specific receiver). The filter parameters depend on the event signature and the indexed parameters of the event. In this example, the Transfer event has two indexed parameters, `from` and `to`. We are filtering the event logs by passing the `to` address.