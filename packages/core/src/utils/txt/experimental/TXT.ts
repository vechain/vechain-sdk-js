import { HEX } from '../../hex';
import { BigNumber } from 'bignumber.js';
import { type Comparable } from '../../../experimental';

class TXT extends String implements Comparable<TXT> {
    /**
     * The [Unicode Equivalence](https://en.wikipedia.org/wiki/Unicode_equivalence)
     * Canonical Composition normalization form used for Unicode strings.
     *
     * @type {string}
     * @constant
     * @description
     * The normalization form determines how Unicode characters are composed or decomposed.
     * The value 'NFC' stands for Normalization Form Canonical Composition,
     * which composes pre-composed characters and
     * decomposes compatibility characters.
     *
     * @see {ofText}
     */
    private static readonly NFC = 'NFC';

    /**
     * Represents a decoder for text used to normalize and decode texts in array of bytes expressed in hexadecimal form.
     *
     * @class
     * @see {text}
     */
    private static readonly DECODER = new TextDecoder();

    /**
     * Represents an encoder for text used to normalize and encode texts in array of bytes expressed in hexadecimal form.
     *
     * @class
     * @see {text}
     */
    private static readonly ENCODER = new TextEncoder();

    public constructor(txt: string) {
        super(txt.normalize(TXT.NFC));
    }

    public get bi(): bigint {
        return BigInt(toString());
    }

    public get bn(): BigNumber {
        return BigNumber(toString());
    }

    public get bytes(): Uint8Array {
        return TXT.ENCODER.encode(super.toString());
    }

    public compareTo(that: TXT): number {
        const thisTxt = toString();
        const thatTxt = that.toString();
        if (thisTxt < thatTxt) return -1;
        if (thisTxt > thatTxt) return 1;
        return 0;
    }

    public isEqual(that: TXT): boolean {
        return this.compareTo(that) === 0;
    }

    public get n(): number {
        return Number(toString());
    }

    public static of(value: bigint | HEX | number | Uint8Array): TXT {
        if (typeof value === 'bigint' || typeof value === 'number') {
            return new TXT(value.toString());
        } else if (value instanceof HEX) {
            return TXT.of(value.bytes);
        } else {
            return new TXT(TXT.DECODER.decode(value));
        }
    }
}

export { TXT };
