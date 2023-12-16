# Contract Transactions

## Build a deploy contract clause

### Overview

This example showcases the process of building a clause to deploy a smart contract using the Vechain SDK.

```typescript { name=contract-deploy, category=example }
import { contract } from '@vechainfoundation/vechain-sdk-core';
import { expect } from 'expect';

// 1 - Init contract bytecode to deploy

const contractBytecode =
    '0x608060405234801561000f575f80fd5b506101438061001d5f395ff3fe608060405234801561000f575f80fd5b5060043610610034575f3560e01c806360fe47b1146100385780636d4ce63c14610054575b5f80fd5b610052600480360381019061004d91906100ba565b610072565b005b61005c61007b565b60405161006991906100f4565b60405180910390f35b805f8190555050565b5f8054905090565b5f80fd5b5f819050919050565b61009981610087565b81146100a3575f80fd5b50565b5f813590506100b481610090565b92915050565b5f602082840312156100cf576100ce610083565b5b5f6100dc848285016100a6565b91505092915050565b6100ee81610087565b82525050565b5f6020820190506101075f8301846100e5565b9291505056fea2646970667358221220427ff5682ef89b62b910bb1286c1028d32283512122854159ad59f1c71fb6d8764736f6c63430008160033';

// 2 - Create a clause to deploy the contract
const clause = contract.clauseBuilder.deployContract(contractBytecode);

// The first clause of the transaction should be a deploy contract clause
expect(clause.data).toEqual(contractBytecode);

```

### Code Explanation

-   The `clauseBuilder.deployContract` function from `@vechainfoundation/vechain-sdk-core` is employed to construct a clause needed to perform a deploy contract transaction.

-   The smart contract bytecode is represented by the `contractBytecode` variable.

-   The `clauseBuilder.deployContract` function is invoked with the contract bytecode, resulting in the creation of a clause object.

### Conclusion

This example provides a practical demonstration of utilizing the Vechain SDK to build a clause which can be used to deploy a smart contract.

## Build a Contract Function Call clause

### Overview

This example demonstrates the process of building a clause to call a function on a deployed smart contract using the Vechain SDK.

```typescript { name=contract-function-call, category=example }
import { networkInfo, contract } from '@vechainfoundation/vechain-sdk-core';
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
const clause = contract.clauseBuilder.functionInteraction(
    '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed', // just a sample deployed contract address
    contractABI,
    'setValue',
    [123]
);

// 3 - Check the parameters of the clause

expect(clause.to).toBe('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed');
expect(clause.value).toBe(0);
expect(clause.data).toBeDefined();

```

### Code Explanation

-   The example involves a smart contract with an ABI (Application Binary Interface) defined in JSON format. The ABI describes the functions and their parameters in the contract.

-   The `clauseBuilder.functionInteraction` function from `@vechainfoundation/vechain-sdk-core` is used to create a clause for calling a specific function on the smart contract.

-   The function `setValue` is called with an argument of 123, representing the value to be set in the smart contract.

### Conclusion

This example illustrates the process of creating a clause that is useful for interacting with a deployed smart contract on Vechain.

   

