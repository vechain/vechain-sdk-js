import { Hex, blake2b256, type HashInput } from '@vechain/sdk-core';
import { expect } from 'expect';

// START_SNIPPET: Blake2b256Snippet

// Input of hash function (it can be a string or a Buffer)
const toHash: HashInput = 'hello world';

const hash = blake2b256(toHash);

// END_SNIPPET: Blake2b256Snippet

expect(Hex.of(hash).hex).toBe(
    '256c83b297114d201b30179f3f0ef0cace9783622da5974326b436178aeef610'
);
