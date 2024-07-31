import { InvalidCastType } from '../../src/vcdm/InvalidCastType';
import { InvalidDataType } from '@vechain/sdk-errors';
import { InvalidVCDM } from './InvalidVCDM';
import { TextEncoder } from 'util';
import { Txt } from '../../src/vcdm/Txt';
import { describe, expect, test } from '@jest/globals';

const TEXT_ENCODER = new TextEncoder();

describe('Txt class', () => {
    test('bi getter should return a BigInt representation of the integer value', () => {
        const txt = Txt.of('123');
        expect(txt.bi).toBe(BigInt(123));
    });

    test('n getter should return a number representation of the value', () => {
        const txt = Txt.of('123.5');
        expect(txt.n).toBe(123.5);
    });

    test('bytes getter should return a Uint8Array representation of the value', () => {
        const txt = Txt.of('abc');
        expect(txt.bytes).toEqual(TEXT_ENCODER.encode('abc'));
    });

    test('compareTo method should correctly compare the instance with another', () => {
        const txt1 = Txt.of('a');
        const txt2 = Txt.of('b');
        expect(txt1.compareTo(txt2)).toBe(-1);
    });

    test('isEqual method should correctly check if the instance is equal to another', () => {
        const txt1 = Txt.of('a');
        const txt2 = Txt.of('a');
        expect(txt1.isEqual(txt2)).toBe(true);
    });

    test('Throws an error if data type is invalid', () => {
        expect(() => Txt.of(new InvalidVCDM())).toThrow(InvalidDataType);
    });

    test('Throw an error if a decimal value is cast to big integer', () => {
        const txt = Txt.of('12.3');
        expect(() => txt.bi).toThrow(InvalidCastType);
    });

    test('Returns the Txt instance if the passed argument is a Txt instance', () => {
        const txt = Txt.of('abc');
        expect(Txt.of(txt)).toBe(txt);
    });

    test('Returns a Txt instance if the passed argument is a bigint', () => {
        const txt = Txt.of(BigInt(10));
        expect(txt.toString()).toBe('10');
    });

    test('Returns a Txt instance if the passed argument is a number', () => {
        const txt = Txt.of(20);
        expect(txt.toString()).toBe('20');
    });

    test('Returns a Txt instance if the passed argument is a string', () => {
        const txt = Txt.of('abc');
        expect(txt.toString()).toBe('abc');
    });

    test('Returns a Txt instance if the passed argument is a Uint8Array', () => {
        const txt = Txt.of(TEXT_ENCODER.encode('abc'));
        expect(txt.toString()).toBe('abc');
    });
});
