import { Hex } from './Hex';
import { InvalidDataType } from '@vechain/sdk-errors';

class Quantity extends Hex {
    protected constructor(hex: Hex) {
        let i = 0;
        while (i < hex.hex.length && hex.hex.at(i) === '0') {
            i++;
        }
        super(i === hex.hex.length ? '0' : hex.hex.slice(i));
    }

    public static of(
        exp: bigint | number | string | Hex | Uint8Array
    ): Quantity {
        if (exp instanceof Hex) {
            return new Quantity(exp);
        }
        if (typeof exp === 'number') {
            if (Number.isInteger(exp)) {
                return new Quantity(Hex.of(BigInt(exp)));
            }
            throw new InvalidDataType('Quantity.of', 'not a safe integer', {
                exp
            });
        }
        return new Quantity(Hex.of(exp));
    }
}

export { Quantity };
