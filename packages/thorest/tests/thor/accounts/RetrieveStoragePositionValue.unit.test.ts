import { describe, expect, jest, test } from '@jest/globals';
import { Address, BlockId, ThorId } from '@vechain/sdk-core';
import {
    RetrieveStoragePositionValue,
    RetrieveStoragePositionValuePath,
    GetStorageResponse,
    type GetStorageResponseJSON
} from '../../../src';
import {
    mockHttpClient,
    mockHttpClientWithError
} from '../../utils/MockUnitTestClient';
/**
 * VeChain retrieve storage position value - unit
 *
 * @group unit/accounts
 */
describe('RetrieveStoragePositionValue unit tests', () => {
    describe('RetrieveStoragePositionValuePath', () => {
        test('constructs correct path', () => {
            const address = Address.of(
                '0x93Ae8aab337E58A6978E166f8132F59652cA6C56'
            );
            const key = BlockId.of(
                '0x0000000000000000000000000000000000000000000000000000000000000001'
            );
            const path = new RetrieveStoragePositionValuePath(address, key);
            expect(path.path).toBe(`/accounts/${address}/storage/${key}`);
        });
    });

    describe('RetrieveStoragePositionValue', () => {
        test('static of() creates instance correctly', () => {
            const address = Address.of(
                '0x93Ae8aab337E58A6978E166f8132F59652cA6C56'
            );
            const key = BlockId.of(
                '0x0000000000000000000000000000000000000000000000000000000000000001'
            );
            const request = RetrieveStoragePositionValue.of(address, key);
            expect(request).toBeInstanceOf(RetrieveStoragePositionValue);
            expect(request.path).toBeInstanceOf(
                RetrieveStoragePositionValuePath
            );
            expect(request.path.address).toBe(address);
            expect(request.path.key).toBe(key);
        });

        test('askTo() processes response correctly', async () => {
            const address = Address.of(
                '0x93Ae8aab337E58A6978E166f8132F59652cA6C56'
            );
            const key = BlockId.of(
                '0x0000000000000000000000000000000000000000000000000000000000000001'
            );
            const mockResponse = {
                value: '0x000000000000000000000000000000000000000000000000000000000000002a'
            };

            const mockClient = mockHttpClient<GetStorageResponseJSON>(
                mockResponse,
                'get'
            );

            const request = RetrieveStoragePositionValue.of(address, key);
            const result = await request.askTo(mockClient);

            const getSpy = jest.spyOn(mockClient, 'get');
            expect(getSpy).toHaveBeenCalledWith(
                expect.any(RetrieveStoragePositionValuePath),
                { query: '' }
            );

            expect(result.request).toBe(request);
            expect(result.response).toBeInstanceOf(GetStorageResponse);
            expect(result.response.value).toBeInstanceOf(ThorId);
            expect(result.response.value.toString()).toBe(
                '0x000000000000000000000000000000000000000000000000000000000000002a'
            );
        });

        test('askTo() handles error response', async () => {
            const address = Address.of(
                '0x93Ae8aab337E58A6978E166f8132F59652cA6C56'
            );
            const key = BlockId.of(
                '0x0000000000000000000000000000000000000000000000000000000000000001'
            );

            const request = RetrieveStoragePositionValue.of(address, key);
            await expect(
                request.askTo(mockHttpClientWithError('Network error', 'get'))
            ).rejects.toThrow('Network error');
        });
    });
});
