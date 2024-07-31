import { type VCDM } from './VCDM';
import { InvalidCastType } from './InvalidCastType';
import { InvalidDataType } from '@vechain/sdk-errors';

class Txt extends String implements VCDM<Txt> {
    private static readonly DECODER = new TextDecoder();

    private static readonly NFC = 'NFC';

    private static readonly ENCODER = new TextEncoder();

    protected constructor(text: string) {
        super(text.normalize(Txt.NFC));
    }

    get bi(): bigint {
        try {
            return BigInt(this.toString());
        } catch (e) {
            throw new InvalidCastType<Txt>(
                'Txt.bi',
                "can't cast to big integer",
                this,
                e
            );
        }
    }

    get bytes(): Uint8Array {
        return Txt.ENCODER.encode(this.toString());
    }

    get n(): number {
        return Number(this.toString());
    }

    public compareTo(that: Txt): number {
        return this.toString().localeCompare(that.toString());
    }

    public isEqual(that: Txt): boolean {
        return this.compareTo(that) === 0;
    }

    public toString(): string {
        return this.valueOf();
    }

    static of<T>(exp: bigint | number | string | VCDM<T> | Uint8Array): Txt {
        if (typeof exp === 'bigint' || typeof exp === 'number') {
            return new Txt(exp.toString());
        } else if (typeof exp === 'string') {
            return new Txt(exp);
        } else if (exp instanceof Txt) {
            return exp;
        } else if (exp instanceof Uint8Array) {
            return new Txt(Txt.DECODER.decode(exp));
        }
        throw new InvalidDataType('Text.of', 'invalid data type', {
            exp
        });
    }
}

export { Txt };
