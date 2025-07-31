import { describe, expect, test } from '@jest/globals';
import { Hex, Sha256 } from '@common/vcdm';
import { IllegalArgumentError } from '@errors';
import { CONTENT, NO_CONTENT } from './fixture';

// Hex on purpose because it must be equal to the returned HexUInt hash.
const CONTENT_SHA256 = Hex.of(
    '0xdb484f1fdd0c7ae9268a04a876ee4d1b1c40f801e80e56ff718b198aa2f1166f'
);

// Hex on purpose because it must be equal to the returned HexUInt hash.
const NO_CONTENT_SHA256 = Hex.of(
    '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
);

/**
 * Test Sha256 class.
 * @group unit/hash
 */
describe('Sha256 class tests', () => {
    describe('Polymorphism equivalence', () => {
        test('Equal for bigint, bytes, hex expression, number', () => {
            const ofBi = Sha256.of(255n);
            const ofBytes = Sha256.of(Uint8Array.of(255));
            const ofHex = Sha256.of('0xff');
            const ofN = Sha256.of(255);
            expect(ofBi.isEqual(ofBytes)).toBeTruthy();
            expect(ofBytes.isEqual(ofHex)).toBeTruthy();
            expect(ofHex.isEqual(ofN)).toBeTruthy();
        });
    });

    test('Return hash for content', () => {
        const hash = Sha256.of(CONTENT.bytes);
        expect(hash.isEqual(CONTENT_SHA256)).toBe(true);
    });

    test('Return hash for no content', () => {
        const hash = Sha256.of(NO_CONTENT.bytes);
        expect(hash.isEqual(NO_CONTENT_SHA256)).toBe(true);
    });

    test('Throw an exception for illegal content', () => {
        expect(() => Sha256.of('0xfoe')).toThrow(IllegalArgumentError);
    });
});
