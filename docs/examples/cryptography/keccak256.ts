import { Hex, keccak256, type HashInput } from '@vechain/sdk-core';
import { expect } from 'expect';

// START_SNIPPET: Kekkak256Snippet

// Input of hash function (it can be a string or a Buffer)
const toHash: HashInput = 'hello world';

const hash = keccak256(toHash);

// END_SNIPPET: Kekkak256Snippet

expect(Hex.of(hash).hex).toBe(
    '47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad'
);
