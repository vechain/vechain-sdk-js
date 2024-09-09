import { InvalidOperation } from '@vechain/sdk-errors';
import { type VeChainDataModel } from './VeChainDataModel';
import { Txt } from './Txt';

class FPN implements VeChainDataModel<FPN> {
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
    public static readonly NaN = new FPN(0n, 0n, NaN);

    /**
     * The negative Infinity value.
     *
     * @remarks {@link fd} and {@link sv} not meaningful.
     *
     * @see [Number.NEGATIVE_INFINITY](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/NEGATIVE_INFINITY)
     */
    public static readonly NEGATIVE_INFINITY = new FPN(
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
    public static readonly POSITIVE_INFINITY = new FPN(
        0n,
        0n,
        Number.POSITIVE_INFINITY
    );

    /**
     * Regular expression pattern for matching integers expressed as base 10 strings.
     *
     * @type {RegExp}
     * @constant
     */
    private static readonly REGEX_INTEGER: RegExp = /^[-+]?\d+$/;

    /**
     * Regular expression for matching numeric values expressed as base 10 strings.
     *
     * @constant {RegExp} NUMERIC_REGEX
     */
    private static readonly REGEX_NUMBER =
        /(^[-+]?\d+(\.\d+)?)$|(^[-+]?\.\d+)$/;

    /**
     * Regular expression pattern for matching natural numbers expressed as base 10 strings.
     *
     * @type {RegExp}
     * @constant
     */
    private static readonly REGEX_NATURAL: RegExp = /^\d+$/;

    /**
     * Represents the zero constant.
     */
    public static readonly ZERO = new FPN(0n, 0n, 0);

    /**
     * Edge Flag denotes the {@link NaN} or {@link NEGATIVE_INFINITY} or {@link POSITIVE_INFINITY} value.
     *
     * @remarks If `ef` is not zero, {@link fd} and {@link sv} are not meaningful.
     *
     * @private
     */
    private readonly ef: number;

    /**
     * Fractional Digits or decimal places.
     * @private
     */
    private readonly fd: bigint;

    /**
     * Scaled Value = value * 10 ^ {@link fd}.
     * @private
     */
    private readonly sv: bigint;

    /**
     * Returns the integer part of this FPN value.
     *
     * @return {bigint} the integer part of this FPN value.
     *
     * @throws {InvalidOperation} If the value is not finite.
     */
    get bi(): bigint {
        if (this.isFinite()) {
            return this.sv / 10n ** this.fd;
        }
        throw new InvalidOperation(
            'FPN.bi',
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
     * Returns the new Fixed-Point Number (FPN) instance having
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
     * Returns a FPN whose value is the absolute value, i.e. the magnitude, of the value of this FPN.
     *
     * @return {FPN} the absolute value of this FPN.
     *
     * @see [bignumber.js absoluteValue](https://mikemcl.github.io/bignumber.js/#abs)
     */
    public abs(): FPN {
        return new FPN(this.fd, this.sv < 0n ? -this.sv : this.sv);
    }

    /**
     * Compares this instance with `that` FPN instance.
     * * Returns 0 if this is equal to `that` FPN, including infinite with equal sign;
     * * Returns -1, if this is -Infinite or less than `that` FPN;,
     * * Returns 1 if this is +Infinite or greater than `that` FPN.
     *
     * @param {FPN} that - The instance to compare with this instance.
     *
     * @return {number} Returns -1, 0, or 1 if this instance is less than, equal to, or greater
     * than the specified instance, respectively.
     *
     * @throw InvalidOperation If this or `that` FPN is {@link NaN}.
     *
     * @see [bignumber.js comparedTo](https://mikemcl.github.io/bignumber.js/#cmp)
     */
    public compareTo(that: FPN): number {
        if (this.isNaN() || that.isNaN())
            throw new InvalidOperation('FPN.compareTo', 'compare between NaN', {
                this: `${this}`,
                that: `${that}`
            });
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
     * Compares this instance with `that` FPN instance.
     * * **Returns `null` if either instance is NaN;**
     * * Returns 0 if this is equal to `that` FPN, including infinite with equal sign;
     * * Returns -1, if this is -Infinite or less than `that` FPN;,
     * * Returns 1 if this is +Infinite or greater than `that` FPN.
     *
     * @param {FPN} that - The instance to compare with this instance.
     *
     * @return {null | number} A null if either instance is NaN;
     * -1, 0, or 1 if this instance is less than, equal to, or greater
     * than the specified instance, respectively.
     *
     * @remarks This method uses internally {@link compareTo} wrapping the {@link InvalidOperation} exception
     * when comparing between {@link NaN} values to behave according the
     * [[bignumber.js comparedTo](https://mikemcl.github.io/bignumber.js/#cmp)] rules.
     */
    public comparedTo(that: FPN): null | number {
        try {
            return this.compareTo(that);
        } catch (e) {
            return null;
        }
    }

    /**
     * Returns a FPN whose value is the value of this FPN divided by `that` FPN.
     *
     * Limit cases
     * * 0 / 0 = NaN
     * * NaN / ±n = NaN
     * * +n / NaN = NaN
     * * +n / ±Infinity = 0
     * * -n / 0 = -Infinity
     * * +n / 0 = +Infinity
     *
     * @param {FPN} that - The fixed-point number to divide by.
     *
     * @return {FPN} The result of the division.
     *
     * @remarks The precision is the greater of the precision of the two operands.
     *
     * @see [bignumber.js dividedBy](https://mikemcl.github.io/bignumber.js/#div)
     */
    public div(that: FPN): FPN {
        if (this.isNaN() || that.isNaN()) return FPN.NaN;
        if (that.isInfinite()) return FPN.ZERO;
        if (that.isZero())
            return this.isZero()
                ? FPN.NaN
                : this.isNegative()
                  ? FPN.NEGATIVE_INFINITY
                  : FPN.POSITIVE_INFINITY;
        const fd = this.fd > that.fd ? this.fd : that.fd; // Max common fractional decimals.
        return new FPN(fd, FPN.div(fd, this.dp(fd).sv, that.dp(fd).sv));
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
     *
     * @return {FPN} A new FPN instance with the adjusted precision.
     */
    public dp(decimalPlaces: bigint | number): FPN {
        const fp = BigInt(decimalPlaces);
        const dd = fp - this.fd; // Fractional Decimals Difference.
        if (dd < 0) {
            return new FPN(fp, this.sv / 10n ** -dd);
        } else {
            return new FPN(fp, this.sv * 10n ** dd);
        }
    }

    /**
     * Returns `true `if the value of thisFPN is equal to the value of `that` FPN, otherwise returns `false`.
     *
     * As with JavaScript, `NaN` does not equal `NaN`.
     *
     * @param {FPN} that - The FPN to compare against.
     *
     * @return {boolean} `true` if the FPN numbers are equal, otherwise `false`.
     *
     * @remarks This method uses {@link comparedTo} internally.
     *
     * @see [bigbumber.js isEqualTo](https://mikemcl.github.io/bignumber.js/#eq)
     */
    public eq(that: FPN): boolean {
        return this.comparedTo(that) === 0;
    }

    /**
     * Returns `true` if the value of this FPN is greater than `that` FPN`, otherwise returns `false`.
     *
     * @param {FPN} that - The FPN to compare against.
     *
     * @return {boolean} `true` if this FPN is greater than `that` FPN, otherwise `false`.
     *
     * @remarks This method uses {@link comparedTo} internally.
     *
     * @see [bignummber.js isGreaterThan](https://mikemcl.github.io/bignumber.js/#gt)
     */
    public gt(that: FPN): boolean {
        const cmp = this.comparedTo(that);
        return cmp !== null && cmp > 0;
    }

    /**
     * Returns `true` if the value of this FPN is greater or equal than `that` FPN`, otherwise returns `false`.
     *
     * @param {FPN} that - The FPN to compare against.
     *
     * @return {boolean} `true` if this FPN is greater or equal than `that` FPN, otherwise `false`.
     *
     * @remarks This method uses {@link comparedTo} internally.
     *
     * @see [bignumber.js isGreaterThanOrEqualTo](https://mikemcl.github.io/bignumber.js/#gte)
     */
    public gte(that: FPN): boolean {
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
     * * +n / NaN = NaN
     * * +n / ±Infinite = 0
     * * -n / 0 = -Infinite
     * * +n / 0 = +Infinite
     *
     * @param {FPN} that - The fixed-point number to divide by.
     *
     * @return {FPN} The result of the division.
     *
     * @remarks The precision is the greater of the precision of the two operands.
     *
     * @see [bignumber.js dividedToIntegerBy](https://mikemcl.github.io/bignumber.js/#divInt)
     */
    public idiv(that: FPN): FPN {
        if (this.isNaN() || that.isNaN()) return FPN.NaN;
        if (that.isInfinite()) return FPN.ZERO;
        if (that.isZero())
            return this.isZero()
                ? FPN.NaN
                : this.isNegative()
                  ? FPN.NEGATIVE_INFINITY
                  : FPN.POSITIVE_INFINITY;
        const fd = this.fd > that.fd ? this.fd : that.fd; // Max common fractional decimals.
        return new FPN(fd, FPN.idiv(fd, this.dp(fd).sv, that.dp(fd).sv));
    }

    /**
     * Performs integer division on two big integers and scales the result by a factor of 10 raised to the power of fd.
     *
     * @param {bigint} fd - The power to which 10 is raised to scale the result.
     * @param {bigint} dividend - The number to be divided.
     * @param {bigint} divisor - The number by which dividend is divided.
     *
     * @return {bigint} - The scaled result of the integer division.
     */
    private static idiv(fd: bigint, dividend: bigint, divisor: bigint): bigint {
        return (dividend / divisor) * 10n ** fd;
    }

    /**
     * Returns `true `if the value of thisFPN is equal to the value of `that` FPN, otherwise returns `false`.
     *
     * As with JavaScript, `NaN` does not equal `NaN`.
     *
     * @param {FPN} that - The FPN to compare against.
     *
     * @return {boolean} `true` if the FPN numbers are equal, otherwise `false`.
     *
     * @remarks This method uses {@link eq} internally.
     */
    public isEqual(that: FPN): boolean {
        return this.eq(that);
    }

    /**
     * Returns `true` if the value of this FPN is a finite number, otherwise returns `false`.
     *
     * The only possible non-finite values of a FPN are {@link NaN}, {@link NEGATIVE_INFINITY} and {@link POSITIVE_INFINITY}.
     *
     * @return `true` if the value of this FPN is a finite number, otherwise returns `false`.
     *
     * @see [bignumber.js isFinite](https://mikemcl.github.io/bignumber.js/#isF)
     */
    public isFinite(): boolean {
        return this.ef === 0;
    }

    /**
     * Return `true` if the value of this FPN is {@link NEGATIVE_INFINITY} and {@link POSITIVE_INFINITY},
     * otherwise returns false.
     *
     * @return true` if the value of this FPN is {@link NEGATIVE_INFINITY} and {@link POSITIVE_INFINITY},
     */
    public isInfinite(): boolean {
        return this.isNegativeInfinite() || this.isPositiveInfinite();
    }

    /**
     * Returns `true` if the value of this FPN is an integer,
     * otherwise returns `false`.
     *
     * @return `true` if the value of this FPN is an integer.
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
     *  Returns `true` if the value of this FPN is `NaN`, otherwise returns `false`.
     *
     *  @return `true` if the value of this FPN is `NaN`, otherwise returns `false`.
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
     * Returns `true` if the sign of this FPN is negative, otherwise returns `false`.
     *
     * @return `true` if the sign of this FPN is negative, otherwise returns `false`.
     *
     * @see [bignumber.js isNegative](https://mikemcl.github.io/bignumber.js/#isNeg)
     */
    public isNegative(): boolean {
        return (this.isFinite() && this.sv < 0n) || this.isNegativeInfinite();
    }

    /**
     * Returns `true` if this FPN value is {@link NEGATIVE_INFINITY}, otherwise returns `false`.
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
        return FPN.REGEX_NUMBER.test(exp);
    }

    /**
     * Returns `true` if the sign of this FPN is positive, otherwise returns `false`.
     *
     * @return `true` if the sign of this FPN is positive, otherwise returns `false`.
     *
     * @see [bignumber.js isPositive](https://mikemcl.github.io/bignumber.js/#isPos)
     */
    public isPositive(): boolean {
        return (this.isFinite() && this.sv >= 0n) || this.isPositiveInfinite();
    }

    /**
     * Returns `true` if this FPN value is {@link POSITIVE_INFINITY}, otherwise returns `false`.
     *
     * @return `true` if this FPN value is {@link POSITIVE_INFINITY}, otherwise returns `false`.
     */
    public isPositiveInfinite(): boolean {
        return this.ef === Number.POSITIVE_INFINITY;
    }

    /**
     * Checks if a given string expression is an unsigned positive integer.
     *
     * @param {string} exp - The string expression to be tested.
     *
     * @return {boolean} True if the expression is an unsigned positive integer,
     * false otherwise.
     */
    public static isUnsignedIntegerExpression(exp: string): boolean {
        return this.REGEX_NATURAL.test(exp);
    }

    /**
     * Returns `true` if the value of this FPN is zero or minus zero, otherwise returns `false`.
     *
     * @return `true` if the value of this FPN is zero or minus zero, otherwise returns `false`.
     *
     * [see bignumber.js isZero](https://mikemcl.github.io/bignumber.js/#isZ)
     */
    public isZero(): boolean {
        return this.isFinite() && this.sv === 0n;
    }

    /**
     * Returns `true` if the value of this FPN is less than the value of `that` FPN, otherwise returns `false`.
     *
     * @param {FPN} that - The FPN to compare against.
     *
     * @return {boolean} `true` if the value of this FPN is less than the value of `that` FPN, otherwise returns `false`.
     *
     * @remarks This method uses {@link comparedTo} internally.
     *
     * @see [bignumber.js isLessThan](https://mikemcl.github.io/bignumber.js/#lt)
     */
    public lt(that: FPN): boolean {
        const cmp = this.comparedTo(that);
        return cmp !== null && cmp < 0;
    }

    /**
     * Returns `true` if the value of this FPN is less than or equal to the value of `that` FPN,
     * otherwise returns `false`.
     *
     * @param {FPN} that true` if the value of this FPN is less than or equal to the value of `that` FPN,
     * otherwise returns `false`.
     *
     * @return {boolean} `true` if the value of this FPN is less than or equal to the value of `that` FPN,
     * otherwise returns `false`.
     *
     * @remarks This method uses {@link comparedTo} internally.
     *
     * @see [bignumber.js isLessThanOrEqualTo](https://mikemcl.github.io/bignumber.js/#lte)
     */
    public lte(that: FPN): boolean {
        const cmp = this.comparedTo(that);
        return cmp !== null && cmp <= 0;
    }

    /**
     * Returns a FPN whose value is the value of this FPN minus `that` FPN.
     *
     * Limit cases
     * * NaN - ±n = NaN
     * * ±n - NaN = NaN
     * * -Infinity - -Infinity = NaN
     * * -Infinity - +n = -Infinity
     * * +Infinity - +Infinity = NaN
     * * +Infinity - +n = +Infinity
     *
     * @param {FPN} that The fixed-point number to subtract.
     *
     * @return {FPN} The result of the subtraction. The return value is always exact and unrounded.
     *
     * @remarks The precision is the greater of the precision of the two operands.
     *
     * @see [bignumber.js minus](https://mikemcl.github.io/bignumber.js/#minus)
     */
    public minus(that: FPN): FPN {
        if (this.isNaN() || that.isNaN()) return FPN.NaN;
        if (this.isNegativeInfinite())
            return that.isNegativeInfinite() ? FPN.NaN : FPN.NEGATIVE_INFINITY;
        if (this.isPositiveInfinite())
            return that.isPositiveInfinite() ? FPN.NaN : FPN.POSITIVE_INFINITY;
        const fd = this.fd > that.fd ? this.fd : that.fd; // Max common fractional decimals.
        return new FPN(fd, this.dp(fd).sv - that.dp(fd).sv);
    }

    /**
     * Returns a FPN whose value is the value of this FPN modulo `that` FPN,
     * i.e. the integer remainder of dividing this FPN by `that`.
     *
     * Limit cases
     * * NaN % ±n = NaN
     * * ±n % NaN = NaN
     * * ±Infinity % n = NaN
     * * n % ±Infinity = NaN
     *
     * @param that {FPN} The fixed-point number to divide by.
     *
     * @return {FPN} the integer remainder of dividing this FPN by `that`.
     *
     * @remarks The precision is the greater of the precision of the two operands.
     *
     * @see [bignumber.js modulo](https://mikemcl.github.io/bignumber.js/#mod)
     */
    public modulo(that: FPN): FPN {
        if (this.isNaN() || that.isNaN()) return FPN.NaN;
        if (this.isInfinite() || that.isInfinite()) return FPN.NaN;
        if (that.isZero()) return FPN.NaN;
        const fd = this.fd > that.fd ? this.fd : that.fd; // Max common fractional decimals.
        let modulo = this.abs().dp(fd).sv;
        const divisor = that.abs().dp(fd).sv;
        while (modulo >= divisor) {
            modulo -= divisor;
        }
        return new FPN(fd, modulo);
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

    public static of(
        exp: bigint | number | string,
        decimalPlaces: bigint = this.DEFAULT_FRACTIONAL_DECIMALS
    ): FPN {
        if (Number.isNaN(exp)) return new FPN(decimalPlaces, 0n, Number.NaN);
        if (exp === Number.NEGATIVE_INFINITY)
            return new FPN(decimalPlaces, -1n, Number.NEGATIVE_INFINITY);
        if (exp === Number.POSITIVE_INFINITY)
            return new FPN(decimalPlaces, 1n, Number.POSITIVE_INFINITY);
        return new FPN(
            decimalPlaces,
            this.txtToSV(exp.toString(), decimalPlaces)
        );
    }

    /**
     * Returns a FPN whose value is the value of this FPN plus `that` FPN.
     *
     * Limit cases
     * * NaN + ±n = NaN
     * * ±n + NaN = NaN
     * * -Infinity + -Infinity = -Infinity
     * * -Infinity + +Infinity = NaN
     * * +Infinity + -Infinity = NaN
     * * +Infinity + +Infinity = +Infinity
     *
     * @param {FPN} that - The fixed-point number to add to the current number.
     *
     * @return {FPN} The result of the addition. The return value is always exact and unrounded.
     *
     * @remarks The precision is the greater of the precision of the two operands.
     *
     * @see [bignumber.js plus](https://mikemcl.github.io/bignumber.js/#plus)
     */
    public plus(that: FPN): FPN {
        if (this.isNaN() || that.isNaN()) return FPN.NaN;
        if (this.isNegativeInfinite())
            return that.isPositiveInfinite() ? FPN.NaN : FPN.NEGATIVE_INFINITY;
        if (this.isPositiveInfinite())
            return that.isNegativeInfinite() ? FPN.NaN : FPN.POSITIVE_INFINITY;
        const fd = this.fd > that.fd ? this.fd : that.fd; // Max common fractional decimals.
        return new FPN(fd, this.dp(fd).sv + that.dp(fd).sv);
    }

    /**
     * Returns a FPN whose value is the value of this FPN raised to the power of `that` FPN.
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
     * @param {FPN} that - The exponent as a fixed-point number.
     *                     It can be negative, it can be not an integer value
     *                     ([bignumber.js pow](https://mikemcl.github.io/bignumber.js/#pow)
     *                     doesn't support not integer exponents).
     * @return {FPN} - The result of raising this fixed-point number to the power of the given exponent.
     *
     * @remarks The precision is the greater of the precision of the two operands.
     * @remarks In fixed-precision math, the comparisons between powers of operands having different fractional
     * precision can lead to differences.
     *
     * @see [bignumber.js exponentiatedBy](https://mikemcl.github.io/bignumber.js/#pow)
     */
    public pow(that: FPN): FPN {
        if (this.isNaN() || that.isNaN()) return FPN.NaN;
        if (this.isInfinite())
            return that.isZero()
                ? FPN.of(1)
                : that.isNegative()
                  ? FPN.ZERO
                  : FPN.POSITIVE_INFINITY;
        if (that.isNegativeInfinite()) return FPN.ZERO;
        if (that.isPositiveInfinite()) return FPN.POSITIVE_INFINITY;
        const fd = this.fd > that.fd ? this.fd : that.fd; // Max common fractional decimals.
        return new FPN(fd, FPN.pow(fd, this.dp(fd).sv, that.dp(fd).sv));
    }

    /**
     * Computes the power of a given base raised to a specified exponent.
     *
     * @param {bigint} fd - The scale factor for decimal precision.
     * @param {bigint} base - The base number to be raised to the power.
     * @param {bigint} exponent - The exponent to which the base should be raised.
     * @return {bigint} - The result of base raised to the power of exponent, scaled by the scale factor.
     */
    private static pow(fd: bigint, base: bigint, exponent: bigint): bigint {
        const sf = 10n ** fd; // Scale factor.
        if (exponent < 0n) {
            return FPN.pow(fd, FPN.div(fd, sf, base), -exponent); // Recursive.
        }
        if (exponent === 0n) {
            return 1n * sf;
        }
        if (exponent === sf) {
            return base;
        }
        return FPN.pow(fd, this.mul(base, base, fd), exponent - sf); // Recursive.
    }

    /**
     * Computes the square root of a given positive bigint value using a fixed-point iteration method.
     *
     * @param {bigint} value - The positive bigint value for which the square root is to be calculated.
     * @param {bigint} fd - The iteration factor determinant.
     *
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
                (actualResult + FPN.div(fd, value, actualResult)) / 2n;
            iteration++;
        }
        return actualResult;
    }

    /**
     * Returns a FPN whose value is the square root of the value of this FPN
     *
     * Limit cases
     * * √ NaN = NaN
     * * +Infinite = +Infinite
     * * -n = NaN
     *
     * @return {FPN} The square root of the number.
     *
     * @see [bignumber.js sqrt](https://mikemcl.github.io/bignumber.js/#sqrt)
     */
    public sqrt(): FPN {
        if (this.isNaN()) return FPN.NaN;
        if (this.isPositiveInfinite()) return FPN.POSITIVE_INFINITY;
        try {
            return new FPN(this.fd, FPN.sqr(this.sv, this.fd));
        } catch (e) {
            return FPN.NaN;
        }
    }

    /**
     * Returns a FPN whose value is the value of this FPN multiplied by `that` FPN.
     *
     * Limits cases
     * * NaN * n = NaN
     * * n * NaN = NaN
     * * -Infinite * -n = +Infinite
     * * -Infinite * +n = -Infinite
     * * +Infinite * -n = -Infinite
     * * +Infinite * +n = +Infinite
     *
     * @param {FPN} that - The fixed-point number to multiply with this number.
     *
     * @return {FPN} a FPN whose value is the value of this FPN multiplied by `that` FPN.
     *
     * @remarks The precision is the greater of the precision of the two operands.
     *
     * @see [bignumber.js multipliedBy](https://mikemcl.github.io/bignumber.js/#times)
     */
    public times(that: FPN): FPN {
        if (this.isNaN() || that.isNaN()) return FPN.NaN;
        if (this.isNegativeInfinite())
            return that.isNegative()
                ? FPN.POSITIVE_INFINITY
                : FPN.NEGATIVE_INFINITY;
        if (this.isPositiveInfinite())
            return that.isNegative()
                ? FPN.NEGATIVE_INFINITY
                : FPN.POSITIVE_INFINITY;
        const fd = this.fd > that.fd ? this.fd : that.fd; // Max common fractional decimals.
        return new FPN(fd, FPN.mul(this.dp(fd).sv, that.dp(fd).sv, fd));
    }

    public toString(decimalSeparator = '.'): string {
        if (this.ef === 0) {
            const sign = this.sv < 0n ? '-' : '';
            const digits =
                this.sv < 0n ? (-this.sv).toString() : this.sv.toString();
            const padded = digits.padStart(Number(this.fd), '0');
            const decimals = padded.slice(Number(-this.fd));
            const integers = padded.slice(0, padded.length - decimals.length);
            const integersShow = integers.length < 1 ? '0' : integers;
            const decimalsShow = FPN.trimEnd(decimals);
            return (
                sign +
                integersShow +
                (decimalsShow.length > 0 ? decimalSeparator + decimalsShow : '')
            );
        }
        return this.ef.toString();
    }

    private static trimEnd(str: string, sub: string = '0'): string {
        // Check if the input string ends with the trailing substring
        if (str.endsWith(sub)) {
            // Remove the trailing substring recursively.
            return FPN.trimEnd(str.substring(0, str.length - sub.length), sub);
        }
        return str;
    }

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

export { FPN };
