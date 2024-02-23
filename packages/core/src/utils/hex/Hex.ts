import { assert, DATA } from '@vechain/vechain-sdk-errors';

// todo: toQuantity <--

// todo: Buffer.from(dataUtils.removePrefix(data), 'hex');
// todo: hexlify
// todo: decodeBufferToHexWithLeadingZeros
// todo: let hex = bi.toString(16); it seems to to be the same bigint everyhere.
// todo: toHexString
// todo: toBeHex

// todo: padHexString?

enum Error {
    NOT_INTEGER = `Arg 'n' not an integer.`,
    NOT_POSITIVE = `Arg 'n' not negative.`
}

export const Hex = {
    PREFIX: '0x',
    RADIX: 16,

    of: function (n: bigint | number | string) {
        if (typeof n === 'bigint') return this.ofBigInt(n);
        if (typeof n === 'number') return this.ofNumber(n);
        assert(isInteger(n), DATA.INVALID_DATA_TYPE, Error.NOT_INTEGER, {
            n
        });
        return this.ofString(n);
    },

    ofBigInt: function (n: bigint): string {
        assert(n >= 0, DATA.INVALID_DATA_TYPE, Error.NOT_POSITIVE, {
            n
        });
        return `${this.PREFIX}${n.toString(this.RADIX)}`;
    },

    ofNumber: function (n: number): string {
        assert(Number.isInteger(n), DATA.INVALID_DATA_TYPE, Error.NOT_INTEGER, {
            n
        });
        assert(n >= 0, DATA.INVALID_DATA_TYPE, Error.NOT_POSITIVE, {
            n
        });
        return `${this.PREFIX}${n.toString(this.RADIX)}`;
    },

    ofString: function (n: string): string {
        return this.ofBigInt(BigInt(n));
    }
};

function isInteger(exp: string): boolean {
    return RegExForInt.test(exp);
}

const RegExForInt = /^[-+]?\d+$/;
