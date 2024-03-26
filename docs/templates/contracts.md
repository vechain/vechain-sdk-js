# Contracts in Vechain

This document provides a comprehensive guide on constructing contract transactions using the Vechain SDK, specifically focusing on deploying smart contracts and calling contract functions. The aim is to furnish developers with the knowledge to seamlessly integrate these transactions into their blockchain applications on Vechain.

## Deploying a Smart Contract

### Overview

Deploying a smart contract is a foundational step in leveraging the Vechain blockchain for decentralized applications. This section delves into the process of creating a deployment clause, which is essential for initiating a smart contract on the network.

[example](examples/contracts/contract-deploy.ts)

### Process Breakdown

1. **Clause Construction**: The deployment of a smart contract begins with the construction of a deployment clause. The Vechain SDK offers a dedicated function, `clauseBuilder.deployContract`, found within the `@vechain/sdk-core` package, for this purpose.

2. **Smart Contract Bytecode**: The bytecode of the smart contract, contained within the `contractBytecode` variable, encapsulates the compiled contract code that will be deployed to the blockchain.

3. **Invocation**: By invoking the `clauseBuilder.deployContract` function with the contract's bytecode, a clause object is generated. This clause object is a structured representation of the deployment request, ready to be broadcast to the Vechain network.

### Conclusion

The deployment example elucidates the utilization of the Vechain SDK to construct a deployment clause, a crucial component for deploying smart contracts on the Vechain blockchain.

## Calling a Contract Function

### Overview

After deploying a smart contract, interacting with its functions is the next step. This section guides you through the creation of a clause tailored for calling a specific function within a deployed smart contract.

[example](examples/contracts/contract-function-call.ts)

### Process Breakdownx

1. **Understanding the ABI**: The ABI (Application Binary Interface) of the smart contract, usually defined in JSON format, describes the contract's functions and their respective parameters. This interface is pivotal for ensuring proper interaction with the contract's functions.

2. **Clause Creation for Function Calls**: Utilizing the `clauseBuilder.functionInteraction` function from the `@vechain/sdk-core` package, a clause is crafted for the specific purpose of invoking a function on the smart contract.

3. **Function Invocation**: In this example, the function `setValue` within the smart contract is invoked with a parameter of `123`. This action demonstrates how to interact with a function, altering the state within the smart contract based on the function's logic.

### Conclusion

This section highlights the methodology for constructing a clause that facilitates interaction with a deployed smart contract's functions on the Vechain network, thereby enabling developers to manipulate and query smart contract states efficiently.

This document, designed to be both informative and practical, equips developers with the necessary tools and knowledge to effectively interact with smart contracts on the Vechain blockchain, from deployment to function invocation.
