---
description: Transaction and contract encoding
---

# Encoding

Vechain SDK extends its support to handle both Application Binary Interface (ABI) and Recursive Length Prefix (RLP) encoding.

## ABI

Vechain SDK provides functionality to interact with smart contracts on the VeChainThor blockchain using ABI's. An ABI is a standardised interface format that defines the method signatures, input parameters, and output types of smart contract functions. With VeChain SDK, developers can conveniently encode and decode data for interacting with smart contracts, making it easier to call contract functions and process their results.

```typescript { name=abi, category=example }
// 1 - Create a simple function to encode into ABI

const simpleAbiFunction = new ABIFunction({
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

const encodedFunction = simpleAbiFunction.encodeData([1, 'foo']).toString();
```

## Contract

The contract interface is used to provide a higher level of abstraction to allow direct interaction with a smart contract. To create a contract interface is necessary to have a compatible smart contract ABI.VeChain SDK provides a full implementation of the Contract interface as well as some methods to encode directly a specific fragment of the smart contract (until now only functions and events fragments are supported). Encoding and decoding are based on the ABI one.

```typescript { name=contract, category=example }
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
```

## RLP Encoding

RLP is a serialisation technique used on the VeChainThor blockchain. It is used to efficiently encode and decode data structures for storage and transmission on the blockchain.VeChain SDK includes dedicated methods for RLP encoding and decoding, enabling developers to handle data serialization and deserialization with ease.

By supporting ABI and RLP encoding handling, VeChainSDK equips developers with the necessary tools to interact with smart contracts and handle data efficiently on the VeChainThor blockchain. This further enhances the library's capabilities and contributes to the seamless development of decentralised applications on the platform.

```typescript { name=rlp, category=example }
// 1 - Define the profile for tx clause structure

const profile = {
    name: 'clause',
    kind: [
        { name: 'to', kind: new RLP_CODER.OptionalFixedHexBlobKind(20) },
        { name: 'value', kind: new RLP_CODER.NumericKind(32) },
        { name: 'data', kind: new RLP_CODER.HexBlobKind() }
    ]
};

// 2 - Create clauses

const clause = {
    to: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
    value: 10,
    data: '0x'
};

// 3 - RLP_CODER Instance to encode and decode

const rlp = new RLP_CODER.Profiler(profile);

// Encoding and Decoding
const data = rlp.encodeObject(clause);
const obj = rlp.decodeObject(data);
```

