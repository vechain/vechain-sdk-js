import { describe, expect, test } from '@jest/globals';
import { bytesToHex } from '@noble/hashes/utils';
import { InvalidOperation } from '@vechain/sdk-errors';
import { Hex, Keccak256, keccak256 } from '../../../src';
import { CONTENT, NO_CONTENT } from './fixture';

// Hex on purpose because it must be equal to the returned HexUInt hash.
const CONTENT_KECCAK256 = Hex.of(
    '0x1e86a83a4fcab1b47b8c961f7ab6c5d32927eefa8af20af81f6eab0bc3be582a'
);

// Hex on purpose because it must be equal to the returned HexUInt hash.
const NO_CONTENT_KECCAK256 = Hex.of(
    '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
);

/**
 * Test Keccak256 class.
 * @group unit/hash
 */
describe('Keccak256 class tests', () => {
    describe('Polymorphism equivalence', () => {
        test('Equal for bigint, bytes, hex expression, number', () => {
            const ofBi = Keccak256.of(255n);
            const ofBytes = Keccak256.of(Uint8Array.of(255));
            const ofHex = Keccak256.of('0xff');
            const ofN = Keccak256.of(255);
            expect(ofBi.isEqual(ofBytes)).toBeTruthy();
            expect(ofBytes.isEqual(ofHex)).toBeTruthy();
            expect(ofHex.isEqual(ofN)).toBeTruthy();
        });
    });

    test('Return hash for content', () => {
        const hash = Keccak256.of(CONTENT);
        expect(hash.isEqual(CONTENT_KECCAK256)).toBe(true);
    });

    test('Return hash for no content', () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const hash = Keccak256.of(NO_CONTENT);
        expect(hash.isEqual(NO_CONTENT_KECCAK256)).toBe(true);
    });

    test('Throw an exception for illegal content', () => {
        expect(() => Keccak256.of('0xfoe')).toThrow(InvalidOperation);
    });
});
describe('Backwards compatibility tests', () => {
    test('Should return the hash as hex', () => {
        const rawString = 'Hello, World!';
        const hash = keccak256(rawString, 'hex');
        expect(hash).toBe(
            '0xacaf3289d7b601cbd114fb36c4d29c85bbfd5e133f14cb355c3fd8d99367964f'
        );
    });
    test('Should return the hash as buffer', () => {
        const rawString = 'Hello, World!';
        const hash = keccak256(rawString, 'buffer');
        expect(bytesToHex(hash)).toBe(
            'acaf3289d7b601cbd114fb36c4d29c85bbfd5e133f14cb355c3fd8d99367964f'
        );
    });
});
