import { Int } from './Int';
import { InvalidDataType } from '@vechain/sdk-errors';

class UInt extends Int {
    protected constructor(value: number) {
        super(value);
    }

    static of(exp: number): UInt {
        if (exp >= 0 && Number.isInteger(exp)) {
            return new UInt(exp);
        }
        throw new InvalidDataType(
            'UInt.of',
            'not an unsigned integer expression',
            {
                exp: `${exp}`
            }
        );
    }
}

export { UInt };
