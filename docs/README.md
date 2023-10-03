# Code Examples

The `/docs` folder contains code examples to perform various operations.

These code examples are also integration tests, and the code snippets within the documentation are executed as tests, and so are always up to date and working.

Some of the code examples require a Thor Solo node to be available.

## Execution

To execute all the code examples:

```bash
cd ./docs
yarn install
yarn rundocs
```

## Examples

1. [Hash functions](./hash-functions.md) --> Examples of hash functions such as blake2b256, keccak256
2. [HDNode](./hdnode.md) --> Examples of deriving addresses, private keys, public keys