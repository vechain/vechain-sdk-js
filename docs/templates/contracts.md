# Contract Transactions

## Build a deploy contract clause

### Overview

This example showcases the process of building a clause to deploy a smart contract using the Vechain SDK.

[example](examples/contracts/contract-deploy.ts)

### Code Explanation

-   The `clauseBuilder.deployContract` function from `@vechainfoundation/vechain-sdk-core` is employed to construct a clause needed to perform a deploy contract transaction.

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

-   The `clauseBuilder.functionInteraction` function from `@vechainfoundation/vechain-sdk-core` is used to create a clause for calling a specific function on the smart contract.

-   The function `setValue` is called with an argument of 123, representing the value to be set in the smart contract.

### Conclusion

This example illustrates the process of creating a clause that is useful for interacting with a deployed smart contract on vechain.

   
## Create a sample ERC20 token

### Overview
The ERC20 token standard is widely used for creating and issuing smart contracts on Ethereum blockchain. VeChain, being compatible with Ethereum's EVM, allows for the implementation of ERC20 tokens on its platform. This provides the benefits of VeChain's features, such as improved scalability and lower transaction costs, while maintaining the familiar ERC20 interface.

### Example

The vechain SDK allows to create a sample ERC20 token with a few lines of code. The example below shows how to create a sample ERC20 token with the name "SampleToken" and symbol "ST" with a total supply of 1000000000000000000000000.

[example](examples/contracts/contract-create-ERC20-token.ts)
