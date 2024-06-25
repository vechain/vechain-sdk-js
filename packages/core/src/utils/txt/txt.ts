const TEXT_DECODER = new TextDecoder();

const TEXT_ENCODER = new TextEncoder();

/**
 * txt - A utility object for text encoding and decoding using the consistent
 * [normalization form for canonical composition](https://en.wikipedia.org/wiki/Unicode_equivalence#Normal_forms).
 * @namespace
 */
const txt = {
    /**
     * Decodes a Uint8Array content into a string, using the consistent
     * [normalization form for canonical composition](https://en.wikipedia.org/wiki/Unicode_equivalence#Normal_forms).
     *
     * @param {Uint8Array} content - The Uint8Array content to decode.
     * @returns {string} - The decoded string.
     */
    decode: function (content: Uint8Array): string {
        return TEXT_DECODER.decode(content).normalize(
            NORMALIZATION_FORM_CANONICAL_COMPOSITION
        );
    },

    /**
     * Encodes the given text into a Uint8Array, using the consistent
     * [normalization form for canonical composition](https://en.wikipedia.org/wiki/Unicode_equivalence#Normal_forms).
     *
     * @param {string} text - The text to encode.
     * @returns {Uint8Array} - The encoded text as a Uint8Array.
     */
    encode: function (text: string): Uint8Array {
        return TEXT_ENCODER.encode(
            text.normalize(NORMALIZATION_FORM_CANONICAL_COMPOSITION)
        );
    }
};

/**
 * The [normalization form for canonical composition](https://en.wikipedia.org/wiki/Unicode_equivalence#Normal_forms).
 *
 * @constant {string} NORMALIZATION_FORM_CANONICAL_COMPOSITION
 * @description This constant represents the normalization form 'NFC'.
 *              It is used to specify the normalization form for converting strings to their canonical composition.
 *              Canonical composition refers to the transformation of the input string to the composed form, where each character is represented by a single Unicode codepoint.
 */
const NORMALIZATION_FORM_CANONICAL_COMPOSITION = 'NFC';

export { txt };
