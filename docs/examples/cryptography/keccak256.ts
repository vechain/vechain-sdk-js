import { keccak256, type HashInput } from '@vechain-sdk/core';
import { expect } from 'expect';

const toHash: HashInput = 'hello world';
const hash = keccak256(toHash);
expect(hash).toBe(
    '0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad'
);
