---
description: Transaction and contract encoding
---

# Encoding

VeChain SDK extends its support to handle both Application Binary Interface (ABI) and Recursive Length Prefix (RLP) encoding.

## ABI

VeChain SDK provides functionality to interact with smart contracts on the VechainThor blockchain using ABI's. An ABI is a standardised interface format that defines the method signatures, input parameters, and output types of smart contract functions. With VeChain SDK, developers can conveniently encode and decode data for interacting with smart contracts, making it easier to call contract functions and process their results.

[example](examples/encoding/abi.ts)

## RLP Encoding

RLP is a serialisation technique used on the VechainThor blockchain.  It is used to efficiently encode and decode data structures for storage and transmission on the blockchain. VeChain SDK includes dedicated methods for RLP encoding and decoding, enabling developers to handle data serialization and deserialization with ease.

By supporting ABI and RLP encoding handling, VeChain SDK equips developers with the necessary tools to interact with smart contracts and handle data efficiently on the VechainThor blockchain. This further enhances the library's capabilities and contributes to the seamless development of decentralised applications on the platform.

[example](examples/encoding/rlp.ts)