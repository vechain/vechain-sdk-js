import { Hex, Keccak256, Txt } from '@vechain/sdk-core';
import { expect } from 'expect';
// START_SNIPPET: Keccak256Snippet
// Input of hash function must be an expression representable as an array of bytes.
// The class Txt assures a consistent byte encoding for textual strings.
const toHash = Txt.of('hello world');
//
const hash = Keccak256.of(toHash.bytes);
// END_SNIPPET: Keccak256Snippet
expect(hash.isEqual(Hex.of('0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad'))).toBe(true);
