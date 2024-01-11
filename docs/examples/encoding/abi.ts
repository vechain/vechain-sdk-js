import { abi } from '@vechain/vechain-sdk-core';
import { expect } from 'expect';

// 1 - Create a simple function to encode into ABI

const simpleAbiFunction = new abi.Function({
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

// 2 - Encode function

const encodedFunction = simpleAbiFunction.encodeInput([1, 'foo']);

// 3 - Check encoding

const expected =
    '0x27fcbb2f0000000000000000000000000000000000000000000000000000\
00000000000100000000000000000000000000000000000000000000000000\
00000000000040000000000000000000000000000000000000000000000000\
0000000000000003666f6f0000000000000000000000000000000000000000\
000000000000000000';
expect(encodedFunction).toBe(expected);
