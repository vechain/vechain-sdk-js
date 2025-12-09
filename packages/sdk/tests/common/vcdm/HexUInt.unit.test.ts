import { afterEach, describe, expect, test } from '@jest/globals';
import { HexUInt } from '@common/vcdm';
import { IllegalArgumentError } from '@common/errors';
import * as nh_utils from '@noble/hashes/utils';

/**
 * Test HexUInt class.
 * @group unit/vcdm
 */
describe('HexUInt class tests', () => {
    describe('Construction tests', () => {
        test('Return an HexUInt instance if the passed argument is positive', () => {
            const exp = '0xcaffee';
            const hi = HexUInt.of(exp);
            expect(hi).toBeInstanceOf(HexUInt);
        });

        test('Throw an error if the passed argument is negative', () => {
            const exp = '-0xcaffee';
            expect(() => HexUInt.of(exp)).toThrow(IllegalArgumentError);
        });
    });

    describe('Polymorphism equivalence', () => {
        test('Equal for bigint, bytes, hex expression, number', () => {
            const ofBi = HexUInt.of(255n);
            const ofBytes = HexUInt.of(Uint8Array.of(255));
            const ofHex = HexUInt.of('0xff');
            const ofN = HexUInt.of(255);
            expect(ofBi.isEqual(ofBytes)).toBeTruthy();
            expect(ofBytes.isEqual(ofHex)).toBeTruthy();
            expect(ofHex.isEqual(ofN)).toBeTruthy();
        });
    });

    describe('random method tests', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });

        test('Return a deterministic HexUInt with constant hex length', () => {
            const bytes = 4;
            const mockBytes = Uint8Array.of(0x12, 0x34, 0x56, 0x78);
            const spy = jest
                .spyOn(nh_utils, 'randomBytes')
                .mockReturnValue(mockBytes);

            const hexUInt = HexUInt.random(bytes);
            expect(hexUInt).toBeInstanceOf(HexUInt);
            expect(hexUInt.toString()).toEqual('0x12345678');
            expect(hexUInt.bi.toString(16)).toHaveLength(bytes * 2);
            expect(spy).toHaveBeenCalledWith(bytes);
        });

        test('Retry when random bytes would introduce a leading zero nibble', () => {
            const bytes = 2;
            const invalidBytes = Uint8Array.of(0x03, 0xaa); // Leading nibble 0
            const validBytes = Uint8Array.of(0xab, 0xcd);
            const spy = jest
                .spyOn(nh_utils, 'randomBytes')
                .mockImplementationOnce(() => invalidBytes)
                .mockImplementationOnce(() => validBytes);

            const hexUInt = HexUInt.random(bytes);

            expect(hexUInt.toString()).toEqual('0xabcd');
            expect(hexUInt.bi.toString(16)).toHaveLength(bytes * 2);
            expect(spy).toHaveBeenCalledTimes(2);
        });

        test('Throw for invalid byte length', () => {
            expect(() => HexUInt.random(0)).toThrow(IllegalArgumentError);
        });
    });
});
