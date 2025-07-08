import { describe, expect, test } from '@jest/globals';
import { Address, Hex } from '@vcdm';
import { StorageRangeOption, type StorageRangeOptionJSON } from '@thor';

/**
 * @group unit/debug
 */
describe('StorageRangeOption UNIT tests', () => {
    test('constructs with all fields', () => {
        const expected: StorageRangeOptionJSON = {
            address: '0xD8CCDD85abDbF68DFEc95f06c973e87B1b5A9997',
            keyStart:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
            maxResult: 10,
            target: '0x010709463c1f0c9aa66a31182fb36d1977d99bfb6526bae0564a0eac4006c31a/0/0'
        };

        const option = new StorageRangeOption(expected);
        expect(option.address).toBeInstanceOf(Address);
        expect(option.address.toString()).toBe(expected.address);
        expect(option.keyStart).toBeInstanceOf(Hex);
        expect(option.keyStart?.toString()).toBe(expected.keyStart);
        expect(typeof option.maxResult).toBe('number');
        expect(option.maxResult?.valueOf()).toBe(expected.maxResult);
        expect(option.target.toJSON()).toBe(expected.target);
    });

    test('constructs with minimal fields', () => {
        const expected: StorageRangeOptionJSON = {
            address: '0xD8CCDD85abDbF68DFEc95f06c973e87B1b5A9997',
            target: '0x010709463c1f0c9aa66a31182fb36d1977d99bfb6526bae0564a0eac4006c31a/0/0'
        };

        const option = new StorageRangeOption(expected);
        expect(option.address).toBeInstanceOf(Address);
        expect(option.address.toString()).toBe(expected.address);
        expect(option.keyStart).toBeNull();
        expect(option.maxResult).toBeNull();
        expect(option.target.toJSON()).toBe(expected.target);
    });

    test('toJSON returns correct format', () => {
        const expected: StorageRangeOptionJSON = {
            address: '0xD8CCDD85abDbF68DFEc95f06c973e87B1b5A9997',
            keyStart:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
            maxResult: 10,
            target: '0x010709463c1f0c9aa66a31182fb36d1977d99bfb6526bae0564a0eac4006c31a/0/0'
        };

        const option = new StorageRangeOption(expected);
        expect(option.toJSON()).toEqual(expected);
    });
});
