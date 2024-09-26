import { InvalidDataType, InvalidOperation } from '@vechain/sdk-errors';
import { type VeChainDataModel } from './VeChainDataModel';
import { Txt } from './Txt';

class FixedPointNumber implements VeChainDataModel<FixedPointNumber> {
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
     * @remarks {@link fd} and {@link sv} not meaningful.
     *
     * @see [Number.NaN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/NaN)
     *
     */
    public static readonly NaN = new FixedPointNumber(0n, 0n, NaN);

    /**
     * The negative Infinity value.
     *
     * @remarks {@link fd} and {@link sv} not meaningful.
     *
     * @see [Number.NEGATIVE_INFINITY](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/NEGATIVE_INFINITY)
     */
    public static readonly NEGATIVE_INFINITY = new FixedPointNumber(
        0n,
        0n,
        Number.NEGATIVE_INFINITY
    );

    /**
     * The positive Infinite value.
     *
     * @remarks {@link fd} and {@link sv} not meaningful.
     *
     * @see [Number.POSITIVE_INFINITY](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/POSITIVE_INFINITY)
     */
    public static readonly POSITIVE_INFINITY = new FixedPointNumber(
        0n,
        0n,
        Number.POSITIVE_INFINITY
    );

    /**
     * Regular expression pattern for matching integers expressed as base 10 strings.
     */
    private static readonly REGEX_INTEGER: RegExp = /^[-+]?\d+$/;

    /**
     * Regular expression for matching numeric values expressed as base 10 strings.
     */
    private static readonly REGEX_NUMBER =
        /(^[-+]?\d+(\.\d+)?)$|(^[-+]?\.\d+)$/;

    /**
     * Regular expression pattern for matching natural numbers expressed as base 10 strings.
     */
    private static readonly REGEX_NATURAL: RegExp = /^\d+$/;

    /**
     * Represents the zero constant.
     */
    public static readonly ZERO = new FixedPointNumber(0n, 0n, 0);

    /**
     * Edge Flag denotes the {@link NaN} or {@link NEGATIVE_INFINITY} or {@link POSITIVE_INFINITY} value.
     *
     * @remarks If `ef` is not zero, {@link fd} and {@link sv} are not meaningful.
     */
    protected readonly ef: number;

    /**
     * Fractional Digits or decimal places.
     */
    protected readonly fd: bigint;

    /**
     * Scaled Value = value * 10 ^ {@link fd}.
     */
    public readonly sv: bigint;

    /**
     * Returns the integer part of this FixedPointNumber value.
     *
     * @return {bigint} the integer part of this FixedPointNumber value.
     *
     * @throws {InvalidOperation} If the value is not finite.
     */
    get bi(): bigint {
        if (this.isFinite()) {
            return this.sv / 10n ** this.fd;
        }
        throw new InvalidOperation(
            'FixedPointNumber.bi',
            'not finite value cannot cast to big integer',
            { this: this.toString() }
        );
    }

    /**
     * Returns the array of bytes representing the *Normalization Form Canonical Composition*
     * [Unicode Equivalence](https://en.wikipedia.org/wiki/Unicode_equivalence)
     * of this value expressed in decimal base.
     */
    get bytes(): Uint8Array {
        return Txt.of(this.toString()).bytes;
    }

    /**
     * Return this value approximated as {@link number}.
     */
    get n(): number {
        if (this.isNaN()) return Number.NaN;
        if (this.isNegativeInfinite()) return Number.NEGATIVE_INFINITY;
        if (this.isPositiveInfinite()) return Number.POSITIVE_INFINITY;
        if (this.isZero()) return 0;
        return Number(this.sv) * 10 ** -Number(this.fd);
    }

    /**
     * Returns the new Fixed-Point Number (FixedPointNumber) instance having
     *
     * @param {bigint} fd - Number of Fractional Digits (or decimal places).
     * @param {bigint} sv - Scaled Value.
     * @param {number} [ef=0] - Edge Flag.
     */
    protected constructor(fd: bigint, sv: bigint, ef: number = 0) {
        this.fd = fd;
        this.ef = ef;
        this.sv = sv;
    }

