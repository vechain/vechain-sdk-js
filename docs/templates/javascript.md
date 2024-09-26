# How to Use the VeChain SDK with JavaScript

The [VeChain SDK](https://github.com/vechain/vechain-sdk-js) can be used with both TypeScript and JavaScript. Although TypeScript is recommended for its type safety and enhanced development experience, you can also use the SDK with JavaScript.

## Installation

To install the core package of the VeChain SDK, run:
``` bash
npm install @vechain/sdk-core
```

## Usage

Here’s an example of how to use the SDK in your JavaScript code:

``` javascript
const { Hex, _blake2b256 } = require('@vechain/sdk-core');

// Input of the hash function (it can be a string or a Uint8Array)
const toHash = 'hello world';

const hash = _blake2b256(toHash);

console.log(Hex.of(hash)); // Outputs: 256c83b297114d201b30179f3f0ef0cace9783622da5974326b436178aeef610
```

## Differences Between TypeScript and JavaScript

When using the SDK in TypeScript vs. JavaScript, there are a few key differences:
 - Imports:
    - In TypeScript, you use import statements:
        ``` typescript
        import { Hex, _blake2b256 } from '@vechain/sdk-core';
        ```
    - In JavaScript, you use require statements:
        ``` javascript
        const { Hex, _blake2b256 } = require('@vechain/sdk-core');
        ```
 - Type Annotations:
    - TypeScript uses types to provide compile-time checks and better code completion.
        ``` typescript
        import { Hex, _blake2b256, type HashInput } from '@vechain/sdk-core';
        import { expect } from 'expect';

        const toHash: HashInput = 'hello world';
        const hash = _blake2b256(toHash);

        console.log(Hex.of(hash));
        ```
    - JavaScript does not use types. If you see TypeScript examples, you can remove all type annotations to convert them to JavaScript.
        ``` javascript
        const { Hex, _blake2b256 } = require('@vechain/sdk-core');

        const toHash = 'hello world';
        const hash = _blake2b256(toHash);

        console.log(Hex.of(hash));
        ```
