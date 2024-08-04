import { Hex } from './Hex';
import { InvalidDataType } from '@vechain/sdk-errors';

class ThorId extends Hex {
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
            ? exp.length === 66
            : exp.length === 64;
    }

    public static of(exp: bigint | number | string | Hex | Uint8Array): ThorId {
        if (exp instanceof Hex) {
            return new ThorId(exp);
        }
        return new ThorId(Hex.of(exp));
    }
}

export { ThorId };