    /**
     * Returns a FixedPointNumber whose value is the absolute value, i.e. the magnitude, of the value of this FixedPointNumber.
     *
     * @return {FixedPointNumber} the absolute value of this FixedPointNumber.
     *
     * @see [bignumber.js absoluteValue](https://mikemcl.github.io/bignumber.js/#abs)
     */
    public abs(): FixedPointNumber {
        if (this.isNaN()) return FixedPointNumber.NaN;
        if (this.isNegativeInfinite())
            return FixedPointNumber.POSITIVE_INFINITY;
        return new FixedPointNumber(
            this.fd,
            this.sv < 0n ? -this.sv : this.sv,
            this.ef
        );
    }

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
    public compareTo(that: FixedPointNumber): number {
        if (this.isNaN() || that.isNaN())
            throw new InvalidOperation(
                'FixedPointNumber.compareTo',
                'compare between NaN',
                {
                    this: `${this}`,
                    that: `${that}`
                }
            );
        if (this.isNegativeInfinite())
            return that.isNegativeInfinite() ? 0 : -1;
        if (this.isPositiveInfinite()) return that.isPositiveInfinite() ? 0 : 1;
        if (that.isNegativeInfinite()) return 1;
        if (that.isPositiveInfinite()) return -1;
        const fd = this.fd > that.fd ? this.fd : that.fd; // Max common fractional decimals.
        const delta = this.dp(fd).sv - that.dp(fd).sv;
        return delta < 0n ? -1 : delta === 0n ? 0 : 1;
    }

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
    public comparedTo(that: FixedPointNumber): null | number {
        try {
            return this.compareTo(that);
            //  eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            return null;
        }
    }

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
    public div(that: FixedPointNumber): FixedPointNumber {
        if (this.isNaN() || that.isNaN()) return FixedPointNumber.NaN;
        if (this.isNegativeInfinite())
            return that.isInfinite()
                ? FixedPointNumber.NaN
                : that.isPositive()
                  ? FixedPointNumber.NEGATIVE_INFINITY
                  : FixedPointNumber.POSITIVE_INFINITY;
        if (this.isPositiveInfinite())
            return that.isInfinite()
                ? FixedPointNumber.NaN
                : that.isPositive()
                  ? FixedPointNumber.POSITIVE_INFINITY
                  : FixedPointNumber.NEGATIVE_INFINITY;
        if (that.isInfinite()) return FixedPointNumber.ZERO;
        if (that.isZero())
            return this.isZero()
                ? FixedPointNumber.NaN
                : this.isNegative()
                  ? FixedPointNumber.NEGATIVE_INFINITY
                  : FixedPointNumber.POSITIVE_INFINITY;
        const fd = this.fd > that.fd ? this.fd : that.fd; // Max common fractional decimals.
        return new FixedPointNumber(
            fd,
            FixedPointNumber.div(fd, this.dp(fd).sv, that.dp(fd).sv)
        );
    }

    /**
     * Divides the given dividend by the given divisor, adjusted by a factor based on fd.
     *
     * @param {bigint} fd - The factor determining the power of 10 to apply to the dividend.
     * @param {bigint} dividend - The number to be divided.
     * @param {bigint} divisor - The number by which to divide the dividend.
     *
     * @return {bigint} - The result of the division, adjusted by the given factor fd.
     */
    private static div(fd: bigint, dividend: bigint, divisor: bigint): bigint {
        return (10n ** fd * dividend) / divisor;
    }

    /**
     * Adjusts the precision of the floating-point number by the specified
     * number of decimal places.
     *
     * @param {bigint | number} decimalPlaces - The number of decimal places to adjust to.
     * @return {FixedPointNumber} A new FixedPointNumber instance with the adjusted precision.
     */
    public dp(decimalPlaces: bigint | number): FixedPointNumber {
        const fp = BigInt(decimalPlaces);
        const dd = fp - this.fd; // Fractional Decimals Difference.
        if (dd < 0) {
            return new FixedPointNumber(fp, this.sv / 10n ** -dd);
        } else {
            return new FixedPointNumber(fp, this.sv * 10n ** dd);
        }
    }

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
    public eq(that: FixedPointNumber): boolean {
        return this.comparedTo(that) === 0;
    }

