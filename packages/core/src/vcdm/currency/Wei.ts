import { type Currency } from './Currency';
import { FPN } from '../FPN';
import { Txt } from '../Txt';

class Wei extends FPN implements Currency<FPN> {
    private static readonly CODE = Txt.of('wei');

    readonly code = Wei.CODE;

    get value(): FPN {
        return this;
    }

    private static readonly FRACTIONAL_DECIMALS = 0n;

    constructor(wei: Wei) {
        super(wei.fd, wei.sv, wei.ef);
    }

    public compareTo(that: Wei): number {
        const codeDiff = this.code.compareTo(that.code);
        if (codeDiff === 0) {
            return this.value.compareTo(that.value);
        }
        return codeDiff;
    }

    public isEqual(that: Wei): boolean {
        return this.compareTo(that) === 0;
    }

    public static of(exp: bigint | number | string): Wei {
        return new Wei(FPN.of(exp, Wei.FRACTIONAL_DECIMALS) as Wei);
    }

    public toString(decimalSeparator: string = '.'): string {
        return super.toString(decimalSeparator) + this.code.toString();
    }
}

export { Wei };
