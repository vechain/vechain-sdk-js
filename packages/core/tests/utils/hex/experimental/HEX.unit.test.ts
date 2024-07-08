import { HEX } from '../../../../src';
import { describe, expect, test } from '@jest/globals';

/**
 * Text Hex representation from TS types prefixed with `0x`.
 * @group unit/utils/hex/experimental
 */
describe('HEX class tests', () => {
    test('Constructor should create new hex - prefix', () => {
        const hex = new HEX('0x1234');
        expect(hex).toBeInstanceOf(HEX);
    });

    test('Constructor should create new hex - no prefix', () => {
        const hex = new HEX('0x1234');
        expect(hex).toBeInstanceOf(HEX);
    });

    test('isValid method should validate hex expressions', () => {
        expect(HEX.isValid('1234')).toBe(true);
        expect(HEX.isValid('0x123')).toBe(true);
        expect(HEX.isValid('ABCDEFG')).toBe(false);
    });

    test('Static of method should return hexadecimal object depending on type of input', () => {
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

    test('Trim method should remove leading zeros', () => {
        const hex = new HEX('000123');
        expect(hex.trim().toString()).toEqual('0x123');
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

    test('pad method should pad hex string', () => {
        const hex = new HEX('123');
        const paddedHex = hex.pad(3);
        expect(paddedHex.toString()).toEqual('0x000123');
    });

    test('toString method should return string representation of hex with 0x prefix', () => {
        const hex = new HEX('1234');
        expect(hex.toString()).toEqual('0x1234');
    });
});