    /**
     * Returns `true` if the value of this FixedPointNumber is greater than `that` FixedPointNumber`, otherwise returns `false`.
     *
     * @param {FixedPointNumber} - that The FixedPointNumber to compare against.
     * @return {boolean} `true` if this FixedPointNumber is greater than `that` FixedPointNumber, otherwise `false`.
     *
     * @remarks This method uses {@link comparedTo} internally.
     *
     * @see [bignummber.js isGreaterThan](https://mikemcl.github.io/bignumber.js/#gt)
     */
    public gt(that: FixedPointNumber): boolean {
        const cmp = this.comparedTo(that);
        return cmp !== null && cmp > 0;
    }

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
    public gte(that: FixedPointNumber): boolean {
        const cmp = this.comparedTo(that);
        return cmp !== null && cmp >= 0;
    }

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
    public idiv(that: FixedPointNumber): FixedPointNumber {
        if (this.isNaN() || that.isNaN()) return FixedPointNumber.NaN;
        if (this.isNegativeInfinite())
            return that.isInfinite()
                ? FixedPointNumber.NaN
                : that.isPositive()
                  ? FixedPointNumber.NEGATIVE_INFINITY
                  : FixedPointNumber.POSITIVE_INFINITY;
        if (this.isPositiveInfinite())
            return that.isInfinite()
                ? FixedPointNumber.NaN
                : that.isPositive()
                  ? FixedPointNumber.POSITIVE_INFINITY
                  : FixedPointNumber.NEGATIVE_INFINITY;
        if (that.isInfinite()) return FixedPointNumber.ZERO;
        if (that.isZero())
            return this.isZero()
                ? FixedPointNumber.NaN
                : this.isNegative()
                  ? FixedPointNumber.NEGATIVE_INFINITY
                  : FixedPointNumber.POSITIVE_INFINITY;
        const fd = this.fd > that.fd ? this.fd : that.fd; // Max common fractional decimals.
        return new FixedPointNumber(
            fd,
            FixedPointNumber.idiv(fd, this.dp(fd).sv, that.dp(fd).sv)
        );
    }

    /**
     * Performs integer division on two big integers and scales the result by a factor of 10 raised to the power of fd.
     *
     * @param {bigint} fd - The power to which 10 is raised to scale the result.
     * @param {bigint} dividend - The number to be divided.
     * @param {bigint} divisor - The number by which dividend is divided.
     * @return {bigint} - The scaled result of the integer division.
     */
    private static idiv(fd: bigint, dividend: bigint, divisor: bigint): bigint {
        return (dividend / divisor) * 10n ** fd;
    }

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
    public isEqual(that: FixedPointNumber): boolean {
        return this.eq(that);
    }

    /**
     * Returns `true` if the value of this FixedPointNumber is a finite number, otherwise returns `false`.
     *
     * The only possible non-finite values of a FixedPointNumber are {@link NaN}, {@link NEGATIVE_INFINITY} and {@link POSITIVE_INFINITY}.
     *
     * @return `true` if the value of this FixedPointNumber is a finite number, otherwise returns `false`.
     *
     * @see [bignumber.js isFinite](https://mikemcl.github.io/bignumber.js/#isF)
     */
    public isFinite(): boolean {
        return this.ef === 0;
    }

    /**
     * Return `true` if the value of this FixedPointNumber is {@link NEGATIVE_INFINITY} and {@link POSITIVE_INFINITY},
     * otherwise returns false.
     *
     * @return true` if the value of this FixedPointNumber is {@link NEGATIVE_INFINITY} and {@link POSITIVE_INFINITY},
     */
    public isInfinite(): boolean {
        return this.isNegativeInfinite() || this.isPositiveInfinite();
    }

