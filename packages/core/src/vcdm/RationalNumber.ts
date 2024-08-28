class RationalNumber {
    public readonly mantissa: bigint;

    public readonly exponent: number;

    constructor(mantissa: bigint, exponent: number) {
        this.mantissa = mantissa;
        this.exponent = exponent;
    }

    private static abs(bi: bigint): bigint {
        return bi < 0n ? -bi : bi;
    }

    public scale(): RationalNumber {
        let mantissa = this.mantissa;
        let exponent = this.exponent;
        if (exponent < 0) {
            while (mantissa % 10n === 0n) {
                mantissa /= 10n;
                exponent++;
            }
        } else if (exponent > 0) {
            while (exponent > 0) {
                mantissa *= 10n;
                exponent--;
            }
        }
        return new RationalNumber(mantissa, exponent);
    }

    public toString(decimalSeparator: string = '.'): string {
        const sign = this.mantissa < 0n ? '-' : '';
        const digits = RationalNumber.abs(this.mantissa).toString();
        if (this.exponent < 0) {
            const decimals = digits.slice(this.exponent);
            const integerLen = digits.length + this.exponent;
            if (integerLen > 0) {
                const integers = digits.slice(0, integerLen);
                return sign + integers + decimalSeparator + decimals;
            } else {
                const padding = '0'.repeat(-1 * integerLen);
                return sign + '0' + decimalSeparator + padding + decimals;
            }
        }
        return sign + digits;
    }
}

export { RationalNumber };
