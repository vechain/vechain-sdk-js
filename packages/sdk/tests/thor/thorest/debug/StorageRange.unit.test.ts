import { describe, expect, test } from '@jest/globals';
import { StorageRange } from '@thor/thorest/debug';
import { HexUInt32 } from '@common/vcdm';
import { type StorageRangeJSON } from '@thor/thorest/json';

/**
 * VeChain storage range - unit
 *
 * @group unit/debug
 */
describe('StorageRange UNIT tests', () => {
    test('constructs with all fields', () => {
        const expected: StorageRangeJSON = {
            nextKey: '0x0000000000000000000000000000456e65726779',
            storage: {
                '0x0000000000000000000000000000000000000000000000000000000000000001':
                    '0x0000000000000000000000000000000000000000000000000000000000000002'
            }
        };

        const range = new StorageRange(expected);
        expect(range.nextKey).toEqual(
            expected.nextKey !== undefined && expected.nextKey !== ''
                ? HexUInt32.of(expected.nextKey)
                : undefined
        );
        expect(range.storage).toEqual(expected.storage);
    });

    test('constructs without nextKey', () => {
        const expected: StorageRangeJSON = {
            storage: {
                '0x0000000000000000000000000000000000000000000000000000000000000001':
                    '0x0000000000000000000000000000000000000000000000000000000000000002'
            }
        };

        const range = new StorageRange(expected);
        expect(range.nextKey).toBeNull();
        expect(range.storage).toEqual(expected.storage);
    });

    test('toJSON returns correct format with all fields', () => {
        const expected: StorageRangeJSON = {
            nextKey: '0x0000000000000000000000000000456e65726779',
            storage: {
                '0x0000000000000000000000000000000000000000000000000000000000000001':
                    '0x0000000000000000000000000000000000000000000000000000000000000002'
            }
        };

        const range = new StorageRange(expected);
        const serialized = range.toJSON();

        // Use the normalized HexUInt32 string in the expected output
        const expectedJson = {
            ...expected,
            nextKey:
                expected.nextKey !== undefined && expected.nextKey !== ''
                    ? HexUInt32.of(expected.nextKey).toString()
                    : undefined
        };

        expect(serialized).toEqual(expectedJson);
    });

    test('toJSON returns correct format without nextKey', () => {
        const expected: StorageRangeJSON = {
            storage: {
                '0x0000000000000000000000000000000000000000000000000000000000000001':
                    '0x0000000000000000000000000000000000000000000000000000000000000002'
            }
        };

        const range = new StorageRange(expected);
        const serialized = range.toJSON();
        expect(serialized).toEqual(expected);
    });

    test('handles different storage types', () => {
        const testCases = [
            {
                storage: {
                    key: 'value'
                }
            },
            {
                storage: ['item1', 'item2']
            },
            {
                storage: 42
            },
            {
                storage: 'string value'
            },
            {
                storage: null
            }
        ];

        for (const testCase of testCases) {
            const range = new StorageRange(testCase);
            expect(range.storage).toEqual(testCase.storage);
            expect(range.toJSON().storage).toEqual(testCase.storage);
        }
    });
});
