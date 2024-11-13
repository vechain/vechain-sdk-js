import { type Currency } from './Currency';
import { type FixedPointNumber } from '../FixedPointNumber';
import { Txt } from '../Txt';
import { InvalidDataType } from '@vechain/sdk-errors';

/**
 * Abstract class representing a coin, implementing the Currency interface.
 */
abstract class Coin implements Currency {
    /**
     * Represent coin {@link code} denomination.
     */
    private readonly _code: Txt;

    /**
     * Represent the coin {@link value}.
     *
     * @type {FixedPointNumber}
     */
    private readonly _value: FixedPointNumber;

    /**
     * Creates an instance of the class with the specified code and value.
     *
     * @param {Txt} code - The code associated with this instance.
     * @param {FixedPointNumber} value - The value associated with this instance.
     */
    protected constructor(code: Txt, value: FixedPointNumber) {
        this._code = code;
        this._value = value;
    }

    /**
     * Return the code as a Txt object.
     *
     * @return {Txt} The code object
     *
     * @remarks Since currency codes likely use Unicode composite symbols,
     * {@link Txt} type enforce the representation of the code is normalized.
     */
    get code(): Txt {
        return this._code;
    }

    /**
     * Return the current value as an FixedPointNumber (Fixed-Point Number).
     *
     * @return {FixedPointNumber} The current value in Fixed-Point Number format.
     */
    get value(): FixedPointNumber {
        return this._value;
    }

    /**
     * Returns the integer part of the FixedPointNumber {@link value}.
     *
     * @return {bigint} the integer part of this FixedPointNumber {@link value}.
     *
     * @throws {InvalidOperation} If the {@link value} is not finite.
     *
     * @remarks Do not use for financial math: apply {@link FixedPointNumber} methods instead.
     */
    get bi(): bigint {
        return this._value.bi;
    }

    /**
     * Returns the array of bytes representing the *Normalization Form Canonical Composition*
     * [Unicode Equivalence](https://en.wikipedia.org/wiki/Unicode_equivalence)
     * of the textual expression '{@link value} {@link code}'.
     */
    get bytes(): Uint8Array {
        return Txt.of(this.toString()).bytes;
    }

    /**
     * Return this {@linl value} approximated as {@link number}.
     *
     * @remarks Do not use for financial math: apply {@link FixedPointNumber} methods instead.
     */
    get n(): number {
        return this._value.n;
    }

    /**
     * Compares this Currency object with another Currency object for order.
     *
     * @param {Currency} that - The Currency object to be compared.
     * @return {number} A negative integer, zero, or a positive integer as this Currency
     *     is less than, equal to, or greater than the specified Currency.
     * @throws {InvalidDataType} If the currency codes do not match.
     */
    compareTo(that: Currency): number {
        if (this.code.isEqual(that.code)) {
            return this.value.compareTo(that.value);
        }
        throw new InvalidDataType('Coin.compareTo', 'not VET currency', {
            // eslint-disable-next-line sonarjs/no-base-to-string, @typescript-eslint/no-base-to-string
            that: `${that}` // Needed to serialize bigint value.
        });
    }

    /**
     * Determines if this Currency object is equal to another Currency object.
     *
     * @param {Currency} that - The Currency object to compare with the current instance.
     * @return {boolean} - `true` if the objects are considered equal, otherwise `false`.
     */
    isEqual(that: Currency): boolean {
        try {
            return this.compareTo(that) === 0;
        } catch (e) {
            return false;
        }
    }

    /**
     * Returns the textual representation of this currency as
     * '{@link value} {@link code}'.
     *
     * @return A string that contains the value and code properties of the object.
     */
    public toString(): string {
        return `${this.value.toString()} ${this._code}`;
    }
}

export { Coin };