    /**
     * Returns `true` if the value of this FixedPointNumber is an integer,
     * otherwise returns `false`.
     *
     * @return `true` if the value of this FixedPointNumber is an integer.
     *
     * @see [bignumber.js isInteger](https://mikemcl.github.io/bignumber.js/#isInt)
     */
    public isInteger(): boolean {
        if (this.isFinite()) {
            return this.sv % 10n ** this.fd === 0n;
        }
        return false;
    }

    /**
     * Checks if a given string expression is an integer in base 10 notation,
     * considering `-` for negative and `+` optional for positive values.
     *
     * @param {string} exp - The string expression to be tested.
     *
     * @return {boolean} `true` if the expression is an integer,
     * `false` otherwise.
     */
    public static isIntegerExpression(exp: string): boolean {
        return this.REGEX_INTEGER.test(exp);
    }

    /**
     *  Returns `true` if the value of this FixedPointNumber is `NaN`, otherwise returns `false`.
     *
     *  @return `true` if the value of this FixedPointNumber is `NaN`, otherwise returns `false`.
     *
     *  @see [bignumber.js isNaN](https://mikemcl.github.io/bignumber.js/#isNaN)
     */
    public isNaN(): boolean {
        return Number.isNaN(this.ef);
    }

    /**
     * Checks if a given string expression is a natural (unsigned positive integer)
     * number in base 10 notation.
     *
     * @param {string} exp - The string expression to be tested.
     *
     * @return {boolean} `true` if the expression is a natural number,
     * `false` otherwise.
     */
    public static isNaturalExpression(exp: string): boolean {
        return this.REGEX_NATURAL.test(exp);
    }

    /**
     * Returns `true` if the sign of this FixedPointNumber is negative, otherwise returns `false`.
     *
     * @return `true` if the sign of this FixedPointNumber is negative, otherwise returns `false`.
     *
     * @see [bignumber.js isNegative](https://mikemcl.github.io/bignumber.js/#isNeg)
     */
    public isNegative(): boolean {
        return (this.isFinite() && this.sv < 0n) || this.isNegativeInfinite();
    }

    /**
     * Returns `true` if this FixedPointNumber value is {@link NEGATIVE_INFINITY}, otherwise returns `false`.
     */
    public isNegativeInfinite(): boolean {
        return this.ef === Number.NEGATIVE_INFINITY;
    }

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
    public static isNumberExpression(exp: string): boolean {
        return FixedPointNumber.REGEX_NUMBER.test(exp);
    }

    /**
     * Returns `true` if the sign of this FixedPointNumber is positive, otherwise returns `false`.
     *
     * @return `true` if the sign of this FixedPointNumber is positive, otherwise returns `false`.
     *
     * @see [bignumber.js isPositive](https://mikemcl.github.io/bignumber.js/#isPos)
     */
    public isPositive(): boolean {
        return (this.isFinite() && this.sv >= 0n) || this.isPositiveInfinite();
    }

    /**
     * Returns `true` if this FixedPointNumber value is {@link POSITIVE_INFINITY}, otherwise returns `false`.
     *
     * @return `true` if this FixedPointNumber value is {@link POSITIVE_INFINITY}, otherwise returns `false`.
     */
    public isPositiveInfinite(): boolean {
        return this.ef === Number.POSITIVE_INFINITY;
    }

