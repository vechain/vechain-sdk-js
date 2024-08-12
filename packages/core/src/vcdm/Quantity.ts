import { HexUInt } from './HexUInt';

class Quantity extends HexUInt {
    public static of(
        exp: bigint | number | string | Uint8Array | HexUInt
    ): Quantity {
        let hxu;
        if (exp instanceof HexUInt) {
            hxu = exp;
        } else {
            hxu = HexUInt.of(exp);
        }
        let cue = 0;
        while (cue < hxu.digits.length && hxu.digits.at(cue) === '0') {
            cue++;
        }
        return new Quantity(
            hxu.sign,
            cue === hxu.digits.length ? '0' : hxu.digits.slice(cue)
        );
    }
}

export { Quantity };
