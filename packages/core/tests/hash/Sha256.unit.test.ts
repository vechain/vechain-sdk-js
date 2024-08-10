import { describe, expect, test } from '@jest/globals';
import { CONTENT, NO_CONTENT } from './fixture';
import { Hex, Sha256 } from '../../src';
import { InvalidOperation } from '@vechain/sdk-errors';

const CONTENT_SHA256 = Hex.of(
    '0xdb484f1fdd0c7ae9268a04a876ee4d1b1c40f801e80e56ff718b198aa2f1166f'
);
const NO_CONTENT_SHA256 = Hex.of(
    '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
);

/**
 * Test Sha256 class.
 * @group unit/hash
 */
describe('Sha256 class tests', () => {
    test('Return hash for content', () => {
        const hash = Sha256.of(CONTENT);
        expect(hash.isEqual(CONTENT_SHA256)).toBe(true);
    });

    test('Return hash for no content', () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const hash = Sha256.of(NO_CONTENT);
        expect(hash.isEqual(NO_CONTENT_SHA256)).toBe(true);
    });

    test('Throw an exception for illegal content', () => {
        expect(() => Sha256.of('0xfoe')).toThrow(InvalidOperation);
    });
});
