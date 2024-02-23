import { assert, DATA } from '@vechain/vechain-sdk-errors';
import { Buffer } from 'buffer';

// todo: Buffer.from(dataUtils.removePrefix(data), 'hex');
// todo: hexlify
// todo: decodeBufferToHexWithLeadingZeros
// todo: let hex = bi.toString(16); it seems to to be the same bigint everyhere.
// todo: toBeHex

// todo: padHexString?

enum Error {
    NOT_INTEGER = `Arg 'n' not an integer.`,
    NOT_POSITIVE = `Arg 'n' not negative.`
}

export const Hex = {
    ENCODING: 'hex' as BufferEncoding,
    PREFIX: '0x' as string,
    RADIX: 16,

    of: function (n: bigint | Uint8Array | number | string) {
        if (typeof n === 'bigint') return this.ofBigInt(n);
        if (typeof n === 'number') return this.ofNumber(n);
        if (isBuffer(n)) return this.ofBuffer(n);
        return this.ofString(n);
    },

    of0x: function (n: bigint | Uint8Array | number | string) {
        return `${Hex.PREFIX}${this.of(n)}`;
    },

    ofBigInt: function (n: bigint): string {
        assert(n >= 0, DATA.INVALID_DATA_TYPE, Error.NOT_POSITIVE, {
            n
        });
        return n.toString(this.RADIX);
    },

    ofNumber: function (n: number): string {
        assert(Number.isInteger(n), DATA.INVALID_DATA_TYPE, Error.NOT_INTEGER, {
            n
        });
        assert(n >= 0, DATA.INVALID_DATA_TYPE, Error.NOT_POSITIVE, {
            n
        });
        return n.toString(this.RADIX);
    },

    ofString: function (n: string): string {
        return Buffer.from(n).toString(this.ENCODING);
    },

    ofBuffer(n: Uint8Array): string {
        return Buffer.from(n).toString(this.ENCODING);
    }
};

function isBuffer(n: unknown): n is Uint8Array {
    return true;
}
