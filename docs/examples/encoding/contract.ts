import { coder } from '@vechain/sdk-core';
import { expect } from 'expect';

// 1 - Create a new function

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

// 2 - Encode the function input, ready to be used to send a tx
const encodedData = coder.encodeFunctionInput(contractABI, 'setValue', [123]);

// 3 - Decode the function input data
const decodedData = String(
    coder.decodeFunctionInput(contractABI, 'setValue', encodedData)[0]
); // decode the function input data

// Check the decoded data
expect(decodedData).toEqual('123');
