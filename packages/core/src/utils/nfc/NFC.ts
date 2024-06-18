const TEXT_DECODER = new TextDecoder();

const TEXT_ENCODER = new TextEncoder();

const NFC = {
    decode: function (content: Uint8Array): string {
        return TEXT_DECODER.decode(content).normalize(
            NORMALIZATION_FORM_CANONICAL_COMPOSITION
        );
    },

    encode: function (txt: string): Uint8Array {
        return TEXT_ENCODER.encode(
            txt.normalize(NORMALIZATION_FORM_CANONICAL_COMPOSITION)
        );
    }
};

/**
 * The [normalization form for canonical composition](https://en.wikipedia.org/wiki/Unicode_equivalence#Normal_forms).
 *
 * @constant {string} NORMALIZATION_FORM_CANONICAL_COMPOSITION
 * @description This constant represents the normalization form 'NFC'. It is used to specify the normalization form for converting strings to their canonical composition.
 *              Canonical composition refers to the transformation of the input string to the composed form, where each character is represented by a single Unicode codepoint.
 *              This normalization form is useful for comparing strings and ensuring consistency and interoperability.
 *
 */
const NORMALIZATION_FORM_CANONICAL_COMPOSITION = 'NFC';

export { NFC, NORMALIZATION_FORM_CANONICAL_COMPOSITION };