    /**
     * Returns `true` if the value of this FixedPointNumber is zero or minus zero, otherwise returns `false`.
     *
     * @return `true` if the value of this FixedPointNumber is zero or minus zero, otherwise returns `false`.
     *
     * [see bignumber.js isZero](https://mikemcl.github.io/bignumber.js/#isZ)
     */
    public isZero(): boolean {
        return this.isFinite() && this.sv === 0n;
    }

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
    public lt(that: FixedPointNumber): boolean {
        const cmp = this.comparedTo(that);
        return cmp !== null && cmp < 0;
    }

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
    public lte(that: FixedPointNumber): boolean {
        const cmp = this.comparedTo(that);
        return cmp !== null && cmp <= 0;
    }

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
    public minus(that: FixedPointNumber): FixedPointNumber {
        if (this.isNaN() || that.isNaN()) return FixedPointNumber.NaN;
        if (this.isNegativeInfinite())
            return that.isNegativeInfinite()
                ? FixedPointNumber.NaN
                : FixedPointNumber.NEGATIVE_INFINITY;
        if (this.isPositiveInfinite())
            return that.isPositiveInfinite()
                ? FixedPointNumber.NaN
                : FixedPointNumber.POSITIVE_INFINITY;
        const fd = this.fd > that.fd ? this.fd : that.fd; // Max common fractional decimals.
        return new FixedPointNumber(fd, this.dp(fd).sv - that.dp(fd).sv);
    }

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
    public modulo(that: FixedPointNumber): FixedPointNumber {
        if (this.isNaN() || that.isNaN()) return FixedPointNumber.NaN;
        if (this.isInfinite() || that.isInfinite()) return FixedPointNumber.NaN;
        if (that.isZero()) return FixedPointNumber.NaN;
        const fd = this.fd > that.fd ? this.fd : that.fd; // Max common fractional decimals.
        let modulo = this.abs().dp(fd).sv;
        const divisor = that.abs().dp(fd).sv;
        while (modulo >= divisor) {
            modulo -= divisor;
        }
        return new FixedPointNumber(fd, modulo);
    }

    /**
     * Multiplies two big integer values and divides by a factor of ten raised to a specified power.
     *
     * @param {bigint} multiplicand - The first number to be multiplied.
     * @param {bigint} multiplicator - The second number to be multiplied.
     * @param {bigint} fd - The power of ten by which the product is to be divided.
     *
     * @return {bigint} The result of the multiplication divided by ten raised to the specified power.
     */
    private static mul(
        multiplicand: bigint,
        multiplicator: bigint,
        fd: bigint
    ): bigint {
        return (multiplicand * multiplicator) / 10n ** fd;
    }

    /**
     * Returns a new instance of FixedPointNumber whose value is the value of this FixedPointNumber value
     * negated, i.e. multiplied by -1.
     *
     * @see [bignumber.js negated](https://mikemcl.github.io/bignumber.js/#neg)
     */
    public negated(): FixedPointNumber {
        if (this.isNegativeInfinite())
            return FixedPointNumber.POSITIVE_INFINITY;
        if (this.isPositiveInfinite())
            return FixedPointNumber.NEGATIVE_INFINITY;
        return new FixedPointNumber(this.fd, -this.sv, this.ef);
    }

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
    public static of(
        exp: bigint | number | string,
        decimalPlaces: bigint = this.DEFAULT_FRACTIONAL_DECIMALS
    ): FixedPointNumber {
        try {
            if (Number.isNaN(exp))
                return new FixedPointNumber(decimalPlaces, 0n, Number.NaN);
            if (exp === Number.NEGATIVE_INFINITY)
                return new FixedPointNumber(
                    decimalPlaces,
                    -1n,
                    Number.NEGATIVE_INFINITY
                );
            if (exp === Number.POSITIVE_INFINITY)
                return new FixedPointNumber(
                    decimalPlaces,
                    1n,
                    Number.POSITIVE_INFINITY
                );
            return new FixedPointNumber(
                decimalPlaces,
                this.txtToSV(exp.toString(), decimalPlaces)
            );
        } catch (e) {
            throw new InvalidDataType(
                'FixedPointNumber.of',
                'not a number',
                { exp },
                e
            );
        }
    }

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
    public plus(that: FixedPointNumber): FixedPointNumber {
        if (this.isNaN() || that.isNaN()) return FixedPointNumber.NaN;
        if (this.isNegativeInfinite())
            return that.isPositiveInfinite()
                ? FixedPointNumber.NaN
                : FixedPointNumber.NEGATIVE_INFINITY;
        if (this.isPositiveInfinite())
            return that.isNegativeInfinite()
                ? FixedPointNumber.NaN
                : FixedPointNumber.POSITIVE_INFINITY;
        const fd = this.fd > that.fd ? this.fd : that.fd; // Max common fractional decimals.
        return new FixedPointNumber(fd, this.dp(fd).sv + that.dp(fd).sv);
    }

