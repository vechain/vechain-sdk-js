import * as nh_utils from '@noble/hashes/utils';
import * as nc_utils from '@noble/curves/abstract/utils';
import { InvalidCastType, InvalidDataType } from '@vechain/sdk-errors';
import { type VeChainDataModel } from './VeChainDataModel';

class Hex extends String implements VeChainDataModel<Hex> {
    protected static readonly RADIX: number = 16;

    private static readonly REGEX_HEX: RegExp = /^(0x)?[0-9a-f]*$/i;

    protected static readonly REGEX_PREFIX: RegExp = /^0x/i;

    public readonly hex: string;

    protected constructor(
        exp: string,
        normalize: (exp: string) => string = (exp) => exp.toLowerCase()
    ) {
        let value = exp;
        if (Hex.REGEX_PREFIX.test(value)) {
            value = value.slice(2);
        }
        if (Hex.isValid(value)) {
            value = normalize(value);
            super('0x' + value);
            this.hex = value;
        } else {
            throw new InvalidDataType(
                'Hex.constructor',
                'not an hexadecimal expression',
                { value }
            );
        }
    }

    get bi(): bigint {
        return nc_utils.hexToNumber(this.hex);
    }

    get bytes(): Uint8Array {
        return nc_utils.hexToBytes(this.alignToBytes().hex);
    }

    get n(): number {
        if (this.isNumber()) {
            return new DataView(this.bytes.buffer).getFloat64(0);
        }
        throw new InvalidCastType<Hex>(
            'Hex.n',
            'not an IEEE 754 float 64 number',
            this
        );
    }

    public alignToBytes(): Hex {
        return this.hex.length % 2 === 0 ? this : new Hex('0' + this.hex);
    }

    compareTo(that: Hex): number {
        const digits = Math.max(this.hex.length, that.hex.length);
        const thisBytes = this.fit(digits).bytes;
        const thatBytes = that.fit(digits).bytes;
        let i = 0;
        let compareByte = 0;
        while (compareByte === 0 && i < thisBytes.length) {
            compareByte = thisBytes[i] - thatBytes[i];
            i++;
        }
        return compareByte;
    }

    public fit(digits: number): Hex {
        if (digits < this.hex.length) {
            // Cut.
            let cue = 0;
            while (this.hex.length - cue > digits && this.hex.at(cue) === '0') {
                cue++;
            }
            if (this.hex.length - cue === digits) {
                return new Hex(this.hex.slice(cue));
            }
            throw new InvalidDataType(
                'Hex.fit',
                `can't fit in ${digits} digits`,
                { digits, hex: this }
            );
        }
        if (digits > this.hex.length) {
            // Pad.
            return new Hex('0'.repeat(digits - this.hex.length) + this.hex);
        }
        return this;
    }

    isEqual(that: Hex): boolean {
        return this.compareTo(that) === 0;
    }

    /**
     * Checks if this instance expresses a valid {@link Number} value
     * according the
     * [IEEE 754 double precision floating point format](https://en.wikipedia.org/wiki/Double-precision_floating-point_format).
     *
     * @returns {boolean} Returns true if this instance expresses 32 hex digits (16 bytes, 128 bits) needed to represent
     * a {@link Number} value, else it returns false.
     */
    isNumber(): boolean {
        return this.hex.length === 32;
    }

    /**
     * Checks if the given string expression is a valid hexadecimal value.
     *
     * @param {string} exp - The string representation of a hexadecimal value.
     *
     * @return {boolean} - True if the expression is a valid hexadecimal value, case-insensitive,
     * optionally prefixed with `0x`; false otherwise.
     */
    public static isValid(exp: string): boolean {
        return Hex.REGEX_HEX.test(exp);
    }

    public static isValid0x(exp: string): boolean {
        return Hex.REGEX_PREFIX.test(exp) && Hex.isValid(exp);
    }

    public static of(exp: bigint | number | string | Uint8Array): Hex {
        if (exp instanceof Uint8Array) {
            return new Hex(nc_utils.bytesToHex(exp));
        } else if (typeof exp === 'bigint') {
            return new Hex(nc_utils.numberToHexUnpadded(exp));
        } else if (typeof exp === 'number') {
            const dataView = new DataView(new ArrayBuffer(16));
            dataView.setFloat64(0, exp);
            return Hex.of(new Uint8Array(dataView.buffer));
        }
        return new Hex(exp);
    }

    public static random(bytes: number): Hex {
        if (bytes > 0) {
            return Hex.of(nh_utils.randomBytes(bytes));
        }
        throw new InvalidDataType('Hex.random', 'bytes argument not > 0', {
            bytes
        });
    }
}

export { Hex };
