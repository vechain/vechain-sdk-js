# Hash Functions

Examples of using hash functions

## blake2b256

```typescript { name=blake2b256, category=example }
    import { blake2b256, type HashInput } from '@vechain-sdk/core';
    import { expect } from 'expect';

    const toHash: HashInput = 'hello world';
    const hash = blake2b256(toHash, 'hex');
    expect(hash).toBe('0x256c83b297114d201b30179f3f0ef0cace9783622da5974326b436178aeef610');
```

## keccak256

```typescript { name=keccak256, category=example }
    import { keccak256, type HashInput } from '@vechain-sdk/core';
    import { expect } from 'expect';

    const toHash: HashInput = 'hello world';
    const hash = keccak256(toHash, 'hex');
    expect(hash).toBe('0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad');
```