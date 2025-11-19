import { Blake2b256, Hex, Txt } from '@vechain/sdk-core';
import { expect } from 'expect';
// START_SNIPPET: Blake2b256Snippet
// Input of hash function must be an expression representable as an array of bytes.
// The class Txt assures a consistent byte encoding for textual strings.
const toHash = Txt.of('hello world');
const hash = Blake2b256.of(toHash.bytes);
// END_SNIPPET: Blake2b256Snippet
expect(hash.isEqual(Hex.of('0x256c83b297114d201b30179f3f0ef0cace9783622da5974326b436178aeef610'))).toBeTruthy();
