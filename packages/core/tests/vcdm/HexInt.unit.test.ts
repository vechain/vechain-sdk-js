import { afterEach, describe, expect, test } from '@jest/globals';
import { Hex, HexInt } from '../../src';
import { InvalidDataType } from '@vechain/sdk-errors';
import * as nh_utils from '@noble/hashes/utils';

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
            expect(() => hexIntInstance.n).toThrow(InvalidDataType);
        });

        test('Throw an exception if this integer is beyond safe integer range - overflow', () => {
            const largeBigInt = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(10);
            const hexIntInstance = HexInt.of(largeBigInt);
            expect(() => hexIntInstance.n).toThrow(InvalidDataType);
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
            expect(() => HexInt.of(exp)).toThrow(InvalidDataType);
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

    describe('random method tests', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });

        test('Return a deterministic HexInt when randomBytes is mocked', () => {
            const bytes = 4;
            const mockBytes = Uint8Array.of(0xde, 0xad, 0xbe, 0xef);
            const spy = jest
                .spyOn(nh_utils, 'randomBytes')
                .mockReturnValue(mockBytes);

            const hexInt = HexInt.random(bytes);
            expect(hexInt).toBeInstanceOf(HexInt);
            expect(hexInt.toString()).toEqual('0xdeadbeef');
            expect(spy).toHaveBeenCalledWith(bytes);
        });

        test('Throw for invalid byte length', () => {
            expect(() => HexInt.random(0)).toThrow(InvalidDataType);
        });
    });
});
