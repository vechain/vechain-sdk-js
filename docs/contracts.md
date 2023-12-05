# Contract Transactions

## Build a deploy contract transaction

### Overview

This example showcases the process of building a smart contract transaction using the Vechain SDK.

```typescript { name=contract-deploy, category=example }
import { contract } from '@vechainfoundation/vechain-sdk-core';
import { expect } from 'expect';

const contractBytecode =
    '0x608060405234801561000f575f80fd5b506101438061001d5f395ff3fe608060405234801561000f575f80fd5b5060043610610034575f3560e01c806360fe47b1146100385780636d4ce63c14610054575b5f80fd5b610052600480360381019061004d91906100ba565b610072565b005b61005c61007b565b60405161006991906100f4565b60405180910390f35b805f8190555050565b5f8054905090565b5f80fd5b5f819050919050565b61009981610087565b81146100a3575f80fd5b50565b5f813590506100b481610090565b92915050565b5f602082840312156100cf576100ce610083565b5b5f6100dc848285016100a6565b91505092915050565b6100ee81610087565b82525050565b5f6020820190506101075f8301846100e5565b9291505056fea2646970667358221220427ff5682ef89b62b910bb1286c1028d32283512122854159ad59f1c71fb6d8764736f6c63430008160033';

const transaction = contract.builder.buildDeployTransaction(contractBytecode);
expect(transaction.body.clauses[0].data).toEqual(contractBytecode);

```

### Code Explanation

-   The `buildDeployTransaction` function from `@vechainfoundation/vechain-sdk-core` is employed to construct a deploy contract transaction.

-   The smart contract bytecode is represented by the `contractBytecode` variable.

-   The `buildDeployTransaction` function is invoked with the contract bytecode, resulting in the creation of a transaction object.

### Conclusion

This example provides a practical demonstration of utilizing the Vechain SDK to build a transaction to deploy a smart contract.

## Build a Contract Function Call

### Overview

This example demonstrates the process of building a transaction to call a function on a deployed smart contract using the Vechain SDK.

```typescript { name=contract-function-call, category=example }
import { networkInfo, contract } from '@vechainfoundation/vechain-sdk-core';
import { expect } from 'expect';

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

const transaction = contract.builder.buildCallTransaction(
    '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed', // just a sample deployed contract address
    contractABI,
    'setValue',
    [123]
);

// check the parameters of the transaction
expect(transaction.body.clauses[0].to).toBe(
    '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'
);
expect(transaction.body.clauses[0].value).toBe(0);
expect(transaction.body.clauses[0].data).toBeDefined();
expect(transaction.body.nonce).toBeDefined();
expect(transaction.body.chainTag).toBe(networkInfo.mainnet.chainTag);
expect(transaction.body.blockRef).toBeDefined();
expect(transaction.body.expiration).toBeDefined();
expect(transaction.body.gasPriceCoef).toBeDefined();
expect(transaction.body.gas).toBeDefined();
expect(transaction.body.dependsOn).toBeNull();
expect(transaction.body.gas).toBeGreaterThan(0);
expect(transaction.body.gasPriceCoef).toBeDefined();

```

### Code Explanation

-   The example involves a smart contract with an ABI (Application Binary Interface) defined in JSON format. The ABI describes the functions and their parameters in the contract.

-   The `buildCallTransaction` function from `@vechainfoundation/vechain-sdk-core` is used to create a transaction for calling a specific function on the smart contract.

-   The function `setValue` is called with an argument of 123, representing the value to be set in the smart contract.

### Conclusion

This example illustrates the process of interacting with a deployed smart contract on Vechain by building a transaction to call a specific function. The use of the Vechain SDK streamlines the development process.


# VeChain Smart Contract Deployment Code

The following code demonstrates the deployment of a smart contract on the VeChain blockchain using the `@vechainfoundation/vechain-sdk-core` library. It includes the initialization of the contract bytecode and the construction of a deploy transaction.

```typescript { name=contract-deploy, category=example }
import { contract } from '@vechainfoundation/vechain-sdk-core';
import { expect } from 'expect';

const contractBytecode =
    '0x608060405234801561000f575f80fd5b506101438061001d5f395ff3fe608060405234801561000f575f80fd5b5060043610610034575f3560e01c806360fe47b1146100385780636d4ce63c14610054575b5f80fd5b610052600480360381019061004d91906100ba565b610072565b005b61005c61007b565b60405161006991906100f4565b60405180910390f35b805f8190555050565b5f8054905090565b5f80fd5b5f819050919050565b61009981610087565b81146100a3575f80fd5b50565b5f813590506100b481610090565b92915050565b5f602082840312156100cf576100ce610083565b5b5f6100dc848285016100a6565b91505092915050565b6100ee81610087565b82525050565b5f6020820190506101075f8301846100e5565b9291505056fea2646970667358221220427ff5682ef89b62b910bb1286c1028d32283512122854159ad59f1c71fb6d8764736f6c63430008160033';

const transaction = contract.builder.buildDeployTransaction(contractBytecode);
expect(transaction.body.clauses[0].data).toEqual(contractBytecode);

```

## Code Explanation

- The `buildDeployTransaction` function from `@vechainfoundation/vechain-sdk-core` is employed to construct a deploy contract transaction.

- The smart contract bytecode is represented by the `contractBytecode` variable.

- The `buildDeployTransaction` function is invoked with the contract bytecode, resulting in the creation of a transaction object.

## Conclusion

This example provides a practical demonstration of utilizing the VeChain SDK to build a transaction to deploy a smart contract.



# VeChain Smart Contract Call Transaction Code

The following code demonstrates the construction of a smart contract call transaction on the VeChain blockchain using the `@vechainfoundation/vechain-sdk-core` library. It includes the initialization of the contract ABI, the construction of a call transaction, and the validation of transaction parameters.

```typescript { name=contract-function-call, category=example }
import { networkInfo, contract } from '@vechainfoundation/vechain-sdk-core';
import { expect } from 'expect';

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

const transaction = contract.builder.buildCallTransaction(
    '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed', // just a sample deployed contract address
    contractABI,
    'setValue',
    [123]
);

// check the parameters of the transaction
expect(transaction.body.clauses[0].to).toBe(
    '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'
);
expect(transaction.body.clauses[0].value).toBe(0);
expect(transaction.body.clauses[0].data).toBeDefined();
expect(transaction.body.nonce).toBeDefined();
expect(transaction.body.chainTag).toBe(networkInfo.mainnet.chainTag);
expect(transaction.body.blockRef).toBeDefined();
expect(transaction.body.expiration).toBeDefined();
expect(transaction.body.gasPriceCoef).toBeDefined();
expect(transaction.body.gas).toBeDefined();
expect(transaction.body.dependsOn).toBeNull();
expect(transaction.body.gas).toBeGreaterThan(0);
expect(transaction.body.gasPriceCoef).toBeDefined();

```


## Code Explanation

- The `buildCallTransaction` function from `@vechainfoundation/vechain-sdk-core` is employed to construct a call transaction to interact with a deployed contract.

- The contract ABI is represented by the `contractABI` variable, specifying the structure and details of the smart contract's functions.

- The `buildCallTransaction` function is invoked with the deployed contract address, contract ABI, and function parameters, resulting in the creation of a transaction object.

## Conclusion

This example provides a practical demonstration of utilizing the VeChain SDK to build a call transaction for interacting with a deployed smart contract.

   

