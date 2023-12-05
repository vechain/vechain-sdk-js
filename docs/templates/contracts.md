# Contract Transactions

## Build a deploy contract transaction

### Overview

This example showcases the process of building a smart contract transaction using the Vechain SDK.

[example](examples/contracts/contract-deploy.ts)

### Code Explanation

-   The `buildDeployTransaction` function from `@vechainfoundation/vechain-sdk-core` is employed to construct a deploy contract transaction.

-   The smart contract bytecode is represented by the `contractBytecode` variable.

-   The `buildDeployTransaction` function is invoked with the contract bytecode, resulting in the creation of a transaction object.

### Conclusion

This example provides a practical demonstration of utilizing the Vechain SDK to build a transaction to deploy a smart contract.

## Build a Contract Function Call

### Overview

This example demonstrates the process of building a transaction to call a function on a deployed smart contract using the Vechain SDK.

[example](examples/contracts/contract-function-call.ts)

### Code Explanation

-   The example involves a smart contract with an ABI (Application Binary Interface) defined in JSON format. The ABI describes the functions and their parameters in the contract.

-   The `buildCallTransaction` function from `@vechainfoundation/vechain-sdk-core` is used to create a transaction for calling a specific function on the smart contract.

-   The function `setValue` is called with an argument of 123, representing the value to be set in the smart contract.

### Conclusion

This example illustrates the process of interacting with a deployed smart contract on Vechain by building a transaction to call a specific function. The use of the Vechain SDK streamlines the development process.


# VeChain Smart Contract Deployment Code

The following code demonstrates the deployment of a smart contract on the VeChain blockchain using the `@vechainfoundation/vechain-sdk-core` library. It includes the initialization of the contract bytecode and the construction of a deploy transaction.

[example](examples/contracts/contract-deploy.ts)

## Code Explanation

- The `buildDeployTransaction` function from `@vechainfoundation/vechain-sdk-core` is employed to construct a deploy contract transaction.

- The smart contract bytecode is represented by the `contractBytecode` variable.

- The `buildDeployTransaction` function is invoked with the contract bytecode, resulting in the creation of a transaction object.

## Conclusion

This example provides a practical demonstration of utilizing the VeChain SDK to build a transaction to deploy a smart contract.



# VeChain Smart Contract Call Transaction Code

The following code demonstrates the construction of a smart contract call transaction on the VeChain blockchain using the `@vechainfoundation/vechain-sdk-core` library. It includes the initialization of the contract ABI, the construction of a call transaction, and the validation of transaction parameters.

[example](examples/contracts/contract-function-call.ts)


## Code Explanation

- The `buildCallTransaction` function from `@vechainfoundation/vechain-sdk-core` is employed to construct a call transaction to interact with a deployed contract.

- The contract ABI is represented by the `contractABI` variable, specifying the structure and details of the smart contract's functions.

- The `buildCallTransaction` function is invoked with the deployed contract address, contract ABI, and function parameters, resulting in the creation of a transaction object.

## Conclusion

This example provides a practical demonstration of utilizing the VeChain SDK to build a call transaction for interacting with a deployed smart contract.

   
