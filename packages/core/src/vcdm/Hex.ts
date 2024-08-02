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
        return nc_utils.hexToBytes(this.hex);
    }

    get n(): number {
        if (this.isNumber()) {
            return new DataView(this.bytes.buffer).getFloat64(0);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        throw new InvalidCastType<Hex>(
            'Hex.n',
            'not an IEEE 754 float 64 number',
            this
        );
    }

    compareTo(that: Hex): number {
        const thisBytes = this.bytes;
        const thatBytes = that.bytes;
        const compareLength = thisBytes.length - thatBytes.length;
        if (compareLength === 0) {
            let i = 0;
            let compareByte = 0;
            while (compareByte === 0 && i < thisBytes.length) {
                compareByte = thisBytes[i] - thatBytes[i];
                i++;
            }
            return compareByte;
        }
        return compareLength;
    }

    isEqual(that: Hex): boolean {
        return this.compareTo(that) === 0;
    }

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
}

export { Hex };
