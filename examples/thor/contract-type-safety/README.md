# Contract Type Safety Example

This example demonstrates how the VeChain SDK’s Contract class provides automatic TypeScript type safety and ABI introspection for smart contract interactions. It shows how developers can connect to the VeChain Thor testnet using ThorClient, load an ERC-20 contract (like VTHO), and call typed read functions such as balanceOf() with full compile-time validation of argument types and return values. The example also illustrates how to inspect ABI metadata at runtime — retrieving parameter names, types, and function signatures — enabling dynamic UI generation or developer tooling. In short, it highlights how the SDK makes contract interaction safer, more predictable, and developer-friendly through strong typing and ABI reflection.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github//vechain/vechain-sdk-js/tree/sdk-v3/examples/thor/contract-type-safety)

