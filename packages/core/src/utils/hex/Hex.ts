// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { assert, DATA } from '@vechain/vechain-sdk-errors';

export const Hex = {
    PREFIX: '0x',
    RADIX: 16,

    of: function (n: number) {
        assert(
            Number.isInteger(n),
            DATA.INVALID_DATA_TYPE,
            `Arg 'n' be an integer.`,
            { n }
        );
        assert(n >= 0, DATA.INVALID_DATA_TYPE, `Arg 'n' be not negative.`, {
            n
        });
        return `${this.PREFIX}${n.toString(this.RADIX)}`;
    }
};
