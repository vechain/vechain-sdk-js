class FPN {
    /**
     * The default number of decimal places to use for fixed-point math.
     *
     * @see
     * [bignumber.js DECIMAL_PLACES](https://mikemcl.github.io/bignumber.js/#decimal-places).
     *
     * @constant {bigint}
     */
    protected static readonly DEFAULT_FRACTIONAL_DECIMALS = 20n;

    /**
     * Not a Number.
     *
     * @remarks {@link fd} and {@link sv} not meaningful.
     *
     * @see [Number.NaN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/NaN).
     *
     */
    public static readonly NaN = new FPN(0n, 0n, NaN);

    /**
     * The negative Infinity value.
     *
     * @remarks {@link fd} and {@link sv} not meaningful.
     *
     * @see [Number.NEGATIVE_INFINITY](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/NEGATIVE_INFINITY).
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
     * @see [Number.POSITIVE_INFINITY](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/POSITIVE_INFINITY).
     */
    public static readonly POSITIVE_INFINITY = new FPN(
        0n,
        0n,
        Number.POSITIVE_INFINITY
    );

    /**
     * Represents the zero constant.
     */
    public static readonly ZERO = new FPN(0n, 0n, 0);

    /**
     * Edge Flag denotes the {@link NaN} or {@link NEGATIVE_INFINITY} or {@link POSITIVE_INFINITY} value.
     *
     * @remarks If `ef` is not 0, {@link fd} and {sv} are not meaningful.
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
     * Returns the new Fixed-Point Number (FDN) instance having
     *
     * @param {bigint} fd - Number of Fractional Digits (or decimal places).
     * @param {bigint} sv - Scaled Value.
     * @param {number} [ef=0] - Edge Flag, default is 0.
     */
    protected constructor(fd: bigint, sv: bigint, ef: number = 0) {
        this.fd = fd;
        this.ef = ef;
        this.sv = sv;
    }

    /**
     * Returns a FPN whose value is the absolute value, i.e. the magnitude, of the value of this FPN.
     */
    public abs(): FPN {
        return new FPN(this.fd, this.sv < 0n ? -this.sv : this.sv);
    }

    /**
     * Returns a FPN whose value is the absolute value, i.e. the magnitude, of the value of this FPN.
     * See {@link abs}.
     *
     * @see [bignumber.js absoluteValue](https://mikemcl.github.io/bignumber.js/#abs).
     */
    public absoluteValue(): FPN {
        return this.abs();
    }

    /**
     * Compares this instance with the specified FPN instance.
     * * Returns a null if either instance is NaN;
     * * Returns 0 if this is equal to `that` FPN, including infinite with equal sign;
     * * Returns -1, if this is -Infinite or less than `that` FPN;,
     * * Returns 1 if this is +Infinite or greater than `that` FPN.
     *
     * @param {FPN} that - The instance to compare with this instance.
     *
     * @return {null | number} A null if either instance is NaN;
     * -1, 0, or 1 if this instance is less than, equal to, or greater
     * than the specified instance, respectively.
     */
    public compareTo(that: FPN): null | number {
        if (this.isNaN() || that.isNaN()) return null;
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
     * Compares this instance with the specified FPN instance.
     * See {@link compareTo}.
     *
     * @param {FPN} that - The instance to compare with this instance.
     *
     * @return {null | number} A null if either instance is NaN;
     * -1, 0, or 1 if this instance is less than, equal to, or greater
     * than the specified instance, respectively.
     *
     * @see [bignumber.js comparedTo](https://mikemcl.github.io/bignumber.js/#cmp).
     */
    public comparedTo(that: FPN): null | number {
        return this.compareTo(that);
    }

    /**
     * Adjusts the precision of the floating-point number by the specified
     * number of decimal places.
     * See {@link dp}.
     *
     * @param {bigint | number} decimalPlaces - The number of decimal places to adjust to.
     *
     * @return {FPN} A new FPN instance with the adjusted precision.
     *
     * @see [bignumber.js decimalPlaces](https://mikemcl.github.io/bignumber.js/#dp).
     */
    // TODO: implement round logic and return number if argument is null.
    public decimalPlaces(decimalPlaces: number): FPN {
        const dp = BigInt(decimalPlaces);
        return this.dp(dp - this.fd * dp);
    }

    /**
     * Returns a FPN whose value is the value of this FPN divided by `that` FPN.
     *
     * Limit cases:
     * - 0 / 0 = NaN;
     * - NaN / n = NaN;
     * - n / NaN = NaN;
     * - n / +/-Infinite = 0;
     * - -n / 0 = -Infinite;
     * - +n / 0 = +Infinite.
     *
     * @param {FPN} that - The fixed-point number to divide by.
     *
     * @return {FPN} The result of the division.
     *
     * @remarks The precision in the higher of the two operands.
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
        try {
            return new FPN(fd, FPN.div(fd, this.dp(fd).sv, that.dp(fd).sv));
        } catch (e) {
            if (e instanceof RangeError) return FPN.NaN;
            else throw e;
        }
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
        return divisor === 1n ? dividend : (10n ** fd * dividend) / divisor;
    }

    /**
     * Returns a FPN whose value is the value of this FPN divided by `that` FPN.
     * See {@link div}.
     *
     * @param {FPN} that - The fixed-point number to divide by.
     *
     * @see [bignumber.js dividedBy](https://mikemcl.github.io/bignumber.js/#div).
     */
    public dividedBy(that: FPN): FPN {
        return this.div(that);
    }

    /**
     * Returns a FPN whose value is the integer part of dividing the value of this FPN by `that` FPN.
     * See {@link idiv}.
     *
     * @param {FPN} that - The fixed-point number to divide by.
     *
     * @see [bignumber.js dividedToIntegerBy](https://mikemcl.github.io/bignumber.js/#divInt).
     */
    public dividedToIntegerBy(that: FPN): FPN {
        return this.idiv(that);
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

    public eq(that: FPN): boolean {
        return this.isEqualTo(that);
    }

    public exponentiatedBy(that: FPN): FPN {
        const fd = this.fd > that.fd ? this.fd : that.fd; // Max common fractional decimals.
        return new FPN(fd, FPN.pow(fd, this.dp(fd).sv, that.dp(fd).sv));
    }

    /**
     * Returns a fixed-point number whose value is the integer part of dividing the value of this fixed-point number
     * by `that` fixed point number.
     *
     * Limit cases:
     * - 0 / 0 = NaN;
     * - NaN / n = NaN;
     * - n / NaN = NaN;
     * - n / +/-Infinite = 0;
     * - -n / 0 = -Infinite;
     * - +n / 0 = +Infinite.
     *
     * @param {FPN} that - The fixed-point number to divide by.
     *
     * @return {FPN} The result of the division.
     *
     * @remarks The precision in the higher of the two operands.
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
     *  @return {bigint} - The scaled result of the integer division.
     */
    private static idiv(fd: bigint, dividend: bigint, divisor: bigint): bigint {
        return (dividend / divisor) * 10n ** fd;
    }

    public isEqual(that: FPN): boolean {
        return this.eq(that);
    }

    public isEqualTo(that: FPN): boolean {
        return this.compareTo(that) === 0;
    }

    public isFinite(): boolean {
        return this.ef === 0;
    }

    public isInfinite(): boolean {
        return this.isNegativeInfinite() || this.isPositiveInfinite();
    }

    public isNaN(): boolean {
        return Number.isNaN(this.ef);
    }

    public isNegative(): boolean {
        return (this.isFinite() && this.sv < 0n) || this.isNegativeInfinite();
    }

    public isNegativeInfinite(): boolean {
        return this.ef === Number.NEGATIVE_INFINITY;
    }

    public isPositive(): boolean {
        return (this.isFinite() && this.sv >= 0n) || this.isPositiveInfinite();
    }

    public isPositiveInfinite(): boolean {
        return this.ef === Number.POSITIVE_INFINITY;
    }

    public isZero(): boolean {
        return this.sv === 0n;
    }

    public minus(that: FPN): FPN {
        const fd = this.fd > that.fd ? this.fd : that.fd; // Max common fractional decimals.
        return new FPN(fd, this.dp(fd).sv - that.dp(fd).sv);
    }

    private static mul(
        multiplicand: bigint,
        multiplicator: bigint,
        fd: bigint
    ): bigint {
        return (multiplicand * multiplicator) / 10n ** fd;
    }

    public multipliedBy(that: FPN): FPN {
        return this.times(that);
    }

    get n(): number {
        if (this.isNaN()) return Number.NaN;
        if (this.isNegativeInfinite()) return Number.NEGATIVE_INFINITY;
        if (this.isPositiveInfinite()) return Number.POSITIVE_INFINITY;
        if (this.isZero()) return 0;
        return Number(this.sv) * 10 ** -Number(this.fd);
    }

    public static of(
        exp: number,
        decimalPlaces: bigint = this.DEFAULT_FRACTIONAL_DECIMALS
    ): FPN {
        if (Number.isNaN(exp)) return new FPN(decimalPlaces, 0n, Number.NaN);
        if (exp === Number.NEGATIVE_INFINITY)
            return new FPN(decimalPlaces, -1n, Number.NEGATIVE_INFINITY);
        if (exp === Number.POSITIVE_INFINITY)
            return new FPN(decimalPlaces, 1n, Number.POSITIVE_INFINITY);
        return new FPN(decimalPlaces, this.nToSV(exp, decimalPlaces));
    }

    private static nToSV(n: number, fd: bigint): bigint {
        return BigInt(Math.round(n * 10 ** Number(fd)));
    }

    public pow(that: FPN): FPN {
        const fd = this.fd > that.fd ? this.fd : that.fd; // Max common fractional decimals.
        return new FPN(fd, FPN.pow(fd, this.dp(fd).sv, that.dp(fd).sv));
    }

    private static pow(fd: bigint, base: bigint, exponent: bigint): bigint {
        const sf = 10n ** fd; // Scale factor.
        if (exponent < 0n) {
            return FPN.pow(fd, FPN.div(fd, sf, base), -exponent); // Recursive.
        }
        if (exponent === 0n) {
            return 1n;
        }
        if (exponent === sf) {
            return base;
        }
        return FPN.pow(fd, this.mul(base, base, fd), exponent - sf); // Recursive.
    }

    public plus(that: FPN): FPN {
        const fd = this.fd > that.fd ? this.fd : that.fd; // Max common fractional decimals.
        return new FPN(fd, this.dp(fd).sv + that.dp(fd).sv);
    }

    private static sqr(value: bigint, fd: bigint): bigint {
        if (value < 0n) {
            throw new Error();
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

    public sqrt(): FPN {
        return new FPN(this.fd, FPN.sqr(this.sv, this.fd));
    }

    public squareRoot(): FPN {
        return this.sqrt();
    }

    public times(that: FPN): FPN {
        const fd = this.fd > that.fd ? this.fd : that.fd; // Max common fractional decimals.
        return new FPN(fd, FPN.mul(this.dp(fd).sv, that.dp(fd).sv, fd));
    }

    public toNumber(): number {
        return this.n;
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
}

export { FPN };