    /**
     * Returns a FixedPointNumber whose value is the value of this FixedPointNumber raised to the power of `that` FixedPointNumber.
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
     * It can be negative, it can be not an integer value
     * ([bignumber.js pow](https://mikemcl.github.io/bignumber.js/#pow)
     * doesn't support not integer exponents).
     * @return {FixedPointNumber} - The result of raising this fixed-point number to the power of the given exponent.
     *
     * @remarks The precision is the greater of the precision of the two operands.
     * @remarks In fixed-precision math, the comparisons between powers of operands having different fractional
     * precision can lead to differences.
     *
     * @see [bignumber.js exponentiatedBy](https://mikemcl.github.io/bignumber.js/#pow)
     */
    public pow(that: FixedPointNumber): FixedPointNumber {
        if (this.isNaN() || that.isNaN()) return FixedPointNumber.NaN;
        if (this.isInfinite())
            return that.isZero()
                ? FixedPointNumber.of(1)
                : that.isNegative()
                  ? FixedPointNumber.ZERO
                  : FixedPointNumber.POSITIVE_INFINITY;
        if (that.isNegativeInfinite()) return FixedPointNumber.ZERO;
        if (that.isPositiveInfinite())
            return FixedPointNumber.POSITIVE_INFINITY;
        const fd = this.fd > that.fd ? this.fd : that.fd; // Max common fractional decimals.
        return new FixedPointNumber(
            fd,
            FixedPointNumber.pow(fd, this.dp(fd).sv, that.dp(fd).sv)
        );
    }

    /**
     * Computes the power of a given base raised to a specified exponent.
     *
     * @param {bigint} fd - The scale factor for decimal precision.
     * @param {bigint} base - The base number to be raised to the power.
     * @param {bigint} exponent - The exponent to which the base should be raised.
     * @return {bigint} The result of base raised to the power of exponent, scaled by the scale factor.
     */
    private static pow(fd: bigint, base: bigint, exponent: bigint): bigint {
        const sf = 10n ** fd; // Scale factor.
        if (exponent < 0n) {
            return FixedPointNumber.pow(
                fd,
                FixedPointNumber.div(fd, sf, base),
                -exponent
            ); // Recursive.
        }
        if (exponent === 0n) {
            return 1n * sf;
        }
        if (exponent === sf) {
            return base;
        }
        return FixedPointNumber.pow(
            fd,
            this.mul(base, base, fd),
            exponent - sf
        ); // Recursive.
    }

    /**
     * Computes the square root of a given positive bigint value using a fixed-point iteration method.
     *
     * @param {bigint} value - The positive bigint value for which the square root is to be calculated.
     * @param {bigint} fd - The iteration factor determinant.
     * @return {bigint} The calculated square root of the input bigint value.
     *
     * @throws {RangeError} If the input value is negative.
     */
    private static sqr(value: bigint, fd: bigint): bigint {
        if (value < 0n) {
            throw new RangeError(`Value must be positive`);
        }
        const sf = fd * 10n; // Scale Factor.
        let iteration = 0;
        let actualResult = value;
        let storedResult = 0n;
        while (actualResult !== storedResult && iteration < sf) {
            storedResult = actualResult;
            actualResult =
                (actualResult + FixedPointNumber.div(fd, value, actualResult)) /
                2n;
            iteration++;
        }
        return actualResult;
    }

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
    public sqrt(): FixedPointNumber {
        if (this.isNaN()) return FixedPointNumber.NaN;
        if (this.isNegativeInfinite()) return FixedPointNumber.NaN;
        if (this.isPositiveInfinite())
            return FixedPointNumber.POSITIVE_INFINITY;
        try {
            return new FixedPointNumber(
                this.fd,
                FixedPointNumber.sqr(this.sv, this.fd)
            );
            //  eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            return FixedPointNumber.NaN;
        }
    }

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
    public times(that: FixedPointNumber): FixedPointNumber {
        if (this.isNaN() || that.isNaN()) return FixedPointNumber.NaN;
        if (this.isNegativeInfinite())
            return that.isNegative()
                ? FixedPointNumber.POSITIVE_INFINITY
                : FixedPointNumber.NEGATIVE_INFINITY;
        if (this.isPositiveInfinite())
            return that.isNegative()
                ? FixedPointNumber.NEGATIVE_INFINITY
                : FixedPointNumber.POSITIVE_INFINITY;
        const fd = this.fd > that.fd ? this.fd : that.fd; // Max common fractional decimals.
        return new FixedPointNumber(
            fd,
            FixedPointNumber.mul(this.dp(fd).sv, that.dp(fd).sv, fd)
        );
    }

