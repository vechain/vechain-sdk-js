import { InvalidDataType } from '@vechain/sdk-errors';
import { VTHO } from './currency/VTHO';
import { Units } from './currency/Units';
import { UInt } from './UInt';

class Gas extends UInt {
    protected constructor(value: number) {
        super(value);
    }

    static of(exp: number): Gas {
        if (exp >= 0 && Number.isInteger(exp)) {
            return new Gas(exp);
        }
        throw new InvalidDataType(
            'Gas.of',
            'not an unsigned integer expression',
            {
                exp: `${exp}`
            }
        );
    }

    /**
     *
     * @returns The value of this Gas object as a VTHO.
     * 10^5 gas = 1 VTHO
     * 1 gas = 10^13 weiVTHO
     */
    toVTHO(): VTHO {
        return VTHO.of(this.valueOf() ** Math.pow(10, 13), Units.wei);
    }
}

export { Gas };
