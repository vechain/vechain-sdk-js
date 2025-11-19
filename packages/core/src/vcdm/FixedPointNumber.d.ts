import { type VeChainDataModel } from './VeChainDataModel';
/**
 * Represents a fixed-point number for precision arithmetic.
 */
declare class FixedPointNumber implements VeChainDataModel<FixedPointNumber> {
    /**
     * Base of value notation.
     */
    private static readonly BASE;
    /**
     * The default number of decimal places to use for fixed-point math.
     *
     * @see
     * [bignumber.js DECIMAL_PLACES](https://mikemcl.github.io/bignumber.js/#decimal-places)
     *
     * @constant {bigint}
     */
    protected static readonly DEFAULT_FRACTIONAL_DECIMALS = 20n;
    /**
     * Not a Number.
     *
     * @remarks {@link fractionalDigits} and {@link scaledValue} not meaningful.
     *
     * @see [Number.NaN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/NaN)
     *
     */
    static readonly NaN: FixedPointNumber;
    /**
     * The negative Infinity value.
     *
     * @remarks {@link fractionalDigits} and {@link scaledValue} not meaningful.
     *
     * @see [Number.NEGATIVE_INFINITY](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/NEGATIVE_INFINITY)
     */
    static readonly NEGATIVE_INFINITY: FixedPointNumber;
    /**
     * Represents the one constant.
     */
    static readonly ONE: FixedPointNumber;
    /**
     * The positive Infinite value.
     *
     * @remarks {@link fractionalDigits} and {@link scaledValue} not meaningful.
     *
     * @see [Number.POSITIVE_INFINITY](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/POSITIVE_INFINITY)
     */
    static readonly POSITIVE_INFINITY: FixedPointNumber;
    /**
     * Regular expression pattern for matching integers expressed as base 10 strings.
     */
    private static readonly REGEX_INTEGER;
    /**
     * Regular expression for matching numeric values expressed as base 10 strings.
     */
    private static readonly REGEX_NUMBER;
    /**
     * Regular expression pattern for matching natural numbers expressed as base 10 strings.
     */
    private static readonly REGEX_NATURAL;
    /**
     * Represents the zero constant.
     */
    static readonly ZERO: FixedPointNumber;
    /**
     * Edge Flag denotes the {@link NaN} or {@link NEGATIVE_INFINITY} or {@link POSITIVE_INFINITY} value.
     *
     * @remarks If `ef` is not zero, {@link fractionalDigits} and {@link scaledValue} are not meaningful.
     */
    protected readonly edgeFlag: number;
    /**
     * Fractional Digits or decimal places.
     *
     * @see [bignumber.js precision](https://mikemcl.github.io/bignumber.js/#sd)
     */
    readonly fractionalDigits: bigint;
    /**
     * Scaled Value = value * 10 ^ {@link fractionalDigits}.
     */
    readonly scaledValue: bigint;
    /**
     * Returns the integer part of this FixedPointNumber value.
     *
     * @return {bigint} the integer part of this FixedPointNumber value.
     *
     * @throws {InvalidOperation} If the value is not finite.
     */
    get bi(): bigint;
    /**
     * Returns the array of bytes representing the *Normalization Form Canonical Composition*
     * [Unicode Equivalence](https://en.wikipedia.org/wiki/Unicode_equivalence)
     * of this value expressed in decimal base.
     */
    get bytes(): Uint8Array;
    /**
     * Return this value approximated as {@link number}.
     */
    get n(): number;
    /**
     * Returns the new Fixed-Point Number (FixedPointNumber) instance having
     *
     * @param {bigint} fd - Number of Fractional Digits (or decimal places).
     * @param {bigint} sv - Scaled Value.
     * @param {number} [ef=0] - Edge Flag.
     */
    protected constructor(fd: bigint, sv: bigint, ef?: number);
    /**
     * Returns a FixedPointNumber whose value is the absolute value, i.e. the magnitude, of the value of this FixedPointNumber.
     *
     * @return {FixedPointNumber} the absolute value of this FixedPointNumber.
     *
     * @see [bignumber.js absoluteValue](https://mikemcl.github.io/bignumber.js/#abs)
     */
    abs(): FixedPointNumber;
    /**
     * Compares this instance with `that` FixedPointNumber instance.
     * * Returns 0 if this is equal to `that` FixedPointNumber, including infinite with equal sign;
     * * Returns -1, if this is -Infinite or less than `that` FixedPointNumber;,
     * * Returns 1 if this is +Infinite or greater than `that` FixedPointNumber.
     *
     * @param {FixedPointNumber} that - The instance to compare with this instance.
     * @return {number} Returns -1, 0, or 1 if this instance is less than, equal to, or greater
     * than the specified instance, respectively.
     * @throw InvalidOperation If this or `that` FixedPointNumber is {@link NaN}.
     *
     * @see [bignumber.js comparedTo](https://mikemcl.github.io/bignumber.js/#cmp)
     */
    compareTo(that: FixedPointNumber): number;
    /**
     * Compares this instance with `that` FixedPointNumber instance.
     * * **Returns `null` if either instance is NaN;**
     * * Returns 0 if this is equal to `that` FixedPointNumber, including infinite with equal sign;
     * * Returns -1, if this is -Infinite or less than `that` FixedPointNumber;,
     * * Returns 1 if this is +Infinite or greater than `that` FixedPointNumber.
     *
     * @param {FixedPointNumber} that - The instance to compare with this instance.
     * @return {null | number} A null if either instance is NaN;
     * -1, 0, or 1 if this instance is less than, equal to, or greater
     * than the specified instance, respectively.
     *
     * @remarks This method uses internally {@link compareTo} wrapping the {@link InvalidOperation} exception
     * when comparing between {@link NaN} values to behave according the
     * [[bignumber.js comparedTo](https://mikemcl.github.io/bignumber.js/#cmp)] rules.
     */
    comparedTo(that: FixedPointNumber): null | number;
    /**
     * Returns a FixedPointNumber whose value is the value of this FixedPointNumber divided by `that` FixedPointNumber.
     *
     * Limit cases
     * * 0 / 0 = NaN
     * * NaN / ±n = NaN
     * * ±Infinity / ±Infinity = NaN
     * * +n / NaN = NaN
     * * +n / ±Infinity = 0
     * * -n / 0 = -Infinity
     * * +n / 0 = +Infinity
     *
     * @param {FixedPointNumber} that - The fixed-point number to divide by.
     * @return {FixedPointNumber} The result of the division.
     *
     * @remarks The precision is the greater of the precision of the two operands.
     *
     * @see [bignumber.js dividedBy](https://mikemcl.github.io/bignumber.js/#div)
     */
    div(that: FixedPointNumber): FixedPointNumber;
    /**
     * Divides the given dividend by the given divisor, adjusted by a factor based on fd.
     *
     * @param {bigint} fd - The factor determining the power of 10 to apply to the dividend.
     * @param {bigint} dividend - The number to be divided.
     * @param {bigint} divisor - The number by which to divide the dividend.
     *
     * @return {bigint} - The result of the division, adjusted by the given factor fd.
     */
    private static div;
    /**
     * Adjust the precision of the floating-point number by the specified
     * number of decimal places.
     *
     * @param decimalPlaces The number of decimal places to adjust to,
     *                      it must be a positive value.
     * @return {FixedPointNumber} A new FixedPointNumber instance with the adjusted precision.
     * @throws InvalidDataType if `decimalPlaces` is negative.
     */
    dp(decimalPlaces: bigint | number): FixedPointNumber;
    /**
     * Returns `true `if the value of thisFPN is equal to the value of `that` FixedPointNumber, otherwise returns `false`.
     *
     * As with JavaScript, `NaN` does not equal `NaN`.
     *
     * @param {FixedPointNumber} that - The FixedPointNumber to compare against.
     * @return {boolean} `true` if the FixedPointNumber numbers are equal, otherwise `false`.
     *
     * @remarks This method uses {@link comparedTo} internally.
     *
     * @see [bigbumber.js isEqualTo](https://mikemcl.github.io/bignumber.js/#eq)
     */
    eq(that: FixedPointNumber): boolean;
    /**
     * Returns `true` if the value of this FixedPointNumber is greater than `that` FixedPointNumber`, otherwise returns `false`.
     *
     * @param {FixedPointNumber} that The FixedPointNumber to compare against.
     * @return {boolean} `true` if this FixedPointNumber is greater than `that` FixedPointNumber, otherwise `false`.
     *
     * @remarks This method uses {@link comparedTo} internally.
     *
     * @see [bignummber.js isGreaterThan](https://mikemcl.github.io/bignumber.js/#gt)
     */
    gt(that: FixedPointNumber): boolean;
    /**
     * Returns `true` if the value of this FixedPointNumber is greater or equal than `that` FixedPointNumber`, otherwise returns `false`.
     *
     * @param {FixedPointNumber} that - The FixedPointNumber to compare against.
     * @return {boolean} `true` if this FixedPointNumber is greater or equal than `that` FixedPointNumber, otherwise `false`.
     *
     * @remarks This method uses {@link comparedTo} internally.
     *
     * @see [bignumber.js isGreaterThanOrEqualTo](https://mikemcl.github.io/bignumber.js/#gte)
     */
    gte(that: FixedPointNumber): boolean;
    /**
     * Returns a fixed-point number whose value is the integer part of dividing the value of this fixed-point number
     * by `that` fixed point number.
     *
     * Limit cases
     * * 0 / 0 = NaN
     * * NaN / ±n = NaN
     * * ±Infinity / ±Infinity = NaN
     * * +n / NaN = NaN
     * * +n / ±Infinite = 0
     * * -n / 0 = -Infinite
     * * +n / 0 = +Infinite
     *
     * @param {FixedPointNumber} that - The fixed-point number to divide by.
     * @return {FixedPointNumber} The result of the division.
     *
     * @remarks The precision is the greater of the precision of the two operands.
     *
     * @see [bignumber.js dividedToIntegerBy](https://mikemcl.github.io/bignumber.js/#divInt)
     */
    idiv(that: FixedPointNumber): FixedPointNumber;
    /**
     * Performs integer division on two big integers and scales the result by a factor of 10 raised to the power of fd.
     *
     * @param {bigint} fd - The power to which 10 is raised to scale the result.
     * @param {bigint} dividend - The number to be divided.
     * @param {bigint} divisor - The number by which dividend is divided.
     * @return {bigint} - The scaled result of the integer division.
     */
    private static idiv;
    /**
     * Returns `true `if the value of thisFPN is equal to the value of `that` FixedPointNumber, otherwise returns `false`.
     *
     * As with JavaScript, `NaN` does not equal `NaN`.
     *
     * @param {FixedPointNumber} that - The FixedPointNumber to compare against.
     * @return {boolean} `true` if the FixedPointNumber numbers are equal, otherwise `false`.
     *
     * @remarks This method uses {@link eq} internally.
     */
    isEqual(that: FixedPointNumber): boolean;
    /**
     * Returns `true` if the value of this FixedPointNumber is a finite number, otherwise returns `false`.
     *
     * The only possible non-finite values of a FixedPointNumber are {@link NaN}, {@link NEGATIVE_INFINITY} and {@link POSITIVE_INFINITY}.
     *
     * @return `true` if the value of this FixedPointNumber is a finite number, otherwise returns `false`.
     *
     * @see [bignumber.js isFinite](https://mikemcl.github.io/bignumber.js/#isF)
     */
    isFinite(): boolean;
    /**
     * Return `true` if the value of this FixedPointNumber is {@link NEGATIVE_INFINITY} or {@link POSITIVE_INFINITY},
     * otherwise returns false.
     *
     * @return true` if the value of this FixedPointNumber is {@link NEGATIVE_INFINITY} or {@link POSITIVE_INFINITY},
     */
    isInfinite(): boolean;
    /**
     * Returns `true` if the value of this FixedPointNumber is an integer,
     * otherwise returns `false`.
     *
     * @return `true` if the value of this FixedPointNumber is an integer.
     *
     * @see [bignumber.js isInteger](https://mikemcl.github.io/bignumber.js/#isInt)
     */
    isInteger(): boolean;
    /**
     * Checks if a given string expression is an integer in base 10 notation,
     * considering `-` for negative and `+` optional for positive values.
     *
     * @param {string} exp - The string expression to be tested.
     *
     * @return {boolean} `true` if the expression is an integer,
     * `false` otherwise.
     */
    static isIntegerExpression(exp: string): boolean;
    /**
     *  Returns `true` if the value of this FixedPointNumber is `NaN`, otherwise returns `false`.
     *
     *  @return `true` if the value of this FixedPointNumber is `NaN`, otherwise returns `false`.
     *
     *  @see [bignumber.js isNaN](https://mikemcl.github.io/bignumber.js/#isNaN)
     */
    isNaN(): boolean;
    /**
     * Checks if a given string expression is a natural (unsigned positive integer)
     * number in base 10 notation.
     *
     * @param {string} exp - The string expression to be tested.
     *
     * @return {boolean} `true` if the expression is a natural number,
     * `false` otherwise.
     */
    static isNaturalExpression(exp: string): boolean;
    /**
     * Returns `true` if the sign of this FixedPointNumber is negative, otherwise returns `false`.
     *
     * @return `true` if the sign of this FixedPointNumber is negative, otherwise returns `false`.
     *
     * @see [bignumber.js isNegative](https://mikemcl.github.io/bignumber.js/#isNeg)
     */
    isNegative(): boolean;
    /**
     * Returns `true` if this FixedPointNumber value is {@link NEGATIVE_INFINITY}, otherwise returns `false`.
     */
    isNegativeInfinite(): boolean;
    /**
     * Checks if a given string expression is a number in base 10 notation,
     * considering `-` for negative and `+` optional for positive values.
     *
     * The method returns `true` for the following cases.
     * - Whole numbers:
     *   - Positive whole numbers, optionally signed: 1, +2, 3, ...
     *   - Negative whole numbers: -1, -2, -3, ...
     * - Decimal numbers:
     *   - Positive decimal numbers, optionally signed: 1.0, +2.5, 3.14, ...
     *   - Negative decimal numbers: -1.0, -2.5, -3.14, ...
     *   - Decimal numbers without whole part:
     *     - Positive decimal numbers, optionally signed: .1, +.5, .75, ...
     *     - Negative decimal numbers: -.1, -.5, -.75, ...
     *
     * @param exp - The string expression to be checked.
     *
     * @return `true` is `exp` represents a number, otherwise `false`.
     */
    static isNumberExpression(exp: string): boolean;
    /**
     * Returns `true` if the sign of this FixedPointNumber is positive, otherwise returns `false`.
     *
     * @return `true` if the sign of this FixedPointNumber is positive, otherwise returns `false`.
     *
     * @see [bignumber.js isPositive](https://mikemcl.github.io/bignumber.js/#isPos)
     */
    isPositive(): boolean;
    /**
     * Returns `true` if this FixedPointNumber value is {@link POSITIVE_INFINITY}, otherwise returns `false`.
     *
     * @return `true` if this FixedPointNumber value is {@link POSITIVE_INFINITY}, otherwise returns `false`.
     */
    isPositiveInfinite(): boolean;
    /**
     * Returns `true` if the value of this FixedPointNumber is zero or minus zero, otherwise returns `false`.
     *
     * @return `true` if the value of this FixedPointNumber is zero or minus zero, otherwise returns `false`.
     *
     * [see bignumber.js isZero](https://mikemcl.github.io/bignumber.js/#isZ)
     */
    isZero(): boolean;
    /**
     * Returns `true` if the value of this FixedPointNumber is less than the value of `that` FixedPointNumber, otherwise returns `false`.
     *
     * @param {FixedPointNumber} that - The FixedPointNumber to compare against.
     *
     * @return {boolean} `true` if the value of this FixedPointNumber is less than the value of `that` FixedPointNumber, otherwise returns `false`.
     *
     * @remarks This method uses {@link comparedTo} internally.
     *
     * @see [bignumber.js isLessThan](https://mikemcl.github.io/bignumber.js/#lt)
     */
    lt(that: FixedPointNumber): boolean;
    /**
     * Returns `true` if the value of this FixedPointNumber is less than or equal to the value of `that` FixedPointNumber,
     * otherwise returns `false`.
     *
     * @param {FixedPointNumber} that - The FixedPointNumber to compare against.
     * @return {boolean} `true` if the value of this FixedPointNumber is less than or equal to the value of `that` FixedPointNumber,
     * otherwise returns `false`.
     *
     * @remarks This method uses {@link comparedTo} internally.
     *
     * @see [bignumber.js isLessThanOrEqualTo](https://mikemcl.github.io/bignumber.js/#lte)
     */
    lte(that: FixedPointNumber): boolean;
    /**
     * Return the maximum between the fixed decimal value of this object and `that` one.
     * If the maximum fixed digits value is less than `minFixedDigits`, return `minFixedDigits`.
     *
     * @param {FixedPointNumber} that to evaluate if `that` has the maximum fixed digits value.
     * @param {bigint} minFixedDigits Min value of returned value.
     *
     * @return the greater fixed digits value among `this`, `that` and `minFixedDigits`.
     */
    private maxFractionalDigits;
    /**
     * Returns a FixedPointNumber whose value is the value of this FixedPointNumber minus `that` FixedPointNumber.
     *
     * Limit cases
     * * NaN - ±n = NaN
     * * ±n - NaN = NaN
     * * -Infinity - -Infinity = NaN
     * * -Infinity - +n = -Infinity
     * * +Infinity - +Infinity = NaN
     * * +Infinity - +n = +Infinity
     *
     * @param {FixedPointNumber} that - The fixed-point number to subtract.
     * @return {FixedPointNumber} The result of the subtraction. The return value is always exact and unrounded.
     *
     * @remarks The precision is the greater of the precision of the two operands.
     *
     * @see [bignumber.js minus](https://mikemcl.github.io/bignumber.js/#minus)
     */
    minus(that: FixedPointNumber): FixedPointNumber;
    /**
     * Returns a FixedPointNumber whose value is the value of this FixedPointNumber modulo `that` FixedPointNumber,
     * i.e. the integer remainder of dividing this FixedPointNumber by `that`.
     *
     * Limit cases
     * * NaN % ±n = NaN
     * * ±n % NaN = NaN
     * * ±Infinity % n = NaN
     * * n % ±Infinity = NaN
     *
     * @param that {FixedPointNumber} - The fixed-point number to divide by.
     * @return {FixedPointNumber} the integer remainder of dividing this FixedPointNumber by `that`.
     *
     * @remarks The precision is the greater of the precision of the two operands.
     *
     * @see [bignumber.js modulo](https://mikemcl.github.io/bignumber.js/#mod)
     */
    modulo(that: FixedPointNumber): FixedPointNumber;
    /**
     * Multiplies two big integer values and divides by a factor of ten raised to a specified power.
     *
     * @param {bigint} multiplicand - The first number to be multiplied.
     * @param {bigint} multiplicator - The second number to be multiplied.
     * @param {bigint} fd - The power of ten by which the product is to be divided.
     *
     * @return {bigint} The result of the multiplication divided by ten raised to the specified power.
     */
    private static mul;
    /**
     * Returns a new instance of FixedPointNumber whose value is the value of this FixedPointNumber value
     * negated, i.e. multiplied by -1.
     *
     * @see [bignumber.js negated](https://mikemcl.github.io/bignumber.js/#neg)
     */
    negated(): FixedPointNumber;
    /**
     * Constructs a new instance of FixedPointNumber (Fixed Point Number) parsing the
     * `exp` numeric expression in base 10 and representing the value with the
     * precision of `decimalPlaces` fractional decimal digits.
     *
     * @param {bigint|number|string} exp - The value to represent.
     * It can be a bigint, number, or string representation of the number.
     * @param {bigint} [decimalPlaces=this.DEFAULT_FRACTIONAL_DECIMALS] - The
     * number of fractional decimal digits to be used to represent the value.
     *
     * @return {FixedPointNumber} A new instance of FixedPointNumber with the given parameters.
     *
     * @throws {InvalidDataType} If `exp` is not a numeric expression.
     */
    static of(exp: bigint | number | string | FixedPointNumber, decimalPlaces?: bigint): FixedPointNumber;
    /**
     * Returns a FixedPointNumber whose value is the value of this FixedPointNumber plus `that` FixedPointNumber.
     *
     * Limit cases
     * * NaN + ±n = NaN
     * * ±n + NaN = NaN
     * * -Infinity + -Infinity = -Infinity
     * * -Infinity + +Infinity = NaN
     * * +Infinity + -Infinity = NaN
     * * +Infinity + +Infinity = +Infinity
     *
     * @param {FixedPointNumber} that - The fixed-point number to add to the current number.
     * @return {FixedPointNumber} The result of the addition. The return value is always exact and unrounded.
     *
     * @remarks The precision is the greater of the precision of the two operands.
     *
     * @see [bignumber.js plus](https://mikemcl.github.io/bignumber.js/#plus)
     */
    plus(that: FixedPointNumber): FixedPointNumber;
    /**
     * Returns a FixedPointNumber whose value is the value of this FixedPointNumber raised to the power of `that` FixedPointNumber.
     *
     * This method implements the
     * [Exponentiation by Squaring](https://en.wikipedia.org/wiki/Exponentiation_by_squaring)
     * algorithm.
     *
     * Limit cases
     * * NaN ^ e = NaN
     * * b ^ NaN = NaN
     * * b ^ -Infinite = 0
     * * b ^ 0 = 1
     * * b ^ +Infinite = +Infinite
     * * ±Infinite ^ -e = 0
     * * ±Infinite ^ +e = +Infinite
     *
     * @param {FixedPointNumber} that - The exponent as a fixed-point number.
     * truncated to its integer component because **Exponentiation by Squaring** is not valid for rational exponents.
     * @return {FixedPointNumber} - The result of raising this fixed-point number to the power of the given exponent.
     *
     * @see [bignumber.js exponentiatedBy](https://mikemcl.github.io/bignumber.js/#pow)
     */
    pow(that: FixedPointNumber): FixedPointNumber;
    /**
     * Computes the square root of a given positive bigint value using a fixed-point iteration method.
     *
     * @param {bigint} value - The positive bigint value for which the square root is to be calculated.
     * @param {bigint} fd - The iteration factor determinant.
     * @return {bigint} The calculated square root of the input bigint value.
     *
     * @throws {RangeError} If the input value is negative.
     */
    private static sqr;
    /**
     * Returns a FixedPointNumber whose value is the square root of the value of this FixedPointNumber
     *
     * Limit cases
     * * NaN = NaN
     * * +Infinite = +Infinite
     * * -n = NaN
     *
     * @return {FixedPointNumber} The square root of the number.
     *
     * @see [bignumber.js sqrt](https://mikemcl.github.io/bignumber.js/#sqrt)
     */
    sqrt(): FixedPointNumber;
    /**
     * Returns a FixedPointNumber whose value is the value of this FixedPointNumber multiplied by `that` FixedPointNumber.
     *
     * Limits cases
     * * NaN * n = NaN
     * * n * NaN = NaN
     * * -Infinite * -n = +Infinite
     * * -Infinite * +n = -Infinite
     * * +Infinite * -n = -Infinite
     * * +Infinite * +n = +Infinite
     *
     * @param {FixedPointNumber} that - The fixed-point number to multiply with this number.
     * @return {FixedPointNumber} a FixedPointNumber whose value is the value of this FixedPointNumber multiplied by `that` FixedPointNumber.
     *
     * @remarks The precision is the greater of the precision of the two operands.
     *
     * @see [bignumber.js multipliedBy](https://mikemcl.github.io/bignumber.js/#times)
     */
    times(that: FixedPointNumber): FixedPointNumber;
    /**
     * Converts the fixed-point number to its string representation.
     *
     * @param {string} [decimalSeparator='.'] - The character to use as the decimal separator in the string representation. Default is '.'.
     * @return {string} A string representation of the fixed-point number.
     */
    toString(decimalSeparator?: string): string;
    /**
     * Trims the specified trailing substring from the end of the input string recursively.
     *
     * @param {string} str - The input string to be trimmed.
     * @param {string} [sub='0'] - The substring to be removed from the end of the input string. Defaults to '0' if not provided.
     * @return {string} The trimmed string with the specified trailing substring removed.
     */
    private static trimEnd;
    /**
     * Converts a string expression of a number into a scaled value.
     *
     * @param {string} exp - The string expression of the number to be converted.
     * @param {bigint} fd - The scale factor to be used for conversion.
     * @param {string} [decimalSeparator='.'] - The character used as the decimal separator in the string expression.
     * @return {bigint} - The converted scaled value as a bigint.
     */
    private static txtToSV;
}
export { FixedPointNumber };
//# sourceMappingURL=FixedPointNumber.d.ts.map