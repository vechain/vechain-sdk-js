class FPN {
    protected static readonly DEFAULT_FRACTIONAL_DECIMALS = 18n;

    /**
     * Scaled Value = value * 10 ^ fd.
     * @private
     */
    private readonly sv: bigint;

    /**
     * Fractional Digits
     * @private
     */
    private readonly fd: bigint;

    constructor(sv: bigint, fd: bigint) {
        this.sv = sv;
        this.fd = fd;
    }

    public abs(): FPN {
        return new FPN(this.sv < 0n ? -this.sv : this.sv, this.fd);
    }

    public absoluteValue(): FPN {
        return this.abs();
    }

    public comparedTo(that: FPN): number {
        const fd = this.fd > that.fd ? this.fd : that.fd; // Max common fractional decimals.
        const delta = this.scale(fd).sv - that.scale(fd).sv;
        return delta < 0n ? -1 : delta === 0n ? -0 : 1;
    }

    public div(that: FPN): FPN {
        const fd = this.fd > that.fd ? this.fd : that.fd; // Max common fractional decimals.
        return new FPN(FPN.div(this.scale(fd).sv, that.scale(fd).sv, fd), fd);
    }

    private static div(dividend: bigint, divisor: bigint, fd: bigint): bigint {
        return (10n ** fd * dividend) / divisor;
    }

    public dividedBy(that: FPN): FPN {
        return this.div(that);
    }

    public exponentiatedBy(that: FPN): FPN {
        const fd = this.fd > that.fd ? this.fd : that.fd; // Max common fractional decimals.
        return new FPN(FPN.pow(this.scale(fd).sv, that.scale(fd).sv, fd), fd);
    }

    public minus(that: FPN): FPN {
        const fd = this.fd > that.fd ? this.fd : that.fd; // Max common fractional decimals.
        return new FPN(this.scale(fd).sv - that.scale(fd).sv, fd);
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
        fractionalDecimals: bigint = this.DEFAULT_FRACTIONAL_DECIMALS
    ): FPN {
        return new FPN(this.nToSV(exp, fractionalDecimals), fractionalDecimals);
    }

    private static nToSV(n: number, fd: bigint): bigint {
        return BigInt(Math.round(n * 10 ** Number(fd)));
    }

    public pow(that: FPN): FPN {
        const fd = this.fd > that.fd ? this.fd : that.fd; // Max common fractional decimals.
        return new FPN(FPN.pow(this.scale(fd).sv, that.scale(fd).sv, fd), fd);
    }

    private static pow(base: bigint, exponent: bigint, fd: bigint): bigint {
        const sf = 10n ** fd; // Scale factor.
        if (exponent < 0n) {
            return FPN.pow(FPN.div(sf, base, fd), -exponent, fd); // Recursive.
        }
        if (exponent === 0n) {
            return 1n;
        }
        if (exponent === sf) {
            return base;
        }
        return FPN.pow(this.mul(base, base, fd), exponent - sf, fd); // Recursive.
    }

    public plus(that: FPN): FPN {
        const fd = this.fd > that.fd ? this.fd : that.fd; // Max common fractional decimals.
        return new FPN(this.scale(fd).sv + that.scale(fd).sv, fd);
    }

    public scale(fd: bigint): FPN {
        const dd = fd - this.fd; // Fractional Decimals Difference.
        if (dd < 0) {
            return new FPN(this.sv / 10n ** -dd, fd);
        } else {
            return new FPN(this.sv * 10n ** dd, fd);
        }
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
                (actualResult + FPN.div(value, actualResult, fd)) / 2n;
            iteration++;
        }
        return actualResult;
    }

    public sqrt(): FPN {
        return new FPN(FPN.sqr(this.sv, this.fd), this.fd);
    }

    public squareRoot(): FPN {
        return this.sqrt();
    }

    public times(that: FPN): FPN {
        const fd = this.fd > that.fd ? this.fd : that.fd; // Max common fractional decimals.
        return new FPN(FPN.mul(this.scale(fd).sv, that.scale(fd).sv, fd), fd);
    }

    private static trimEnd(str: string, sub: string = '0'): string {
        // Check if the input string ends with the trailing substring
        if (str.endsWith(sub)) {
            // Remove the trailing substring recursively.
            return FPN.trimEnd(str.substring(0, str.length - sub.length), sub);
        }
        return str;
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
}

export { FPN };
