import { describe, expect, test } from '@jest/globals';
import { CONTENT, NO_CONTENT } from './fixture';
import { Hex, Keccak256 } from '../../src';
import { InvalidOperation } from '@vechain/sdk-errors';

const CONTENT_KECCAK256 = Hex.of(
    '0x1e86a83a4fcab1b47b8c961f7ab6c5d32927eefa8af20af81f6eab0bc3be582a'
);
const NO_CONTENT_KECCAK256 = Hex.of(
    '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
);

/**
 * Test Keccak256 class.
 * @group unit/hash
 */
describe('Keccak256 class tests', () => {
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
