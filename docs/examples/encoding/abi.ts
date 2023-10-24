import { abi } from '@vechain-sdk/core';
import { expect } from 'expect';

// Create a new function
const simpleAbiFunction = new abi.highLevel.Function({
    constant: false,
    inputs: [
        {
            name: 'a1',
            type: 'uint256'
        },
        {
            name: 'a2',
            type: 'string'
        }
    ],
    name: 'f1',
    outputs: [
        {
            name: 'r1',
            type: 'address'
        },
        {
            name: 'r2',
            type: 'bytes'
        }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
});

// Encode function
const data = simpleAbiFunction.encodeInput([1, 'foo']);
// Check encoding
const expected =
    '0x27fcbb2f0000000000000000000000000000000000000000000000000000\
00000000000100000000000000000000000000000000000000000000000000\
00000000000040000000000000000000000000000000000000000000000000\
0000000000000003666f6f0000000000000000000000000000000000000000\
000000000000000000';
expect(data).toBe(expected);
