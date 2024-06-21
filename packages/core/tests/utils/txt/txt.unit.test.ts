import { describe, expect, test } from '@jest/globals';
import { txt } from '../../../src/utils/txt/txt';

/**
 * Text Hex representation from TS types prefixed with `0x`.
 * @group unit/utils/txt
 */
describe('txt', () => {
    describe('NFC', () => {
        test('should encode a string to Uint8Array', () => {
            const str = 'Hello, world!';
            const encoded = txt.encode(str);

            // The type of the encoded value should be Uint8Array.
            expect(encoded).toBeInstanceOf(Uint8Array);

            // After decoding the value, it should be the same as the original string.
            expect(txt.decode(encoded)).toBe(str);
        });

        test('should normalize the string to canonical composition during encoding', () => {
            // Using a string with diacritic signs as an example.
            // The 'c' in 'façade' can also be represented using 'c' and '̧' (the cedilla).
            const str = 'fac\u0327ade';

            // Before normalization, 'façade' and 'façade' aren't the same.
            expect(str).not.toBe('façade');

            // After normalization, they become the same.
            const normalized = txt.encode(str);

            expect(txt.decode(normalized)).toBe('façade');
        });
    });
});
