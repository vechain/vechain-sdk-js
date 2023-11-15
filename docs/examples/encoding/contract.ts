import { contract } from '@vechainfoundation/vechain-sdk-core';
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

const encodedData = contract.encodeFunctionInput(contractABI, 'setValue', [
    123
]); // encode the function input, ready to be used to send a tx

const decodedData = String(
    contract.decodeFunctionInput(contractABI, 'setValue', encodedData)[0]
); // decode the function input data

expect(decodedData).toEqual('123');
