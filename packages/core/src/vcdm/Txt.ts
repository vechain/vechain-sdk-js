import { type VeChainDataModel } from './VeChainDataModel';
import { InvalidCastType } from './InvalidCastType';

class Txt extends String implements VeChainDataModel<Txt> {
    private static readonly DECODER = new TextDecoder();

    private static readonly NFC = 'NFC';

    private static readonly ENCODER = new TextEncoder();

    protected constructor(exp: string) {
        super(exp.normalize(Txt.NFC));
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

    public static of(exp: bigint | number | string | Uint8Array): Txt {
        if (exp instanceof Uint8Array) {
            return new Txt(Txt.DECODER.decode(exp));
        } else if (typeof exp === 'bigint' || typeof exp === 'number') {
            return new Txt(exp.toString());
        }
        return new Txt(exp);
    }
}

export { Txt };
