import { HexUInt } from './HexUInt';
import { Hex } from './Hex';
import { InvalidDataType } from '@vechain/sdk-errors';

class Nonce extends HexUInt {
    private static readonly DIGITS = 8;

    protected constructor(huint: HexUInt) {
        super(Hex.POSITIVE, huint.fit(Nonce.DIGITS).digits);
    }

    public static isValid(exp: string): boolean {
        return Hex.isValid(exp) && HexUInt.REGEX_HEXUINT_PREFIX.test(exp)
            ? exp.length === Nonce.DIGITS + 2
            : exp.length === Nonce.DIGITS;
    }

    public static isValid0x(exp: string): boolean {
        return HexUInt.REGEX_HEXUINT_PREFIX.test(exp) && Nonce.isValid(exp);
    }

    public static of(
        exp: bigint | number | string | Uint8Array | HexUInt
    ): Nonce {
        try {
            if (exp instanceof HexUInt) {
                return new Nonce(exp);
            }
            return new Nonce(HexUInt.of(exp));
        } catch (e) {
            throw new InvalidDataType(
                'Nonce.of',
                'not a Nonce expression',
                { exp: `${exp}` }, // Needed to serialize bigint values.
                e
            );
        }
    }
}

export { Nonce };
