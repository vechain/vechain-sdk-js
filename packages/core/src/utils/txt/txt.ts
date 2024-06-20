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

const NFKC = {
    decode: function (content: Uint8Array): string {
        return TEXT_DECODER.decode(content).normalize(
            NORMALIZATION_FORM_COMPATIBILITY_COMPOSITION
        );
    },

    encode: function (txt: string): Uint8Array {
        return TEXT_ENCODER.encode(
            txt.normalize(NORMALIZATION_FORM_COMPATIBILITY_COMPOSITION)
        );
    }
};

const NFKD = {
    decode: function (content: Uint8Array): string {
        return TEXT_DECODER.decode(content).normalize(
            NORMALIZATION_FORM_COMPATIBILITY_DECOMPOSITION
        );
    },

    encode: function (txt: string): Uint8Array {
        return TEXT_ENCODER.encode(
            txt.normalize(NORMALIZATION_FORM_COMPATIBILITY_DECOMPOSITION)
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

/**
 * The [normalization form for compatibility composition](https://en.wikipedia.org/wiki/Unicode_equivalence#Normal_forms).
 *
 * @constant {string} NORMALIZATION_FORM_COMPATIBILITY_COMPOSITION
 * @description This constant represents the normalization form 'NFKC'.
 *              Characters are decomposed by compatibility, then recomposed by canonical equivalence.
 */
const NORMALIZATION_FORM_COMPATIBILITY_COMPOSITION = 'NFKC';

/**
 * The [normalization form for compatibility decomposition](https://en.wikipedia.org/wiki/Unicode_equivalence#Normal_forms).
 *
 * @constant {string} NORMALIZATION_FORM_COMPATIBILITY_COMPOSITION
 * @description This constant represents the normalization form 'NFKD'.
 *              Characters are decomposed by compatibility, and multiple combining characters are arranged in a specific order.
 */
const NORMALIZATION_FORM_COMPATIBILITY_DECOMPOSITION = 'NFKD';

export { NFC, NFKC, NFKD };
