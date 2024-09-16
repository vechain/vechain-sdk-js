import { type Currency } from './Currency';
import { type FPN } from '../FPN';
import { type Txt } from '../Txt';

abstract class Coin implements Currency {
    private readonly _code: Txt;

    private readonly _value: FPN;

    protected constructor(code: Txt, value: FPN) {
        this._code = code;
        this._value = value;
    }

    get code(): Txt {
        return this._code;
    }

    get value(): FPN {
        return this._value;
    }

    get bi(): bigint {
        return this._value.bi;
    }

    get bytes(): Uint8Array {
        throw new Error('Method not implemented.');
    }

    get n(): number {
        return this._value.n;
    }

    compareTo(that: Currency): number {
        const codeDiff = this.code.compareTo(that.code);
        if (codeDiff === 0) {
            return this.value.compareTo(that.value);
        }
        return codeDiff;
    }

    isEqual(that: Currency): boolean {
        return this.compareTo(that) === 0;
    }

    public toString(): string {
        return `${this.value.toString()} ${this._code}`;
    }
}

export { Coin };
