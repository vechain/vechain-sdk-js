# Hash Functions

Examples of using hash functions

## blake2b256

```typescript { name=blake, category=example }
    import { blake2b256, type HashInput } from 'core';

    const toHash: HashInput = 'hello world';
    const hash = blake2b256(toHash);
```