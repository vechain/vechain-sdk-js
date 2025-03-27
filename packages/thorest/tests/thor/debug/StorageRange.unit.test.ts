import { describe, expect, test } from '@jest/globals';
import { StorageRange, type StorageRangeJSON } from '../../../src/thor/debug';
import { ThorId } from '@vechain/sdk-core';

/**
 * VeChain storage range - unit
 *
 * @group unit/debug
 */
describe('StorageRange unit tests', () => {
    test('constructs with all fields', () => {
        const json: StorageRangeJSON = {
            nextKey: '0x0000000000000000000000000000456e65726779',
            storage: {
                '0x0000000000000000000000000000000000000000000000000000000000000001':
                    '0x0000000000000000000000000000000000000000000000000000000000000002'
            }
        };

        const range = new StorageRange(json);
        expect(range.nextKey).toEqual(
            json.nextKey !== undefined && json.nextKey !== ''
                ? ThorId.of(json.nextKey)
                : undefined
        );
        expect(range.storage).toEqual(json.storage);
    });

    test('constructs without nextKey', () => {
        const json: StorageRangeJSON = {
            storage: {
                '0x0000000000000000000000000000000000000000000000000000000000000001':
                    '0x0000000000000000000000000000000000000000000000000000000000000002'
            }
        };

        const range = new StorageRange(json);
        expect(range.nextKey).toBeUndefined();
        expect(range.storage).toEqual(json.storage);
    });

    test('toJSON returns correct format with all fields', () => {
        const json: StorageRangeJSON = {
            nextKey: '0x0000000000000000000000000000456e65726779',
            storage: {
                '0x0000000000000000000000000000000000000000000000000000000000000001':
                    '0x0000000000000000000000000000000000000000000000000000000000000002'
            }
        };

        const range = new StorageRange(json);
        const serialized = range.toJSON();

        // Use the normalized ThorId string in the expected output
        const expectedJson = {
            ...json,
            nextKey:
                json.nextKey !== undefined && json.nextKey !== ''
                    ? ThorId.of(json.nextKey).toString()
                    : undefined
        };

        expect(serialized).toEqual(expectedJson);
    });

    test('toJSON returns correct format without nextKey', () => {
        const json: StorageRangeJSON = {
            storage: {
                '0x0000000000000000000000000000000000000000000000000000000000000001':
                    '0x0000000000000000000000000000000000000000000000000000000000000002'
            }
        };

        const range = new StorageRange(json);
        const serialized = range.toJSON();
        expect(serialized).toEqual(json);
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
