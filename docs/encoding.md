---
description: Transaction and contract encoding
---

# Encoding

VeChain SDK extends its support to handle both Application Binary Interface (ABI) and Recursive Length Prefix (RLP) encoding.

## ABI

VeChain SDK provides functionality to interact with smart contracts on the VechainThor blockchain using ABI's. An ABI is a standardised interface format that defines the method signatures, input parameters, and output types of smart contract functions. With VeChain SDK, developers can conveniently encode and decode data for interacting with smart contracts, making it easier to call contract functions and process their results.

```typescript { name=abi, category=example }
import { abi } from '@vechain-sdk/core';
import { expect } from 'expect';

// Create a new function
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

```

## RLP Encoding

RLP is a serialisation technique used on the VechainThor blockchain.  It is used to efficiently encode and decode data structures for storage and transmission on the blockchain. VeChain SDK includes dedicated methods for RLP encoding and decoding, enabling developers to handle data serialization and deserialization with ease.

By supporting ABI and RLP encoding handling, VeChain SDK equips developers with the necessary tools to interact with smart contracts and handle data efficiently on the VechainThor blockchain. This further enhances the library's capabilities and contributes to the seamless development of decentralised applications on the platform.

```typescript { name=rlp, category=example }
import { RLP } from '@vechain-sdk/core';
import { expect } from 'expect';

// Define the profile for tx clause structure
const profile = {
    name: 'clause',
    kind: [
        { name: 'to', kind: new RLP.OptionalFixedHexBlobKind(20) },
        { name: 'value', kind: new RLP.NumericKind(32) },
        { name: 'data', kind: new RLP.HexBlobKind() }
    ]
};

// Create clauses
const clause = {
    to: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
    value: 10,
    data: '0x'
};

// Instace RLP
const rlp = new RLP.Profiler(profile);

// Encoding and Decoding
const data = rlp.encodeObject(clause);
expect(data.toString('hex')).toBe(
    'd7947567d83b7b8d80addcb281a71d54fc7b3364ffed0a80'
);

const obj = rlp.decodeObject(data);
expect(JSON.stringify(obj)).toBe(JSON.stringify(clause));

```
