import * as nc_utils from '@noble/curves/abstract/utils';
import { HEX, Quant } from '../../../../src';
import { describe, expect, test } from '@jest/globals';

/**
 * Text Hex representation from TS types prefixed with `0x`.
 * @group unit/utils/hex/experimental
 */
describe('HEX class tests', () => {
    test('constructor should create new hex - prefix', () => {
        const hex = new HEX('0x1234');
        expect(hex).toBeInstanceOf(HEX);
    });

    test('constructor should create new hex - no prefix', () => {
        const hex = new HEX('0x1234');
        expect(hex).toBeInstanceOf(HEX);
    });

    test('static isValid method should validate hex expressions', () => {
        expect(HEX.isValid('1234')).toBe(true);
        expect(HEX.isValid('0x123')).toBe(true);
        expect(HEX.isValid('ABCDEFG')).toBe(false);
    });

    test('static of method should return hexadecimal object depending on type of input', () => {
        const buffer = new Uint8Array([1, 2, 3, 4]);
        let hex = HEX.of(buffer);
        expect(hex).toBeInstanceOf(HEX);

        hex = HEX.of(123);
        expect(hex).toBeInstanceOf(HEX);

        hex = HEX.of(BigInt(1234));
        expect(hex).toBeInstanceOf(HEX);

        hex = HEX.of('hello world');
        expect(hex).toBeInstanceOf(HEX);
    });

    test('random method should generates hex random of specified length', () => {
        const bytesLength = 3;
        const hex = HEX.random(bytesLength);
        expect(hex).toBeInstanceOf(HEX);
        expect(hex.hex.length).toBe(bytesLength * 2);
    });

    test('trim method should remove leading zeros', () => {
        const hex = new HEX('000123');
        expect(hex.trim().toString()).toEqual('0x123');
    });

    test('trim method should return zero for zero value', () => {
        const hex = new HEX('000000');
        expect(hex.trim().toString()).toEqual('0x0');
    });

    test('bi getter should return bigint representation of hex', () => {
        const hex = HEX.of(123n);
        expect(hex.bi).toEqual(BigInt(123));
    });

    test('bytes getter should return Uint8Array representation of hex', () => {
        const hex = new HEX('1234');
        expect(hex.bytes).toEqual(new Uint8Array([0x12, 0x34]));
    });

    test('bn getter should return BigNumber representation of hex', () => {
        const hex = HEX.of(1234);
        expect(hex.bn.toString()).toEqual('1234');
    });

    test('compareTo should be positive if this longer than that', () => {
        const thisHex = new HEX('c1b8');
        const thatHex = new HEX('c1');
        expect(thisHex.compareTo(thatHex)).toBeGreaterThan(0);
    });

    test('compareTo should be positive if this > that, same length', () => {
        const thisHex = new HEX('c1b9');
        const thatHex = new HEX('C1B8');
        expect(thisHex.compareTo(thatHex)).toBeGreaterThan(0);
    });

    test('compareTo should be negative if this shorter than that', () => {
        const thisHex = new HEX('c1');
        const thatHex = new HEX('c1b8');
        expect(thisHex.compareTo(thatHex)).toBeLessThan(0);
    });

    test('compareTo should be negative if this < that, same length', () => {
        const thisHex = new HEX('c1b8');
        const thatHex = new HEX('C1B9');
        expect(thisHex.compareTo(thatHex)).toBeLessThan(0);
    });

    test('compareTo should zero negative if this = that', () => {
        const thisHex = new HEX('c1b8');
        const thatHex = new HEX('C1B8');
        expect(thisHex.compareTo(thatHex)).toBe(0);
    });

    test('isEqual should be false', () => {
        const thisHex = new HEX('c1b8');
        const thatHex = new HEX('cafe');
        expect(thisHex.isEqual(thatHex)).toBeFalsy();
    });

    test('isEqual should be true', () => {
        const thisHex = new HEX('c1b8');
        const thatHex = new HEX('C1B8');
        expect(thisHex.isEqual(thatHex)).toBeTruthy();
    });

    test('pad method should pad hex string', () => {
        const hex = new HEX('123');
        const paddedHex = hex.pad(3);
        expect(paddedHex.toString()).toEqual('0x000123');
    });

    test('text method should return an consistent NFC encoded string', () => {
        const text = 'Amélie';
        const hex = HEX.of(text);
        expect(hex.hex).toBe(
            nc_utils.bytesToHex(new TextEncoder().encode(text.normalize('NFC')))
        );
        expect(hex.text).toBe(text);
    });

    test('toString method should return string representation of hex with 0x prefix', () => {
        const hex = new HEX('1234');
        expect(hex.toString()).toEqual('0x1234');
    });
});

describe('Quant class tests', () => {
    test('constructor should create new hex - prefix', () => {
        const expected = '1234';
        const q = new Quant('0x00' + expected);
        expect(q).toBeInstanceOf(Quant);
        expect(q.hex).toBe(expected);
    });

    test('constructor should create new hex - no prefix', () => {
        const expected = '1234';
        const q = new Quant('0000' + expected);
        expect(q).toBeInstanceOf(Quant);
        expect(q.hex).toBe(expected);
    });

    test('static of method should return hexadecimal object depending on type of input', () => {
        const buffer = new Uint8Array([1, 2, 3, 4]);
        let q = Quant.of(buffer);
        expect(q).toBeInstanceOf(Quant);

        q = Quant.of(12357);
        expect(q).toBeInstanceOf(Quant);

        q = Quant.of(123457n);
        expect(q).toBeInstanceOf(Quant);

        q = Quant.of('Amélie');
        expect(q).toBeInstanceOf(Quant);
    });
});
