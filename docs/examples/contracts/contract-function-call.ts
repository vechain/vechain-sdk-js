import { buildCallContractTransaction } from '@vechain-sdk/core';
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

const transaction = buildCallContractTransaction(
    '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
    contractABI,
    'setValue',
    [123]
);

expect(transaction).toBeDefined();
