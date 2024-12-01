import { InvalidDataType } from '@vechain/sdk-errors';

class Int extends Number {
    protected constructor(value: number) {
        super(value);
    }

    static of(exp: number): Int {
        if (Number.isInteger(exp)) {
            return new Int(exp);
        }
        throw new InvalidDataType('Int.of', 'not an integer expression', {
            exp: `${exp}`
        });
    }
}

export { Int };
