import { describe, expect, test } from '@jest/globals';
import { Blake2b256, Hex } from '../../src';
import { CONTENT, NO_CONTENT } from './fixture';
import { InvalidOperation } from '@vechain/sdk-errors';

// Hex on purpose because it must be equal to the returned HxUInt hash.
const CONTENT_BLAKE2B256 = Hex.of('0x6a908bb80109908919c0bf5d0594c890700dd46acc097f9f28bfc85a0a2e6c0c');

// Hex on purpose because it must be equal to the returned HxUInt hash.
const NO_CONTENT_BLAKE2B256 = Hex.of('0x0e5751c026e543b2e8ab2eb06099daa1d1e5df47778f7787faab45cdf12fe3a8');

/**
 * Test Blake2b256 class.
 * @group unit/hash
 */
describe('Blake2b256 class tests', () => {
    test('Return hash for content', () => {
        const hash = Blake2b256.of(CONTENT);
        expect(hash.isEqual(CONTENT_BLAKE2B256)).toBe(true);
    });

    test('Return hash for no content', () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const hash = Blake2b256.of(NO_CONTENT);
        expect(hash.isEqual(NO_CONTENT_BLAKE2B256)).toBe(true);
    });

    test('Throw an exception for illegal content', () => {
        expect(() => Blake2b256.of('0xfoe')).toThrow(InvalidOperation);
    });
});
