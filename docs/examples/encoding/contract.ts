import { ABIContract } from '@vechain/sdk-core';
import { expect } from 'expect';

// START_SNIPPET: ContractSnippet

// 1 - Create a new function

const contractABI = [
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
] as const;

// 2 - Encode the function input, ready to be used to send a tx
const encodedData = ABIContract.ofAbi(contractABI).encodeFunctionInput(
    'setValue',
    [123]
);

// 3 - Decode the function input data
const decodedData = String(
    ABIContract.ofAbi(contractABI).decodeFunctionInput('setValue', encodedData)
        .args[0]
); // decode the function input data

// END_SNIPPET: ContractSnippet

// Check the decoded data
expect(decodedData).toEqual('123');
