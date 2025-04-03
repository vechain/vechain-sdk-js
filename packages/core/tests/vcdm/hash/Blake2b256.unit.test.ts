import { describe, expect, test } from '@jest/globals';
import { Blake2b256, HexUInt32, IllegalArgumentError } from '../../../src';
import { CONTENT, NO_CONTENT } from './fixture';

// Hex on purpose because it must be equal to the returned HexUInt hash.
const CONTENT_BLAKE2B256 = HexUInt32.of(
    '0x6a908bb80109908919c0bf5d0594c890700dd46acc097f9f28bfc85a0a2e6c0c'
);

// Hex on purpose because it must be equal to the returned HexUInt hash.
const NO_CONTENT_BLAKE2B256 = HexUInt32.of(
    '0x89eb0d6a8a691dae2cd15ed0369931ce0a949ecafa5c3f93f8121833646e15c3'
);

/**
 * Test Blake2b256 class.
 * @group unit/hash
 */
describe('Blake2b256 class tests', () => {
    describe('Polymorphism equivalence', () => {
        test('Equal for bigint, bytes, hex expression, number', () => {
            const ofBi = Blake2b256.of(255n);
            const ofBytes = Blake2b256.of(Uint8Array.of(255));
            const ofHex = Blake2b256.of('0xff');
            const ofN = Blake2b256.of(255);
            expect(ofBi.isEqual(ofBytes)).toBeTruthy();
            expect(ofBytes.isEqual(ofHex)).toBeTruthy();
            expect(ofHex.isEqual(ofN)).toBeTruthy();
        });
    });

    test('Return hash for content', () => {
        const hash = Blake2b256.of(CONTENT);
        expect(hash.isEqual(CONTENT_BLAKE2B256)).toBe(true);
    });

    test('Return hash for no content', () => {
        const hash = Blake2b256.of(NO_CONTENT);
        expect(hash.isEqual(NO_CONTENT_BLAKE2B256)).toBe(true);
    });

    test('Throw an exception for illegal content', () => {
        expect(() => Blake2b256.of('0xfoe')).toThrow(IllegalArgumentError);
    });
});
