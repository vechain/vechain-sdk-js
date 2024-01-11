import { contract } from '@vechain/vechain-sdk-core';
import { expect } from 'expect';

// 1 - Init contract bytecode to deploy

const contractBytecode =
    '0x608060405234801561000f575f80fd5b506101438061001d5f395ff3fe608060405234801561000f575f80fd5b5060043610610034575f3560e01c806360fe47b1146100385780636d4ce63c14610054575b5f80fd5b610052600480360381019061004d91906100ba565b610072565b005b61005c61007b565b60405161006991906100f4565b60405180910390f35b805f8190555050565b5f8054905090565b5f80fd5b5f819050919050565b61009981610087565b81146100a3575f80fd5b50565b5f813590506100b481610090565b92915050565b5f602082840312156100cf576100ce610083565b5b5f6100dc848285016100a6565b91505092915050565b6100ee81610087565b82525050565b5f6020820190506101075f8301846100e5565b9291505056fea2646970667358221220427ff5682ef89b62b910bb1286c1028d32283512122854159ad59f1c71fb6d8764736f6c63430008160033';

// 2 - Create a clause to deploy the contract
const clause = contract.clauseBuilder.deployContract(contractBytecode);

// The first clause of the transaction should be a deploy contract clause
expect(clause.data).toEqual(contractBytecode);
