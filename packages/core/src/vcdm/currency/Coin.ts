import { type Currency } from './Currency';
import { type FPN } from '../FPN';
import { type Txt } from '../Txt';

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
     * @type {FPN}
     */
    private readonly _value: FPN;

    /**
     * Creates an instance of the class with the specified code and value.
     *
     * @param {Txt} code - The code associated with this instance.
     * @param {FPN} value - The value associated with this instance.
     */
    protected constructor(code: Txt, value: FPN) {
        this._code = code;
        this._value = value;
    }

    /**
     * Return the code as a Txt object.
     *
     * @return {Txt} The code object
     *
     * @remarks Since currency codes likely use Unicode composite symbols,
     * {@link Txt} type enforce the reresentation of the code is normalized.
     */
    get code(): Txt {
        return this._code;
    }

    /**
     * Return the current value as an FPN (Fixed-Point Number).
     *
     * @return {FPN} The current value in Fixed-Point Number format.
     */
    get value(): FPN {
        return this._value;
    }

    /**
     * Returns the integer part of the FPN {@link value}.
     *
     * @return {bigint} the integer part of this FPN {@link value}.
     *
     * @throws {InvalidOperation} If the {@link value} is not finite.
     *
     * @remarks Do not use for financial math: apply {@link FPN} methods instead.
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
        throw new Error('Method not implemented.');
    }

    /**
     * Return this {@linl value} approximated as {@link number}.
     *
     * @remarks Do not use for financial math: apply {@link FPN} methods instead.
     */
    get n(): number {
        return this._value.n;
    }

    /**
     * Compares this Currency object with the specified Currency object for order:
     * {@link code} is compared first, then {@link value}.
     *
     * @param {Currency} that - The Currency object to be compared.
     * @return {number} A negative integer, zero, or a positive integer as this object
     *                  is less than, equal to, or greater than the specified object.
     */
    compareTo(that: Currency): number {
        const codeDiff = this.code.compareTo(that.code);
        if (codeDiff === 0) {
            return this.value.compareTo(that.value);
        }
        return codeDiff;
    }

    /**
     * Compares this Currency object with another Currency object to determine if they are equal
     * both having the same {@link code} and {@link value}.
     *
     * @param {Currency} that - The Currency object to compare with.
     * @return {boolean} Returns true if the Currency objects are equal; otherwise, false.
     */
    isEqual(that: Currency): boolean {
        return this.compareTo(that) === 0;
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
