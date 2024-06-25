// To be introduced once thor-dev-kit dependency clash solved.
// import * as ThorDevKit from 'thor-devkit';
import { txt } from '../../src/utils/txt/txt';
import { blake2b256, blake2b256OfHex, Hex, type ReturnType } from '../../src';
import { describe, expect, test } from '@jest/globals';
import { hexToBytes } from '@noble/hashes/utils';
import {
    BLAKE2B256_CONTENT,
    BLAKE2B256_NO_CONTENT,
    BLAKE2B256_NO_CONTENT_HASH,
    BLAKE2B256_CONTENT_HASH
} from './fixture';
import {
    InvalidDataReturnTypeError,
    InvalidDataTypeError
} from '@vechain/sdk-errors';

/**
 * Test hash functions
 * @group unit/hash
 */
describe('blake2b256', () => {
    describe('blake2b256', () => {
        // To be introduced once thor-dev-kit dependency clash solved.
        // test('blake2b256 - compatibility - thor-dev-kit', () => {
        //     const expected = new Uint8Array(
        //         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        //         ThorDevKit.blake2b256(BLAKE2B256_CONTENT)
        //     );
        //     const actual = blake2b256(BLAKE2B256_CONTENT);
        //     expect(actual).toEqual(expected);
        // });

        test('blake2b256 - valid content - string', () => {
            const content = txt.encode(BLAKE2B256_CONTENT);
            const expected = hexToBytes(Hex.canon(BLAKE2B256_CONTENT_HASH));
            let actual: string | Uint8Array;
            actual = blake2b256(content);
            expect(actual).toEqual(expected);
            actual = blake2b256(content, 'buffer');
            expect(actual).toEqual(expected);
            actual = blake2b256(content, 'hex');
            expect(actual).toEqual(BLAKE2B256_CONTENT_HASH);
        });

        test('blake2b256 - valid content - Uint8Array', () => {
            const expected = hexToBytes(Hex.canon(BLAKE2B256_CONTENT_HASH));
            let actual: string | Uint8Array;
            actual = blake2b256(BLAKE2B256_CONTENT);
            expect(actual).toEqual(expected);
            actual = blake2b256(BLAKE2B256_CONTENT, 'buffer');
            expect(actual).toEqual(expected);
            actual = blake2b256(BLAKE2B256_CONTENT, 'hex');
            expect(actual).toEqual(BLAKE2B256_CONTENT_HASH);
        });

        test('blake2b256 - valid no content - Uint8Array', () => {
            const expected = hexToBytes(Hex.canon(BLAKE2B256_NO_CONTENT_HASH));
            let actual: string | Uint8Array;
            actual = blake2b256(BLAKE2B256_NO_CONTENT);
            expect(actual).toEqual(expected);
            actual = blake2b256(BLAKE2B256_NO_CONTENT, 'buffer');
            expect(actual).toEqual(expected);
            actual = blake2b256(BLAKE2B256_NO_CONTENT, 'hex');
            expect(actual).toEqual(BLAKE2B256_NO_CONTENT_HASH);
        });

        test('blake2b256 - valid zero content - string', () => {
            const expected = hexToBytes(Hex.canon(BLAKE2B256_NO_CONTENT_HASH));
            let actual: string | Uint8Array;
            actual = blake2b256('');
            expect(actual).toEqual(expected);
            actual = blake2b256('', 'buffer');
            expect(actual).toEqual(expected);
            actual = blake2b256('', 'hex');
            expect(actual).toEqual(BLAKE2B256_NO_CONTENT_HASH);
        });
    });

    describe('blake2b256OfHex', () => {
        const content = Hex.of(txt.encode(BLAKE2B256_CONTENT));

        const zeroContent = Hex.of(BLAKE2B256_NO_CONTENT);

        // To be introduced once thor-dev-kit dependency clash solved.
        // test('blake2b256OfHex - compatibility - thor-dev-kit', () => {
        //     const expected = new Uint8Array(
        //         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        //         ThorDevKit.blake2b256(Buffer.from(hexToBytes(content)))
        //     );
        //     const actual = blake2b256OfHex(content);
        //     expect(actual).toEqual(expected);
        // });

        test('blake2b256OfHex - invalid return type', () => {
            expect(() =>
                blake2b256OfHex(
                    BLAKE2B256_CONTENT,
                    'invalid_return_type' as ReturnType
                )
            ).toThrowError(InvalidDataReturnTypeError);
        });

        test('blake2b256OfHex - invalid hex', () => {
            expect(() => blake2b256OfHex('coffee')).toThrowError(
                InvalidDataTypeError
            );
        });

        test('blake2b256OfHex - valid - content', () => {
            const expected = hexToBytes(Hex.canon(BLAKE2B256_CONTENT_HASH));
            let actual = blake2b256OfHex(content);
            expect(actual).toEqual(expected);
            actual = blake2b256OfHex(content, 'hex');
            expect(actual).toEqual(BLAKE2B256_CONTENT_HASH);
        });

        test('blake2b256OfHex - valid - no content', () => {
            const expected = hexToBytes(Hex.canon(BLAKE2B256_NO_CONTENT_HASH));
            let actual = blake2b256OfHex(zeroContent);
            expect(actual).toEqual(expected);
            actual = blake2b256OfHex(zeroContent, 'hex');
            expect(actual).toEqual(BLAKE2B256_NO_CONTENT_HASH);
        });
    });
});
