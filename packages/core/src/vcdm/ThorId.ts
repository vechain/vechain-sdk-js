import { Hex } from './Hex';
import { InvalidDataType } from '@vechain/sdk-errors';

class ThorId extends Hex {
    private static readonly DIGITS = 64;

    protected constructor(hex: Hex) {
        if (ThorId.isValid(hex.hex)) {
            super(hex.hex);
        } else {
            throw new InvalidDataType(
                'ThorId.constructor',
                'not a ThorId expression',
                { hex }
            );
        }
    }

    public static isValid(exp: string): boolean {
        return Hex.isValid(exp) && Hex.REGEX_PREFIX.test(exp)
            ? exp.length === ThorId.DIGITS + 2
            : exp.length === ThorId.DIGITS;
    }

    public static isValid0x(exp: string): boolean {
        return Hex.REGEX_PREFIX.test(exp) && ThorId.isValid(exp);
    }

    public static of(exp: bigint | number | string | Hex | Uint8Array): ThorId {
        if (exp instanceof Hex) {
            return new ThorId(exp.fit(this.DIGITS));
        }
        return new ThorId(Hex.of(exp).fit(ThorId.DIGITS));
    }
}

export { ThorId };
