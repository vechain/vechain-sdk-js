import { describe, expect, jest, test } from '@jest/globals';
import { Address, Hex, HexUInt32 } from '@common/vcdm';
import {
    RetrieveStoragePositionValue,
    RetrieveStoragePositionValuePath,
    GetStorageResponse,
    ThorError,
    RetrieveStoragePositionValueQuery
} from '@thor/thorest';
import {
    mockHttpClient,
    mockHttpClientWithError
} from '../../../MockHttpClient';
import { type GetStorageResponseJSON } from '@thor/thorest/json';
/**
 * VeChain retrieve storage position value - unit
 *
 * @group unit/thor/accounts
 */
describe('RetrieveStoragePositionValue unit tests', () => {
    describe('RetrieveStoragePositionValuePath', () => {
        test('constructs correct path', () => {
            const address = Address.of(
                '0x93Ae8aab337E58A6978E166f8132F59652cA6C56'
            );
            const key = HexUInt32.of(
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
            const key = HexUInt32.of(
                '0x0000000000000000000000000000000000000000000000000000000000000001'
            );
            const request = RetrieveStoragePositionValue.of(address, key);
            expect(request).toBeInstanceOf(RetrieveStoragePositionValue);
            expect(
                (
                    request as unknown as {
                        path: RetrieveStoragePositionValuePath;
                    }
                ).path
            ).toBeInstanceOf(RetrieveStoragePositionValuePath);
            expect(
                (
                    request as unknown as {
                        path: RetrieveStoragePositionValuePath;
                    }
                ).path.address
            ).toBe(address);
            expect(
                (
                    request as unknown as {
                        path: RetrieveStoragePositionValuePath;
                    }
                ).path.key
            ).toBe(key);
        });

        test('askTo() processes response correctly', async () => {
            const address = Address.of(
                '0x93Ae8aab337E58A6978E166f8132F59652cA6C56'
            );
            const key = HexUInt32.of(
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
                expect.any(RetrieveStoragePositionValueQuery)
            );

            expect(result.request).toBe(request);
            expect(result.response).toBeInstanceOf(GetStorageResponse);
            expect(result.response.value).toBeInstanceOf(Hex);
            expect(result.response.value.toString()).toBe(
                '0x000000000000000000000000000000000000000000000000000000000000002a'
            );
        });

        test('askTo() handles error response', async () => {
            const address = Address.of(
                '0x93Ae8aab337E58A6978E166f8132F59652cA6C56'
            );
            const key = HexUInt32.of(
                '0x0000000000000000000000000000000000000000000000000000000000000001'
            );

            const request = RetrieveStoragePositionValue.of(address, key);
            const mockClient = mockHttpClientWithError('Network error', 'get');

            try {
                await request.askTo(mockClient);
                // Triggers the catch block
                expect(true).toBe(false);
            } catch (error) {
                expect(error).toBeInstanceOf(ThorError);
                const thorError = error as ThorError;

                expect(thorError.message).toBe('Bad response.');
                expect(thorError.fqn).toBe(
                    'packages/sdk/src/thor/thorest/accounts/methods/RetrieveStoragePositionValue.ts!askTo(httpClient: HttpClient): Promise<ThorResponse<RetrieveStoragePositionValue, GetStorageResponse>>'
                );
                expect(thorError.status).toBe(400);
                expect(thorError.args).toEqual({
                    url: expect.any(String)
                });
                expect(thorError.cause).toBeUndefined();
                expect(thorError).toBeInstanceOf(Error);
            }
        });
    });
});
