# Contracts in vechain

This document provides a comprehensive guide on constructing contract transactions using the VeChain SDK, specifically focusing on deploying smart contracts and calling contract functions. The aim is to furnish developers with the knowledge to seamlessly integrate these transactions into their blockchain applications on vechain.

## Deploying a Smart Contract

### Overview

Deploying a smart contract is a foundational step in leveraging the VeChain blockchain for decentralized applications. This section delves into the process of creating a deployment clause, which is essential for initiating a smart contract on the network.

[ContractDeploySnippet](examples/contracts/contract-deploy.ts)

### Process Breakdown

1. **Clause Construction**: The deployment of a smart contract begins with the construction of a deployment clause. The VeChain SDK offers a dedicated function, `clauseBuilder.deployContract`, found within the `@vechain/sdk-core` package, for this purpose.

2. **Smart Contract Bytecode**: The bytecode of the smart contract, contained within the `contractBytecode` variable, encapsulates the compiled contract code that will be deployed to the blockchain.

3. **Invocation**: By invoking the `clauseBuilder.deployContract` function with the contract's bytecode, a clause object is generated. This clause object is a structured representation of the deployment request, ready to be broadcast to the VeChain network.

### Conclusion

The deployment example elucidates the utilization of the VeChain SDK to construct a deployment clause, a crucial component for deploying smart contracts on the VeChain blockchain.

## Calling a Contract Function

### Overview

After deploying a smart contract, interacting with its functions is the next step. This section guides you through the creation of a clause tailored for calling a specific function within a deployed smart contract.

[ContractFunctionCallSnippet](examples/contracts/contract-function-call.ts)

### Process Breakdown

1. **Understanding the ABI**: The ABI (Application Binary Interface) of the smart contract, usually defined in JSON format, describes the contract's functions and their respective parameters. This interface is pivotal for ensuring proper interaction with the contract's functions.

2. **Clause Creation for Function Calls**: Utilizing the `clauseBuilder.functionInteraction` function from the `@vechain/sdk-core` package, a clause is crafted for the specific purpose of invoking a function on the smart contract.

3. **Function Invocation**: In this example, the function `setValue` within the smart contract is invoked with a parameter of `123`. This action demonstrates how to interact with a function, altering the state within the smart contract based on the function's logic.

## Commenting Contract Invocations

### Overview

When using the SDK with wallets, adding comments to operations can be beneficial. These comments inform users who are signing transactions about the nature and purpose of the transactions they are authorizing.

Below is an example of how to add comments to operations:

[TransferCommentSnippet](examples/contracts/contract-transfer-ERC20-token.ts)

## Adding revision on read functions

### Overview

If you want to specify the revision on read functions, you can do it in the same way as adding a comment. Instead of a comment, specify the revision. You can use 'best' or 'finalized' as the revision options.

### Conclusion

This section highlights the methodology for constructing a clause that facilitates interaction with a deployed smart contract's functions on the VeChain network, thereby enabling developers to manipulate and query smart contract states efficiently.

This document, designed to be both informative and practical, equips developers with the necessary tools and knowledge to effectively interact with smart contracts on the VeChain blockchain, from deployment to function invocation.

## Delegating a Contract Call

### Overview

VeChain allows for the delegation of contract calls, enabling developers to execute contract functions in which the fees are payed by the delegator.

Here is an example of how to delegate a contract call:

[ERC20FunctionCallDelegatedSnippet](examples/contracts/contract-delegation-ERC20.ts)

## Multi-Clause Contract Interaction

### Multiple clauses read

VeChain supports the execution of multiple clauses in a single transaction, allowing developers to interact with multiple contracts or perform multiple operations within a single transaction.

Here is an example of how to interact with multiple read clauses in a single transaction:

[ERC20MultiClausesReadSnippet](examples/contracts/contract-create-ERC20-token.ts)


## Multi-Clause Event filtering

### Overview

VeChain allows developers to filter multiple events from diffent contracts in a single call, enabling efficient event monitoring and processing.

To do so, developers needs the contract address and the event signature.

Here is an example of how to filter multiple events from different contracts:

[ERC20FilterMultipleEventCriteriaSnippet](examples/contracts/contract-event-filter.ts)