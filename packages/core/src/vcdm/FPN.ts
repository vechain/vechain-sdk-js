class FPN {
    protected static readonly DEFAULT_FRACTIONAL_DECIMALS = 18n;

    /**
     * Fractional Digits or decimal places.
     * @private
     */
    private readonly fd: bigint;

    /**
     * Scaled Value = value * 10 ^ fd.
     * @private
     */
    private readonly sv: bigint;

    constructor(fd: bigint, sv: bigint) {
        this.fd = fd;
        this.sv = sv;
    }

    public abs(): FPN {
        return new FPN(this.fd, this.sv < 0n ? -this.sv : this.sv);
    }

    public absoluteValue(): FPN {
        return this.abs();
    }

    public compareTo(that: FPN): number {
        const fd = this.fd > that.fd ? this.fd : that.fd; // Max common fractional decimals.
        const delta = this.dp(fd).sv - that.dp(fd).sv;
        return delta < 0n ? -1 : delta === 0n ? -0 : 1;
    }

    public comparedTo(that: FPN): number {
        return this.compareTo(that);
    }

    public div(that: FPN): FPN {
        const fd = this.fd > that.fd ? this.fd : that.fd; // Max common fractional decimals.
        return new FPN(fd, FPN.div(fd, this.dp(fd).sv, that.dp(fd).sv));
    }

    private static div(fd: bigint, dividend: bigint, divisor: bigint): bigint {
        return (10n ** fd * dividend) / divisor;
    }

    public dividedBy(that: FPN): FPN {
        return this.div(that);
    }

    public dp(decimalPlaces: bigint | number): FPN {
        const fp = BigInt(decimalPlaces);
        const dd = fp - this.fd; // Fractional Decimals Difference.
        if (dd < 0) {
            return new FPN(fp, this.sv / 10n ** -dd);
        } else {
            return new FPN(fp, this.sv * 10n ** dd);
        }
    }

    public decimalPlaces(decimalPlaces: bigint): FPN {
        return this.dp(decimalPlaces - this.fd * decimalPlaces);
    }

    public exponentiatedBy(that: FPN): FPN {
        const fd = this.fd > that.fd ? this.fd : that.fd; // Max common fractional decimals.
        return new FPN(fd, FPN.pow(fd, this.dp(fd).sv, that.dp(fd).sv));
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

    public static of(
        exp: number,
        decimalPlaces: bigint = this.DEFAULT_FRACTIONAL_DECIMALS
    ): FPN {
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

    public toString(decimalSeparator = '.'): string {
        const sign = this.sv < 0n ? '-' : '';
        const digits =
            this.sv < 0n ? (-this.sv).toString() : this.sv.toString();
        const padded = digits.padStart(Number(this.fd), '0');
        const decimals = padded.slice(Number(-this.fd));
        const integers = padded.slice(0, padded.length - decimals.length);
        return (
            sign +
            (integers.length < 1 ? '0' : integers) +
            decimalSeparator +
            FPN.trimEnd(decimals)
        );
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
