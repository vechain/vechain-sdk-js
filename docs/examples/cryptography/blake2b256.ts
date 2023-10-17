import { blake2b256, type HashInput } from '@vechain-sdk/core';
import { expect } from 'expect';

const toHash: HashInput = 'hello world';
const hash = blake2b256(toHash);
expect(hash).toBe(
    '0x256c83b297114d201b30179f3f0ef0cace9783622da5974326b436178aeef610'
);