    /**
     * Converts the fixed-point number to its string representation.
     *
     * @param {string} [decimalSeparator='.'] - The character to use as the decimal separator in the string representation. Default is '.'.
     * @return {string} A string representation of the fixed-point number.
     */
    public toString(decimalSeparator = '.'): string {
        if (this.ef === 0) {
            const sign = this.sv < 0n ? '-' : '';
            const digits =
                this.sv < 0n ? (-this.sv).toString() : this.sv.toString();
            const padded = digits.padStart(Number(this.fd), '0');
            const decimals = this.fd > 0 ? padded.slice(Number(-this.fd)) : '';
            const integers = padded.slice(0, padded.length - decimals.length);
            const integersShow = integers.length < 1 ? '0' : integers;
            const decimalsShow = FixedPointNumber.trimEnd(decimals);
            return (
                sign +
                integersShow +
                (decimalsShow.length > 0 ? decimalSeparator + decimalsShow : '')
            );
        }
        return this.ef.toString();
    }

    /**
     * Trims the specified trailing substring from the end of the input string recursively.
     *
     * @param {string} str - The input string to be trimmed.
     * @param {string} [sub='0'] - The substring to be removed from the end of the input string. Defaults to '0' if not provided.
     * @return {string} The trimmed string with the specified trailing substring removed.
     */
    private static trimEnd(str: string, sub: string = '0'): string {
        // Check if the input string ends with the trailing substring
        if (str.endsWith(sub)) {
            // Remove the trailing substring recursively.
            return FixedPointNumber.trimEnd(
                str.substring(0, str.length - sub.length),
                sub
            );
        }
        return str;
    }

    /**
     * Converts a string expression of a number into a scaled value.
     *
     * @param {string} exp - The string expression of the number to be converted.
     * @param {bigint} fd - The scale factor to be used for conversion.
     * @param {string} [decimalSeparator='.'] - The character used as the decimal separator in the string expression.
     * @return {bigint} - The converted scaled value as a bigint.
     */
    private static txtToSV(
        exp: string,
        fd: bigint,
        decimalSeparator = '.'
    ): bigint {
        const fc = exp.charAt(0); // First Character.
        let sign = 1n;
        if (fc === '-') {
            sign = -1n;
            exp = exp.substring(1);
        } else if (fc === '+') {
            exp = exp.substring(1);
        }
        const sf = 10n ** fd; // Scale Factor.
        const di = exp.lastIndexOf(decimalSeparator); // Decimal Index.
        if (di < 0) {
            return sign * sf * BigInt(exp); // Signed Integer.
        }
        const ie = exp.substring(0, di); // Integer Expression.
        const fe = exp.substring(di + 1); // Fractional Expression.
        return (
            sign * sf * BigInt(ie) + // Integer part
            (sign * (sf * BigInt(fe))) / BigInt(10 ** fe.length) // Fractional part.
        );
    }
}

export { FixedPointNumber };
