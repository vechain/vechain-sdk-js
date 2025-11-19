"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Txt = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * Represents a text string encoded according the *Normalization Form Canonical Composition*
 * [Unicode Equivalence](https://en.wikipedia.org/wiki/Unicode_equivalence).
 *
 * @implements {VeChainDataModel<Txt>}
 */
class Txt extends String {
    /**
     * Decoder object used for decoding bytes as text data.
     *
     * @class
     * @constructor
     */
    static DECODER = new TextDecoder();
    /**
     * *Normalization Form Canonical Composition*
     * [Unicode Equivalence](https://en.wikipedia.org/wiki/Unicode_equivalence)
     * flag.
     *
     * @type {string}
     * @constant
     */
    static NFC = 'NFC';
    /**
     * A TextEncoder instance used for encoding text to bytes.
     *
     * @type {TextEncoder}
     */
    static ENCODER = new TextEncoder();
    /**
     * Creates a new instance of this class representing the `exp` string
     * normalized according the *Canonical Composition Form*
     * [Unicode Equivalence](https://en.wikipedia.org/wiki/Unicode_equivalence).
     *
     * @param {string} exp - The expression to be passed to the constructor.
     * @protected
     * @constructor
     */
    constructor(exp) {
        super(exp.normalize(Txt.NFC));
    }
    /**
     * Converts the current Txt string to a BigInt.
     *
     * @returns {bigint} The BigInt representation of the Txt string.
     *
     *  @throws {InvalidOperation} If the conversion to BigInt fails because this Txt string doesn't represent an integer.
     */
    get bi() {
        try {
            return BigInt(this.toString());
        }
        catch (e) {
            throw new sdk_errors_1.InvalidOperation('Txt.bi()', "Can't cast to big integer", { txt: this.toString() }, e);
        }
    }
    /**
     * Converts the current Txt string to a buffer of bytes.
     *
     * @returns {Uint8Array} The bytes representation of the Txt string.
     */
    get bytes() {
        return Txt.ENCODER.encode(this.toString());
    }
    /**
     * Returns the value of n as a number.
     *
     * @returns {number} The value of n as a number.
     */
    /**
     * Converts the current Txt string to a number.
     *
     * @returns {number} The numeric value of the Txt string.
     *
     * @throws {InvalidOperation} If the conversion to number fails because this Txt string doesn't represent a decimal number.
     */
    get n() {
        return Number(this.toString());
    }
    /**
     * Compares the current instance to another instance of Txt.
     *
     * @param {Txt} that - The instance to compare with.
     *
     * @return {number} - A negative number if the current instance is less than the specified instance,
     *                    zero if they are equal, or a positive number if the current instance is greater.
     */
    compareTo(that) {
        return this.toString().localeCompare(that.toString());
    }
    /**
     * Checks if the current Txt object is equal to the given Txt object.
     *
     * @param {Txt} that - The Txt object to compare with.
     *
     *  @return {boolean} - True if the objects are equal, false otherwise.
     */
    isEqual(that) {
        return this.compareTo(that) === 0;
    }
    /**
     * Returns a string representation of the object.
     *
     * @returns {string} A string representation of the object.
     */
    toString() {
        return this.valueOf();
    }
    /**
     * Creates a new Txt instance from the provided expression.
     *
     * @param {bigint | number | string | Uint8Array} exp - The expression to convert to Txt:
     * * {@link bigint} is represented as a {@link NFC} encoded string expressing the value in base 10;
     * * {@link number} is represented as a {@link NFC} encoded string expressing the value in base 10;
     * * {@link string} is encoded as {@link NFC} string;
     * * {@link Uint8Array} is {@link NFC} decoded to a string.
     *
     * @returns {Txt} - A new Txt instance.
     */
    static of(exp) {
        if (typeof exp === 'string') {
            return new Txt(exp);
        }
        else if (typeof exp === 'bigint' || typeof exp === 'number') {
            return new Txt(exp.toString());
        }
        return new Txt(Txt.DECODER.decode(exp));
    }
}
exports.Txt = Txt;
