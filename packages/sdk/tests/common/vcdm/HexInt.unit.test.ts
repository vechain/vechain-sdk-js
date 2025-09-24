import { describe, expect, test } from '@jest/globals';
import { Hex, HexInt } from '@common/vcdm';
import {
    IllegalArgumentError,
    UnsupportedOperationError
} from '@common/errors';

/**
 * Test HexInt class.
 * @group unit/vcdm
 */
describe('HexInt class tests', () => {
    describe('VeChain Data Model tests', () => {
        test('Return equals values for bi and n properties from bigint value', () => {
            const exp = -789514n; // Safe integer
            const hex = HexInt.of(exp);
            expect(hex.bi).toEqual(exp);
            expect(hex.n).toEqual(Number(exp));
            expect(hex.toString()).toEqual('-0x0c0c0a');
        });

        test('Return equals values for bi and n properties from number value', () => {
            const exp = 12648430; // Safe integer.
            const hex = HexInt.of(exp);
            expect(hex.n).toEqual(exp);
            expect(hex.bi).toEqual(BigInt(exp));
            expect(hex.toString()).toEqual('0xc0ffee');
        });

        test('Throw an exception if this integer is beyond safe integer range - underflow', () => {
            const largeBigInt = BigInt(Number.MIN_SAFE_INTEGER) - BigInt(10);
            const hexIntInstance = HexInt.of(largeBigInt);
            expect(() => hexIntInstance.n).toThrow(UnsupportedOperationError);
        });

        test('Throw an exception if this integer is beyond safe integer range - overflow', () => {
            const largeBigInt = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(10);
            const hexIntInstance = HexInt.of(largeBigInt);
            expect(() => hexIntInstance.n).toThrow(UnsupportedOperationError);
        });
    });

    describe('Construction tests', () => {
        test('Return an HexInt instance if the passed argument is a bigint', () => {
            const exp = 12357n;
            const hex = HexInt.of(exp);
            expect(hex).toBeInstanceOf(HexInt);
        });

        test('Return an HexInt instance if the passed argument is an integer number', () => {
            const exp = 12357;
            const hex = HexInt.of(exp);
            expect(hex).toBeInstanceOf(HexInt);
        });

        test('Return an HexInt instance if the passed argument is an string hexadecimal expression', () => {
            const exp = '-C0c0a'; // Safe integer -789514.
            const hex = HexInt.of(exp);
            expect(hex).toBeInstanceOf(HexInt);
        });

        test('Return a HexInt instance if the passed argunement is a transaction id', () => {
            const exp =
                '0x0000000000000000000000000000000000000000000000001234567890abcdef';
            const hex = HexInt.of(exp);
            expect(hex).toBeInstanceOf(HexInt);
        });

        test('Return an HexInt instance if the passed argument is an Hex', () => {
            const exp = Hex.of(-789514n);
            const hex = HexInt.of(exp);
            expect(hex).toBeInstanceOf(HexInt);
            expect(hex.isEqual(exp)).toBeTruthy();
        });

        test('Return an HexInt instance if the passed argument is Uint8Array', () => {
            const exp = Uint8Array.of(0xc0, 0xff, 0xee); // Safe integer 12648430.
            const hex = HexInt.of(exp);
            expect(hex).toBeInstanceOf(Hex);
        });

        test('Throw an exception if the passed argument is not an integer number', () => {
            const exp = 123.57;
            expect(() => HexInt.of(exp)).toThrow(IllegalArgumentError);
        });
    });

    describe('Polymorphism equivalence', () => {
        test('Equal for bigint, bytes, hex expression, number', () => {
            const ofBi = HexInt.of(255n);
            const ofBytes = HexInt.of(Uint8Array.of(255));
            const ofHex = HexInt.of('0xff');
            const ofN = HexInt.of(255);
            expect(ofBi.isEqual(ofBytes)).toBeTruthy();
            expect(ofBytes.isEqual(ofHex)).toBeTruthy();
            expect(ofHex.isEqual(ofN)).toBeTruthy();
        });
    });
});
