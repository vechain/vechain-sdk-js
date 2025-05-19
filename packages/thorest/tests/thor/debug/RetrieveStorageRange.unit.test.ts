import { describe, expect, jest, test } from '@jest/globals';
import { Address, ThorId, UInt } from '@vechain/sdk-core';
import {
    RetrieveStorageRange,
    StorageRangeOption,
    type StorageRangeOptionJSON,
    type StorageRangeJSON
} from '@thor/debug';
import {
    mockHttpClient,
    mockHttpClientWithError
} from '../../utils/MockUnitTestClient';

/**
 * VeChain retrieve storage range - unit
 *
 * @group unit/debug
 */
describe('RetrieveStorageRange unit tests', () => {
    describe('StorageRangeOption', () => {
        test('constructs with all fields', () => {
            const json: StorageRangeOptionJSON = {
                address: '0xD8CCDD85abDbF68DFEc95f06c973e87B1b5A9997',
                keyStart:
                    '0x0000000000000000000000000000000000000000000000000000000000000000',
                maxResult: 10,
                target: '0x010709463c1f0c9aa66a31182fb36d1977d99bfb6526bae0564a0eac4006c31a/0/0'
            };

            const option = new StorageRangeOption(json);
            expect(option.address).toBeInstanceOf(Address);
            expect(option.address.toString()).toBe(json.address);
            expect(option.keyStart).toBeInstanceOf(ThorId);
            expect(option.keyStart?.toString()).toBe(json.keyStart);
            expect(option.maxResult).toBeInstanceOf(UInt);
            expect(option.maxResult?.valueOf()).toBe(json.maxResult);
            expect(option.target).toBe(json.target);
        });

        test('constructs with minimal fields', () => {
            const json: StorageRangeOptionJSON = {
                address: '0xD8CCDD85abDbF68DFEc95f06c973e87B1b5A9997',
                target: '0x010709463c1f0c9aa66a31182fb36d1977d99bfb6526bae0564a0eac4006c31a/0/0'
            };

            const option = new StorageRangeOption(json);
            expect(option.address).toBeInstanceOf(Address);
            expect(option.address.toString()).toBe(json.address);
            expect(option.keyStart).toBeUndefined();
            expect(option.maxResult).toBeUndefined();
            expect(option.target).toBe(json.target);
        });

        test('toJSON returns correct format', () => {
            const json: StorageRangeOptionJSON = {
                address: '0xD8CCDD85abDbF68DFEc95f06c973e87B1b5A9997',
                keyStart:
                    '0x0000000000000000000000000000000000000000000000000000000000000000',
                maxResult: 10,
                target: '0x010709463c1f0c9aa66a31182fb36d1977d99bfb6526bae0564a0eac4006c31a/0/0'
            };

            const option = new StorageRangeOption(json);
            expect(option.toJSON()).toEqual(json);
        });
    });

    describe('RetrieveStorageRange', () => {
        test('static of() creates instance correctly', () => {
            const json: StorageRangeOptionJSON = {
                address: '0xD8CCDD85abDbF68DFEc95f06c973e87B1b5A9997',
                keyStart:
                    '0x0000000000000000000000000000000000000000000000000000000000000000',
                maxResult: 10,
                target: '0x010709463c1f0c9aa66a31182fb36d1977d99bfb6526bae0564a0eac4006c31a/0/0'
            };

            const request = RetrieveStorageRange.of(json);
            expect(request).toBeInstanceOf(RetrieveStorageRange);
            expect(request.request).toBeInstanceOf(StorageRangeOption);
            expect(request.request.toJSON()).toEqual(json);
        });

        test('askTo() processes response correctly', async () => {
            const requestJson: StorageRangeOptionJSON = {
                address: '0xD8CCDD85abDbF68DFEc95f06c973e87B1b5A9997',
                keyStart:
                    '0x0000000000000000000000000000000000000000000000000000000000000000',
                maxResult: 10,
                target: '0x010709463c1f0c9aa66a31182fb36d1977d99bfb6526bae0564a0eac4006c31a/0/0'
            };

            const mockResponse = {
                nextKey:
                    '0x0000000000000000000000000000000000000000000000000000000000000001',
                storage: {
                    '0x0000000000000000000000000000000000000000000000000000000000000000':
                        'value1',
                    '0x0000000000000000000000000000000000000000000000000000000000000001':
                        'value2'
                }
            } satisfies StorageRangeJSON;

            const mockClient = mockHttpClient<StorageRangeJSON>(
                mockResponse,
                'post'
            );

            const request = RetrieveStorageRange.of(requestJson);
            const result = await request.askTo(mockClient);

            const postSpy = jest.spyOn(mockClient, 'post');
            expect(postSpy).toHaveBeenCalledWith(
                RetrieveStorageRange.PATH,
                { query: '' },
                requestJson
            );

            expect(result.request).toBe(request);
            expect(result.response).toEqual(mockResponse);
        });

        test('askTo() handles error response', async () => {
            const requestJson: StorageRangeOptionJSON = {
                address: '0xD8CCDD85abDbF68DFEc95f06c973e87B1b5A9997',
                target: '0x010709463c1f0c9aa66a31182fb36d1977d99bfb6526bae0564a0eac4006c31a/0/0'
            };

            const request = RetrieveStorageRange.of(requestJson);
            await expect(
                request.askTo(mockHttpClientWithError('Network error', 'post'))
            ).rejects.toThrow('Network error');
        });
    });
});
