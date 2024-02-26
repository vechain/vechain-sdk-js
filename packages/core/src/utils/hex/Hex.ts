import { assert, DATA } from '@vechain/vechain-sdk-errors';
import { Buffer } from 'buffer';

// todo: let hex = bi.toString(16); it seems to to be the same bigint everyhere.

// check package/core/test/fixture.abi for zeroPadValue and hexlify, it seems expected hex are a nibble short.
// check package/network/test/subscriptions/fixture.ts for vechain_sdk_core_ethers.toBeHex(randomBigInt), it seems expected hex are a nibble short.
// todo: change padHexString?

/**
 * Represents the error messages used in the {@link Hex} object.
 * @enum {string}
 */
enum Error {
    NOT_INTEGER = `Arg 'n' not an integer.`,
    NOT_POSITIVE = `Arg 'n' not negative.`
}

/**
 * Helper class for encoding hexadecimal values.
 */
export const Hex = {
    ENCODING: 'hex' as BufferEncoding,
    PREFIX: '0x' as string,
    RADIX: 16,

    of: function (n: bigint | Uint8Array | number | string, bytes: number = 0) {
        if (typeof n === 'bigint') return this.ofBigInt(n, bytes);
        if (typeof n === 'number') return this.ofNumber(n, bytes);
        if (isBuffer(n)) return this.ofBuffer(n, bytes);
        return this.ofString(n, bytes);
    },

    of0x: function (
        n: bigint | Uint8Array | number | string,
        bytes: number = 0
    ) {
        return `${Hex.PREFIX}${this.of(n, bytes)}`;
    },

    ofBigInt: function (n: bigint, bytes: number): string {
        assert(n >= 0, DATA.INVALID_DATA_TYPE, Error.NOT_POSITIVE, {
            n
        });
        return pad(n.toString(this.RADIX), bytes);
    },

    ofBuffer(n: Uint8Array, bytes: number = 0): string {
        return pad(Buffer.from(n).toString(this.ENCODING), bytes);
    },

    ofNumber: function (n: number, bytes: number): string {
        assert(Number.isInteger(n), DATA.INVALID_DATA_TYPE, Error.NOT_INTEGER, {
            n
        });
        assert(n >= 0, DATA.INVALID_DATA_TYPE, Error.NOT_POSITIVE, {
            n
        });
        return pad(n.toString(this.RADIX), bytes);
    },

    ofString: function (n: string, bytes: number): string {
        return pad(Buffer.from(n).toString(this.ENCODING), bytes);
    }
};

function pad(exp: string, bytes: number): string {
    if (bytes > 0) {
        const gap = bytes - exp.length / 2;
        if (gap > 0) {
            return `${'00'.repeat(gap)}${exp}`;
        }
    }
    return exp;
}

function isBuffer(n: unknown): n is Uint8Array {
    return true;
}
