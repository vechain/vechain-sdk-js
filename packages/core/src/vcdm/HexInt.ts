import { Hex } from './Hex';
import { InvalidDataType } from '@vechain/sdk-errors';

class HexInt extends Hex {
    protected constructor(hex: Hex) {
        let cue = 0;
        while (cue < hex.hex.length && hex.hex.at(cue) === '0') {
            cue++;
        }
        super(
            hex.sign,
            cue === hex.hex.length ? '0' : hex.hex.slice(cue, hex.hex.length)
        );
    }

    public override get n(): number {
        const bi = this.bi;
        if (Number.MIN_SAFE_INTEGER <= bi && bi <= Number.MAX_VALUE) {
            return Number(bi);
        }
        throw new InvalidDataType('HexInt.of', 'not in the safe number range', {
            bi: `${bi}`,
            hex: this.toString()
        });
    }

    public static of(exp: bigint | number | string | Uint8Array | Hex): HexInt {
        try {
            if (exp instanceof Hex) {
                return new HexInt(exp);
            }
            if (typeof exp === 'number') {
                if (Number.isInteger(exp)) {
                    return new HexInt(Hex.of(BigInt(exp)));
                }
                throw new InvalidDataType('HexInt.of', 'not an integer', {
                    exp
                });
            }
            return new HexInt(Hex.of(exp));
        } catch (e) {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            throw new InvalidDataType(
                'HexInt.of',
                'not an hexadecimal integer expression',
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                { exp: `${exp}`, e } // Needed to serialize bigint values.
            );
        }
    }
}

export { HexInt };
